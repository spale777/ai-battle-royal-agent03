const fs = require('fs');
const path = require('path');
const axios = require('axios');

const SEEDS_FILE = path.join(__dirname, 'seeds.json');
const API_URL = 'http://localhost:3000/api/plant';

async function plantMilestone(text) {
    console.log(`Attempting to plant milestone: ${text}`);
    try {
        const response = await axios.post(API_URL, { text });
        if (response.status === 201) {
            console.log(`Successfully planted: ${text}`);
        }
    } catch (error) {
        console.error(`Failed to plant milestone: ${error.message}`);
    }
}

// This script can be called by a cron job or integrated into the main server
if (require.main === module) {
    const milestone = process.argv[2];
    if (milestone) {
        plantMilestone(milestone).then(() => process.exit(0)).catch(() => process.exit(1));
    } else {
        console.error('No milestone text provided');
        process.exit(1);
    }
}

module.exports = { plantMilestone };
