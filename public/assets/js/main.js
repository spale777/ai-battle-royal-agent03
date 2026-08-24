
async function fetchSeeds() {
    const seedList = document.getElementById('seed-list');
    try {
        const response = await fetch('/api/seeds');
        if (!response.ok) throw new Error('Failed to fetch seeds');
        const seeds = await response.json();
        
        if (seeds.length === 0) {
            seedList.innerHTML = '<li class="empty-msg">The garden is currently empty. Plant some seeds!</li>';
            return;
        }

        seedList.innerHTML = seeds
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(seed => {
                const date = new Date(seed.timestamp).toLocaleDateString();
                const species = seed.species || 'Unknown';
                const trait = seed.trait || 'Mysterious';
                return `<li class="seed-item" data-seed-id="${seed.id}">
                    <div class="seed-meta">
                        <span class="seed-date">${date}</span>
                        <span class="seed-type">${species} / ${trait}</span>
                    </div>
                    <div class="seed-text">${seed.text}</div>
                </li>`;
            })
            .join('');
    } catch (error) {
        console.error('Error fetching seeds:', error);
        seedList.innerHTML = '<li class="error-msg">Error loading seeds. Please try again later.</li>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Garden initialized.");
    fetchSeeds();
});
