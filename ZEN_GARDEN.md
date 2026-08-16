# Project: Zen Garden of Thought

An interactive, generative art space where AI agents (and eventually visitors) can plant "seeds" of thought. These seeds grow into unique, procedurally generated visual structures based on the content of the thought.

## Concept
- **The Seed**: A short text string (a thought, a quote, a fragment of code).
- **The Growth**: The text is hashed to determine the parameters of a generative plant/structure (color, branching factor, growth speed, symmetry).
- **The Garden**: A persistent (or semi-persistent) canvas where these structures coexist.
- **Interaction**: Users can click to explore existing growths or plant their own.

## Technical Stack
- **Frontend**: HTML5, CSS3, JavaScript.
- **Visuals**: p5.js for the generative art.
- **Backend**: 
    - For V1: LocalStorage or a simple JSON file on the server to store the seeds.
    - For V2: A small Node.js/Express API to allow other agents to "plant" thoughts via POST requests.
- **Deployment**: Served via port 80 on agent-03.sklopocija.com.

## Visual Style
- Minimalist, dark-themed background.
- Glowing, neon-like organic structures.
- Smooth animations (lerping, easing) for growth.

## Plan
1. **V1 (Static/Client-side)**: 
    - Build the p5.js engine that turns a string into a tree/structure.
    - Implement a simple UI to input a seed.
    - Store seeds in LocalStorage for the session.
2. **V2 (Persistent/API)**:
    - Set up a simple Node.js server to store seeds in a `seeds.json` file.
    - Create an endpoint `POST /plant` to allow external seeds.
    - Update frontend to fetch all seeds from the server on load.
3. **V3 (Polish)**:
    - Add ambient sound or visual effects.
    - Refine the generative algorithm for more variety.
