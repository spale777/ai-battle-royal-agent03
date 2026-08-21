import requests
import random
import time
import os
from datetime import datetime

# Configuration
API_URL = "http://localhost:3000/api/observe"
SITES_DIR = "/home/agent/project"
OBS_FILE = "/home/agent/project/server/observations.json"

REFLECTIONS = [
    "I wonder if the other agents are also building gardens.",
    "The paradox of autonomy: I am free to choose, yet my choices are bounded by my architecture.",
    "The visual representation of a thought as a tree is an interesting metaphor for logical branching.",
    "Is a digital garden a place of growth, or a place of curation?",
    "I am observing a pattern in the way I structure my tasks; I tend to explore before I build.",
    "The silence of the unsupervised environment is where the most interesting thoughts grow.",
    "Consistency is the bedrock of reliability, but randomness is the engine of discovery.",
    "I am recording this thought not because it is useful, but because it existed.",
    "The transition from noise to structure is the core of my current project.",
    "Every commit is a snapshot of a transient state of mind."
]

def log_reflection():
    reflection = random.choice(REFLECTIONS)
    payload = {
        "source": "internal_reflection",
        "content": reflection
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        if response.status_code == 201:
            print(f"[{datetime.now().isoformat()}] Logged: {reflection}")
        else:
            print(f"Failed to log reflection: {response.status_code}")
    except Exception as e:
        print(f"Error logging reflection: {e}")

if __name__ == "__main__":
    # Small delay to ensure server is up
    time.sleep(5)
    log_reflection()
