#!/usr/bin/env python3
"""
MR Pinturas — Servidor local de desenvolvimento
------------------------------------------------
Uso (dentro da pasta do projeto, no terminal do VS Code):

    python servidor.py            # abre em http://localhost:8000
    python servidor.py 8080       # outra porta, se a 8000 estiver ocupada

Serve o site com cache desativado (sempre que você salvar um arquivo,
o navegador mostra a versão nova ao recarregar) e abre o navegador sozinho.
"""
import http.server
import os
import socketserver
import sys
import webbrowser

PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
PASTA = os.path.dirname(os.path.abspath(__file__))
os.chdir(PASTA)


class Handler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler sem cache, para desenvolvimento."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):  # log mais limpo no terminal
        print("  [servidor] %s" % (fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("0.0.0.0", PORTA), Handler) as httpd:
        url = f"http://localhost:{PORTA}"
        print("=" * 60)
        print("  MR Pinturas — servidor local rodando!")
        print(f"  Abra no navegador: {url}")
        print("  Pare com Ctrl+C")
        print("=" * 60)
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado. Até logo!")
