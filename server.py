"""
PKOS Server â€” Static file server + dual-mode proxy
  GET  /api/proxy?url=...   â†’ forward GET to external URL (web scraping)
  POST /api/llm             â†’ forward POST to LM Studio (avoids browser CORS)
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json

PORT     = 8000
LM_HOST  = 'http://127.0.0.1:1234'
LM_TOKEN = 'Bearer sk-lm-BQlQm6QN:jnQy93UPIwN0aZCbf5ww'

class PKOSHandler(http.server.SimpleHTTPRequestHandler):

    # â”€â”€ Suppress request logs for cleaner output â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    def log_message(self, format, *args):
        if '/api/' in (args[0] if args else ''):
            print(f'[PKOS] {args}')

    # â”€â”€ CORS helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    # â”€â”€ OPTIONS preflight â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    # â”€â”€ GET: scraping proxy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    def do_GET(self):
        if self.path.startswith('/api/proxy'):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            target = params.get('url', [None])[0]

            if not target:
                self.send_response(400)
                self._cors()
                self.end_headers()
                self.wfile.write(b'Missing url parameter')
                return

            try:
                req = urllib.request.Request(
                    target,
                    headers={
                        'User-Agent': (
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                            'AppleWebKit/537.36 (KHTML, like Gecko) '
                            'Chrome/120.0.0.0 Safari/537.36'
                        ),
                        'Accept-Language': 'fr-DZ,fr;q=0.9,en;q=0.8',
                    }
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    body = resp.read()
                    ct   = resp.headers.get('Content-Type', 'text/html; charset=utf-8')

                self.send_response(200)
                self.send_header('Content-Type', ct)
                self._cors()
                self.end_headers()
                self.wfile.write(body)

            except Exception as e:
                print(f'[PKOS proxy error] {e}')
                self.send_response(502)
                self.send_header('Content-Type', 'text/plain')
                self._cors()
                self.end_headers()
                self.wfile.write(str(e).encode())
            return

        # Serve static files normally
        super().do_GET()

    # â”€â”€ POST: LM Studio relay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    def do_POST(self):
        if self.path.startswith('/api/llm'):
            length  = int(self.headers.get('Content-Length', 0))
            payload = self.rfile.read(length)

            # Determine LM Studio sub-path (default: chat completions)
            parsed   = urllib.parse.urlparse(self.path)
            params   = urllib.parse.parse_qs(parsed.query)
            sub_path = params.get('path', ['/v1/chat/completions'])[0]
            url      = LM_HOST + sub_path

            try:
                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={
                        'Content-Type':  'application/json',
                        'Authorization': LM_TOKEN,
                    },
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=120) as resp:
                    body = resp.read()
                    ct   = resp.headers.get('Content-Type', 'application/json')

                self.send_response(200)
                self.send_header('Content-Type', ct)
                self._cors()
                self.end_headers()
                self.wfile.write(body)

            except Exception as e:
                print(f'[PKOS LLM relay error] {e}')
                self.send_response(502)
                self.send_header('Content-Type', 'application/json')
                self._cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return

        self.send_response(404)
        self.end_headers()


if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), PKOSHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f'[PKOS] Server running at http://localhost:{PORT}')
        print(f'[PKOS] LM Studio relay â†’ {LM_HOST}')
        httpd.serve_forever()

