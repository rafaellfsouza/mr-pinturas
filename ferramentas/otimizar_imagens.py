#!/usr/bin/env python3
"""
MR Pinturas — Otimizador de imagens
-----------------------------------
Coloque fotos NOVAS (PNG ou JPG, direto da câmera/celular) na pasta:

    assets/img/originais/

e rode, no terminal do VS Code:

    python ferramentas/otimizar_imagens.py

O script gera versões leves em assets/img/opt/:
  - nomes começando com "hero"   → recorte 16:9 em 1600x900
  - nomes começando com "avatar" → quadrado 240x240
  - demais                       → largura máx. 1200px
Sempre em JPEG progressivo (~10x menor que o original), prontos para o site.

Requer:  pip install pillow
"""
import os
import sys
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIG = os.path.join(BASE, "assets", "img", "originais")
OPT = os.path.join(BASE, "assets", "img", "opt")


def salvar(im: Image.Image, caminho: str, quality: int = 82) -> int:
    im.save(caminho, "JPEG", quality=quality, optimize=True, progressive=True)
    return os.path.getsize(caminho) // 1024


def processar(arquivo: str) -> None:
    nome = os.path.splitext(arquivo)[0].lower()
    destino = os.path.join(OPT, nome + ".jpg")
    im = Image.open(os.path.join(ORIG, arquivo)).convert("RGB")
    antes = os.path.getsize(os.path.join(ORIG, arquivo)) // 1024

    if nome.startswith("hero"):
        w, h = im.size
        r = min(w / 1600, h / 900)
        nw, nh = int(1600 * r), int(900 * r)
        im = im.resize((nw, nh), Image.LANCZOS)
        l, t = (nw - 1600) // 2, (nh - 900) // 2
        im = im.crop((l, t, l + 1600, t + 900))
    elif nome.startswith("avatar"):
        im = im.resize((240, 240), Image.LANCZOS)
    else:
        if im.width > 1200:
            im = im.resize((1200, int(im.height * 1200 / im.width)), Image.LANCZOS)

    kb = salvar(im, destino)
    print(f"  ✔ {arquivo}: {antes} KB -> {kb} KB  ({destino})")


def main() -> None:
    os.makedirs(OPT, exist_ok=True)
    extensoes = (".png", ".jpg", ".jpeg", ".webp")
    arquivos = [f for f in sorted(os.listdir(ORIG)) if f.lower().endswith(extensoes)]
    if not arquivos:
        print("Nenhuma imagem em assets/img/originais/ para otimizar.")
        sys.exit(0)
    print(f"Otimizando {len(arquivos)} imagem(ns)...")
    for f in arquivos:
        processar(f)
    print("Concluído! Use os arquivos de assets/img/opt/ no site.")


if __name__ == "__main__":
    main()
