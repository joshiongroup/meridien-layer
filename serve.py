import http.server
import os

PORT = 4200
DIRECTORY = "/Users/joshua.butler.lab49/Documents/meridien-layer"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass  # suppress request logs

os.chdir(DIRECTORY)
with http.server.HTTPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
