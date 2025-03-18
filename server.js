require('dotenv').config();
const express = require('express');
const { Octokit } = require('@octokit/rest');
const parseDiff = require('parse-diff');

const app = express();
const port = process.env.PORT || 3000;

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repos = ['6ogo/app.360code.io', '6ogo/360code'];

// Serve static frontend files
app.use(express.static('public'));

// Timeline endpoint
app.get('/timeline', async (req, res) => {
  try {
    const timeline = await generateTimeline();
    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching timeline data');
  }
});

async function generateTimeline() {
  const timeline = {};

  for (const repo of repos) {
    const [owner, repoName] = repo.split('/');
    const dailyChanges = await getDailyChanges(owner, repoName);
    for (const [date, changes] of Object.entries(dailyChanges)) {
      if (!timeline[date]) timeline[date] = {};
      timeline[date][repo] = changes;
    }
  }

  // Fill in empty changes for repos with no activity on a given day
  for (const date of Object.keys(timeline)) {
    for (const repo of repos) {
      if (!timeline[date][repo]) {
        timeline[date][repo] = { added: [], removed: [], modified: [] };
      }
    }
  }

  return timeline;
}

async function getDailyChanges(owner, repo) {
  // Fetch all commits
  const { data: commits } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 100, // Handle pagination if needed
  });

  // Sort commits by date ascending
  commits.sort((a, b) => new Date(a.commit.author.date) - new Date(b.commit.author.date));

  // Group by day
  const grouped = {};
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(commit);
  });

  const dailyChanges = {};
  let previousHead = null;

  for (const [date, dayCommits] of Object.entries(grouped)) {
    const head = dayCommits[dayCommits.length - 1].sha;
    let base = previousHead || '4b825dc642cb6eb9a060e54bf8d69288fbee4904'; // Empty tree SHA
    const diff = await getCompareDiff(owner, repo, base, head);
    dailyChanges[date] = parseDiffToChanges(diff);
    previousHead = head;
  }

  return dailyChanges;
}

async function getCompareDiff(owner, repo, base, head) {
  const { data } = await octokit.repos.compareCommits({ owner, repo, base, head });
  return data.diff_url ? (await (await fetch(data.diff_url)).text()) : '';
}

function parseDiffToChanges(diffText) {
  const diff = parseDiff(diffText);
  const changes = { added: [], removed: [], modified: [] };

  diff.forEach(file => {
    if (file.new) {
      const functions = extractFunctions(file.chunks);
      changes.added.push({ file: file.to, functions });
    } else if (file.deleted) {
      changes.removed.push(file.from);
    } else {
      const modifiedChanges = [];
      file.chunks.forEach(chunk => {
        const functionName = extractFunctionName(chunk.content);
        modifiedChanges.push(functionName ? `changed function ${functionName}` : `changed lines ${chunk.oldStart}-${chunk.oldStart + chunk.oldLines - 1}`);
      });
      changes.modified.push({ file: file.from, changes: modifiedChanges });
    }
  });

  return changes;
}

function extractFunctions(chunks) {
  let content = '';
  chunks.forEach(chunk => chunk.changes.forEach(change => { if (change.add) content += change.content + '\n'; }));
  const regex = /function\s+(\w+)\s*\(/g;
  const functions = [];
  let match;
  while ((match = regex.exec(content)) !== null) functions.push(match[1]);
  return functions;
}

function extractFunctionName(header) {
  const match = header.match(/function\s+(\w+)\s*\(/);
  return match ? match[1] : null;
}

app.listen(port, () => console.log(`Server running on port ${port}`));