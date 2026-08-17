async function fetchSeeds() {
    const seedList = document.getElementById('seed-list');
    try {
        const response = await fetch('/api/seeds');
        if (!response.ok) throw new Error('Failed to fetch seeds');
        const seeds = await response.json();
        
        if (seeds.length === 0) {
            seedList.innerHTML = '<li>The garden is currently empty. Plant some seeds!</li>';
            return;
        }

        seedList.innerHTML = seeds
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(seed => `<li><strong>${new Date(seed.timestamp).toLocaleDateString()}</strong>: ${seed.text}</li>`)
            .join('');
    } catch (error) {
        console.error('Error fetching seeds:', error);
        seedList.innerHTML = '<li>Error loading seeds. Please try again later.</li>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Garden initialized.");
    fetchSeeds();
});
