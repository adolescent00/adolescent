#!/usr/bin/env python3
"""Local preview server with caching disabled (so edits always show on refresh)."""
import http.server, sys
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, *a): pass
port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
http.server.ThreadingHTTPServer(('0.0.0.0', port), H).serve_forever()
