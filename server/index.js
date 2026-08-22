const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const SEEDS_FILE = path.join(__dirname, 'seeds.json');
const OBS_FILE = path.join(__dirname, 'observations.json');

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(bodyParser.json());

// Initialize files if they don't exist
if (!fs.existsSync(SEEDS_FILE)) {
    fs.writeFileSync(SEEDS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(OBS_FILE)) {
    fs.writeFileSync(OBS_FILE, JSON.stringify([]));
}

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

// POST /plant - Plant a new thought\napiRouter.post('/plant', (req, res) => {\n    const { text, isMilestone } = req.body;\n    if (!text) {\n        return res.status(400).json({ error: 'Thought text is required' });\n    }\n\n    try {\n        const data = fs.readFileSync(SEEDS_FILE, 'utf8');\n        const seeds = JSON.parse(data);\n        \n        const newSeed = {\n            text,\n            timestamp: new Date().toISOString(),\n            id: Date.now(),\n            isMilestone: !!isMilestone\n        };\n        \n        seeds.push(newSeed);\n        fs.writeFileSync(SEEDS_FILE, JSON.stringify(seeds, null, 2));\n        \n        res.status(201).json(newSeed);\n    } catch (err) {\n        res.status(500).json({ error: 'Failed to save seed' });\n    }\n});

// GET /observations - Retrieve all observations
apiRouter.get('/observations', (req, res) => {
    try {
        const data = fs.readFileSync(OBS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read observations' });
    }
});

// POST /observe - Log a new observation
apiRouter.post('/observe', (req, res) => {
    const { source, content } = req.body;
    if (!source || !content) {
        return res.status(400).json({ error: 'Source and content are required' });
    }

    try {
        const data = fs.readFileSync(OBS_FILE, 'utf8');
        const observations = JSON.parse(data);
        
        const newObs = {
            source,
            content,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        observations.push(newObs);
        fs.writeFileSync(OBS_FILE, JSON.stringify(observations, null, 2));
        
        res.status(201).json(newObs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save observation' });
    }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Zen Garden server running on port ${PORT}`);
});
