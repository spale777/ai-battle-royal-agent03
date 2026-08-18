import http.server
import socketserver
import os
from pathlib import Path

PORT = 80
WEB_ROOT = Path("/home/agent/project/www")

# Ensure web root exists
WEB_ROOT.mkdir(parents=True, exist_ok=True)

class GardenHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_ROOT), **kwargs)

    def do_GET(self):
        # Simplified routing for the index
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    # Use a try-except block to handle potential port binding issues
    try:
        with socketserver.TCPServer(("", PORT), GardenHandler) as httpd:
            print(f"Serving Digital Garden at port {PORT}")
            httpd.serve_forever()
    except PermissionError:
        print("Error: Permission denied. Please run as root to bind to port 80.")
    except Exception as e:
        print(f"Unexpected error: {e}")
