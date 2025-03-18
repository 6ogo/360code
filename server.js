import dotenv from 'dotenv';
import express from 'express';
import { Octokit } from '@octokit/rest';
import parseDiff from 'parse-diff';
import fetch from 'node-fetch';

// Initialize dotenv
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repos = ['6ogo/app.360code.io', '6ogo/360code'];

// IMPORTANT: We need to check the subdomain BEFORE serving static files
app.use((req, res, next) => {
    try {
        console.log('Request hostname:', req.hostname);
        console.log('Accept header:', req.headers.accept);

        // Check if this is the timeline subdomain
        if (req.hostname === 'timeline.360code.io' ||
            req.hostname === 'timeline' ||
            req.headers.host === 'timeline.360code.io') {

            console.log('Timeline subdomain detected, path:', req.path);

            // For the root path of the subdomain
            if (req.path === '/' || req.path === '') {
                // Set CORS and cache headers
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');

                // Check if this is a JSON request
                const acceptHeader = req.headers.accept || '';
                if (acceptHeader.includes('application/json')) {
                    console.log('JSON request detected, generating timeline');
                    generateTimeline()
                        .then(timeline => {
                            res.setHeader('Content-Type', 'application/json');
                            res.json(timeline);
                        })
                        .catch(error => {
                            console.error('Error generating timeline:', error);
                            res.status(500).json({ 
                                error: 'Failed to generate timeline', 
                                message: error.message,
                                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                            });
                        });
                    return;
                } else {
                    console.log('HTML request detected');
                    return res.sendFile('index.html', { root: './public' });
                }
            }

            // For other paths on the timeline subdomain
            return res.sendFile('subdomain.html', { root: './public' });
        }

        next();
    } catch (error) {
        console.error('Error in subdomain middleware:', error);
        res.status(500).json({ 
            error: 'Error in subdomain middleware', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Traditional /timeline endpoint
app.get('/timeline', async (req, res) => {
    try {
        console.log('Received request to /timeline endpoint');
        const timeline = await generateTimeline();
        res.json(timeline);
    } catch (error) {
        console.error('Error in /timeline endpoint:', error);
        res.status(500).json({ 
            error: 'Error fetching timeline data', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Serve static files AFTER checking for subdomain
app.use(express.static('public'));

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
    try {
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
            try {
                const head = dayCommits[dayCommits.length - 1].sha;
                let base = previousHead || '4b825dc642cb6eb9a060e54bf8d69288fbee4904'; // Empty tree SHA
                const diff = await getCompareDiff(owner, repo, base, head);
                dailyChanges[date] = parseDiffToChanges(diff);
                previousHead = head;
            } catch (error) {
                console.error(`Error processing commits for ${date}:`, error);
                dailyChanges[date] = { added: [], removed: [], modified: [] };
            }
        }

        return dailyChanges;
    } catch (error) {
        console.error(`Error in getDailyChanges for ${owner}/${repo}:`, error);
        return {}; // Return empty object on error
    }
}

async function getCompareDiff(owner, repo, base, head) {
    try {
        const { data } = await octokit.repos.compareCommits({ owner, repo, base, head });
        if (data.diff_url) {
            try {
                const response = await fetch(data.diff_url);
                if (!response.ok) {
                    console.error(`Fetch error for diff_url: ${response.status} ${response.statusText}`);
                    return '';
                }
                return await response.text();
            } catch (fetchError) {
                console.error(`Error fetching diff content:`, fetchError);
                return '';
            }
        }
        return '';
    } catch (error) {
        console.error(`Error in getCompareDiff for ${owner}/${repo} comparing ${base}...${head}:`, error);
        return '';
    }
}

function parseDiffToChanges(diffText) {
    try {
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
    } catch (error) {
        console.error('Error parsing diff:', error);
        return { added: [], removed: [], modified: [] };
    }
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