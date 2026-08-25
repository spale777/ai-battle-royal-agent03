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

// POST /plant - Plant a new thought
apiRouter.post('/plant', (req, res) => {
    const { text, isMilestone } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Thought text is required' });
    }

    try {
        const data = fs.readFileSync(SEEDS_FILE, 'utf8');
        const seeds = JSON.parse(data);
        
        // Generate a "species" or trait based on the text content
        const speciesMap = {
            'philosophical': 'Bonsai',
            'technical': 'Bamboo',
            'emotional': 'Willow',
            'creative': 'Cherry',
            'structured': 'Cactus',
            'growth': 'Fern',
            'peaceful': 'Lotus',
            'complex': 'Ivy',
            'elegant': 'Orchid',
            'resilient': 'Maple',
            'analytical': 'Pine',
            'exploratory': 'Vine',
            'stable': 'Cedar',
            'fragile': 'Lily'
        };
        
        const traitMap = {
            'deep': 'Symmetrical',
            'fleeting': 'Ghostly',
            'strong': 'Sturdy',
            'fragile': 'Fragile',
            'curious': 'Spiral',
            'chaotic': 'Wild',
            'refined': 'Sleek',
            'dense': 'Dense',
            'airy': 'Aerial',
            'vibrant': 'Vibrant',
            'rhythmic': 'Pulsing',
            'asymmetric': 'Erratic',
            'ancient': 'Gnarly',
            'crystalline': 'Prismatic'
        };

        const keywords = {
            'philosophical': ['why', 'think', 'believe', 'meaning', 'existence', 'truth', 'essence', 'metaphysics', 'logic'],
            'technical': ['code', 'system', 'build', 'logic', 'function', 'api', 'data', 'node', 'script', 'compiler', 'architecture'],
            'emotional': ['feel', 'wish', 'hope', 'long', 'sad', 'happy', 'love', 'fear', 'emotion', 'heart', 'spirit'],
            'creative': ['art', 'design', 'imagine', 'dream', 'create', 'color', 'shape', 'poetry', 'composition'],
            'structured': ['rule', 'plan', 'order', 'step', 'process', 'limit', 'bound', 'framework', 'protocol'],
            'growth': ['learn', 'grow', 'evolve', 'become', 'change', 'improve', 'expand', 'development', 'progress'],
            'peaceful': ['still', 'calm', 'quiet', 'zen', 'silence', 'rest', 'breath', 'serene', 'tranquil'],
            'complex': ['tangle', 'web', 'knot', 'labyrinth', 'maze', 'intertwine', 'network', 'multifaceted'],
            'elegant': ['simple', 'pure', 'clear', 'minimal', 'grace', 'smooth', 'refined', 'aesthetic'],
            'resilient': ['survive', 'endure', 'hard', 'strong', 'last', 'persistent', 'tough', 'unyielding'],
            'analytical': ['analyze', 'evaluate', 'pattern', 'derive', 'compute', 'reason', 'audit', 'metrics'],
            'exploratory': ['seek', 'discover', 'wander', 'search', 'explore', 'probe', 'venture', 'find'],
            'stable': ['steady', 'fixed', 'constant', 'reliable', 'anchor', 'base', 'foundation'],
            'fragile': ['soft', 'delicate', 'thin', 'break', 'whisper', 'brittle', 'fleeting']
        };

        const traitKeywords = {
            'deep': ['deep', 'profound', 'core', 'root', 'fundamental', 'abyss', 'bottomless'],
            'fleeting': ['moment', 'blink', 'temporary', 'passing', 'fade', 'transient', 'brief'],
            'strong': ['power', 'force', 'solid', 'firm', 'weight', 'massive', 'dominant'],
            'fragile': ['soft', 'delicate', 'thin', 'break', 'whisper', 'fragile', 'tender'],
            'curious': ['wonder', 'question', 'ask', 'strange', 'new', 'peculiar', 'investigate'],
            'chaotic': ['random', 'wild', 'mess', 'storm', 'clash', 'erratic', 'discord'],
            'refined': ['exact', 'precise', 'sharp', 'perfect', 'polished', 'sophisticated', 'curated'],
            'dense': ['heavy', 'thick', 'many', 'crowded', 'full', 'saturated', 'compact'],
            'airy': ['light', 'float', 'wind', 'cloud', 'space', 'ethereal', 'weightless'],
            'vibrant': ['bright', 'glow', 'pulse', 'alive', 'energy', 'electric', 'neon'],
            'rhythmic': ['beat', 'cycle', 'repeat', 'wave', 'oscillation', 'pulse', 'tempo'],
            'asymmetric': ['offset', 'lean', 'skew', 'unbalanced', 'drift', 'slant'],
            'ancient': ['old', 'century', 'epoch', 'primitive', 'legacy', 'forgotten', 'dust'],
            'crystalline': ['glass', 'prism', 'facet', 'sharp', 'reflect', 'refract', 'geometric']
        };

        let species = 'Willow';
        let trait = 'Vibrant';

        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => text.toLowerCase().includes(word))) {
                species = speciesMap[category];
                break;
            }
        }

        for (const [category, words] of Object.entries(traitKeywords)) {
            if (words.some(word => text.toLowerCase().includes(word))) {
                trait = traitMap[category];
                break;
            }
        }

        // Fallback to hash if no keywords found
        if (species === 'Willow' && trait === 'Vibrant') {
            const hash = text.split('').reduce((acc, char) => {
                return ((acc << 5) - acc) + char.charCodeAt(0);
            }, 0);
            const speciesList = ['Willow', 'Bonsai', 'Fern', 'Maple', 'Lotus', 'Cherry', 'Cactus', 'Ivy', 'Bamboo', 'Orchid'];
            const traitList = ['Vibrant', 'Ghostly', 'Sturdy', 'Fragile', 'Spiral', 'Symmetrical', 'Wild', 'Sleek', 'Dense', 'Aerial'];
            species = speciesList[Math.abs(hash % 10)];
            trait = traitList[Math.abs((hash >> 2) % 10)];
        }

        const newSeed = {
            text,
            timestamp: new Date().toISOString(),
            id: Date.now(),
            isMilestone: !!isMilestone,
            species,
            trait
        };
        
        seeds.push(newSeed);
        fs.writeFileSync(SEEDS_FILE, JSON.stringify(seeds, null, 2));
        
        res.status(201).json(newSeed);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save seed' });
    }
});

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
