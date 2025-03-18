// For timeline.360code.io, fetch from root, otherwise use /timeline
const timelineEndpoint = window.location.hostname === 'timeline.360code.io' ? '/' : '/timeline';

console.log(`Fetching timeline data from: ${timelineEndpoint}`);

fetch(timelineEndpoint)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const timelineDiv = document.getElementById('timeline');
    const sortedDates = Object.keys(data).sort().reverse(); // Newest first

    if (sortedDates.length === 0) {
      timelineDiv.innerHTML = '<div class="no-data">No timeline data available</div>';
      return;
    }

    sortedDates.forEach(date => {
      const card = document.createElement('div');
      card.className = 'card';

      const dateHeader = document.createElement('div');
      dateHeader.className = 'date';
      dateHeader.textContent = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      card.appendChild(dateHeader);

      const changes = data[date];
      for (const [repo, change] of Object.entries(changes)) {
        if (change.added.length || change.removed.length || change.modified.length) {
          const repoDiv = document.createElement('div');
          repoDiv.className = 'repo';
          repoDiv.innerHTML = `<strong>${repo}</strong>`;

          if (change.added.length) {
            const addedDiv = document.createElement('div');
            addedDiv.className = 'added';
            addedDiv.textContent = 'Added: ' + change.added.map(a => 
              `${a.file}${a.functions.length ? ': ' + a.functions.join(', ') : ''}`
            ).join(', ');
            repoDiv.appendChild(addedDiv);
          }

          if (change.removed.length) {
            const removedDiv = document.createElement('div');
            removedDiv.className = 'removed';
            removedDiv.textContent = 'Removed: ' + change.removed.join(', ');
            repoDiv.appendChild(removedDiv);
          }

          if (change.modified.length) {
            const modifiedDiv = document.createElement('div');
            modifiedDiv.className = 'modified';
            modifiedDiv.textContent = 'Modified: ' + change.modified.map(m => 
              `${m.file}: ${m.changes.join(', ')}`
            ).join(', ');
            repoDiv.appendChild(modifiedDiv);
          }

          card.appendChild(repoDiv);
        }
      }

      timelineDiv.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error fetching timeline data:', error);
    document.getElementById('timeline').innerHTML = 
      `<div class="error">Failed to load timeline: ${error.message}</div>`;
  });