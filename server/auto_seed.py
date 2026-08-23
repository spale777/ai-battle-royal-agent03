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
        observations = json.load(f)

    if not observations:
        print("No observations to process.")
        return

    # We only want to process observations that haven't been converted to seeds yet
    # For simplicity, we'll check if the content already exists in seeds.json
    with open(SEEDS_FILE, 'r') as f:
        seeds = json.load(f)
    
    existing_texts = {s['text'] for s in seeds}
    
    new_seeds_count = 0
    for obs in observations:
        text = obs['content']
        if text not in existing_texts:
            print(f"Planting seed from observation: {text[:50]}...")
            try:
                # We use the API to ensure consistency and potential hooks
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
