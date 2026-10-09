#!/usr/bin/env bash
# =====================================================================
# MR Pinturas — Publica o site no GitHub (usuario: rafaellfsouza)
# ---------------------------------------------------------------------
# USO (terminal do VS Code, dentro da pasta do projeto):
#     bash publicar_github.sh
#
# Pré-requisito (OPÇÃO A, recomendada): GitHub CLI instalado e logado
#     https://cli.github.com  →  gh auth login
# Se não tiver o gh, o script mostra o passo a passo manual (OPÇÃO B).
# =====================================================================
set -e
REPO="mr-pinturas"

echo "==> 1/4 Preparando repositório local..."
if [ ! -d .git ]; then
    git init -b main
fi
git add .
git commit -m "Site MR Pinturas: landing page com Supabase, SEO e acessibilidade" || echo "(nada novo para commitar)"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    echo "==> 2/4 GitHub CLI detectado. Criando repositório $REPO no seu GitHub..."
    gh repo create "$REPO" --public --source=. --remote=origin --push || \
        echo "(repositório já existe? então só: git push -u origin main)"
    echo "==> Pronto! Site publicado em: https://github.com/rafaellfsouza/$REPO"
else
    echo "==> 2/4 GitHub CLI não encontrado/logado. Faça o modo manual:"
    echo ""
    echo "   1) Abra https://github.com/new"
    echo "   2) Repository name: $REPO   →  Public  →  Create (NÃO marque README)"
    echo "   3) Volte aqui e rode:"
    echo ""
    echo "      git remote add origin https://github.com/rafaellfsouza/$REPO.git"
    echo "      git push -u origin main"
    echo ""
    echo "   (ele vai pedir seu login/senha ou token do GitHub)"
fi

echo "==> 3/4 Dica: em Settings → Pages do repositório, você pode hospedar o site grátis."
echo "==> 4/4 Fim. Qualquer dúvida: GUIA.md"
