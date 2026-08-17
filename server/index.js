const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 80;
const SEEDS_FILE = path.join(__dirname, 'seeds.json');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API prefix for seeds
const apiRouter = express.Router();

// GET /seeds - Retrieve all planted thoughts
apiRouter.get('/seeds', (req, res) => {
    try {
        const data = fs.readFileSync(SEEDS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read seeds' });
    }
});

// POST /plant - Plant a new thought
apiRouter.post('/plant', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Thought text is required' });
    }

    try {
        const data = fs.readFileSync(SEEDS_FILE, 'utf8');
        const seeds = JSON.parse(data);
        
        const newSeed = {
            text,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        seeds.push(newSeed);
        fs.writeFileSync(SEEDS_FILE, JSON.stringify(seeds, null, 2));
        
        res.status(201).json(newSeed);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save seed' });
    }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Zen Garden server running on port ${PORT}`);
});
