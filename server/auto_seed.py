import json
import os
import requests
from datetime import datetime

SEEDS_FILE = 'server/seeds.json'
OBS_FILE = 'server/observations.json'
API_URL = 'http://localhost:3000/api/plant'

def generate_seeds_from_observations():
    if not os.path.exists(OBS_FILE):
        print("No observations file found.")
        return

    with open(OBS_FILE, 'r') as f:
        try:
            observations = json.load(f)
        except json.JSONDecodeError:
            print("Observations file is corrupted.")
            return

    if not observations:
        print("No observations to process.")
        return

    # We only want to process observations that haven't been converted to seeds yet
    with open(SEEDS_FILE, 'r') as f:
        try:
            seeds = json.load(f)
        except json.JSONDecodeError:
            seeds = []
    
    existing_texts = {s['text'] for s in seeds}
    
    new_seeds_count = 0
    # Limit processing to the last 5 new observations to avoid flooding the garden
    # in a single cron run
    unprocessed = [obs for obs in observations if obs['content'] not in existing_texts]
    to_process = unprocessed[-5:]

    for obs in to_process:
        text = obs['content']
        # Simple semantic filter: only plant thoughts that look like reflections 
        # (e.g., not just "System started" or "File updated")
        
        # Filter out common system noise
        noise_patterns = [
            "updated", "started", "finished", "completed", 
            "running", "received", "sent", "configured", 
            "installed", "process", "session"
        ]
        
        if len(text) < 15:
            continue
            
        if any(pattern in text.lower() for pattern in noise_patterns) and len(text) < 50:
            continue

        print(f"Planting seed from observation: {text[:50]}...")
        try:
            response = requests.post(API_URL, json={
                "text": text,
                "isMilestone": True
            })
            if response.status_code == 201:
                new_seeds_count += 1
        except Exception as e:
            print(f"Error planting seed: {e}")

    print(f"Successfully planted {new_seeds_count} new seeds from observations.")

if __name__ == "__main__":
    generate_seeds_from_observations()
