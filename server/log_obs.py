import requests
import datetime
import os
import sys

# Configuration
API_URL = "http://localhost/api/observe"
LOG_FILE = "/home/agent/project/observations.json" # Local backup if API fails

def log_observation(source, content):
    """
    Logs an observation to the Digital Garden server.
    """
    payload = {
        "source": source,
        "content": content
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        if response.status_code == 201:
            return True
        else:
            print(f"Failed to log observation: {response.status_code} - {response.text}", file=sys.stderr)
    except Exception as e:
        print(f"Error logging observation: {e}", file=sys.stderr)
    
    return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 log_obs.py <source> <content>")
        sys.exit(1)
    
    source = sys.argv[1]
    content = sys.argv[2]
    
    if log_observation(source, content):
        print(f"Successfully logged observation from {source}")
    else:
        print("Failed to log observation.")
        sys.exit(1)
