# 🎨 MR Pinturas — Site Oficial

Landing page profissional (HTML + CSS + JS) com contatos gerenciados via **Supabase**,
imagens otimizadas por **Python** e pronto para publicar no **GitHub Pages**.

## ▶️ Rodar localmente (qualquer máquina)

```bash
python servidor.py          # abre http://localhost:8000 sozinho
```

Sem Python? Abra a pasta no VS Code e use a extensão **Live Server**
(clique direito em `index.html` → *Open with Live Server*).

## 📁 Estrutura

```
├── index.html                  # página única do site
├── servidor.py                 # servidor local de desenvolvimento (Python)
├── publicar_github.sh          # cria e envia o repositório no GitHub
├── GUIA.md                     # 📘 manual completo (VS Code, GitHub, Supabase, WhatsApp)
├── RELATORIO.md                # bugs corrigidos e melhorias técnicas
├── assets/
│   ├── css/style.css           # todo o visual do site
│   ├── js/config.js            # ⭐ troque AQUI telefone/WhatsApp/e-mail
│   ├── js/main.js              # interações (menu, galeria, lightbox, contatos)
│   └── img/
│       ├── originais/          # fotos brutas (PNG gerado / câmera)
│       └── opt/                # versões leves usadas pelo site (JPEG)
├── ferramentas/
│   └── otimizar_imagens.py     # comprime fotos novas automaticamente
├── supabase/
│   └── schema.sql              # tabela `contatos` (WhatsApp, telefone, e-mail)
└── .vscode/                    # formatação e ícones bonitos no VS Code
```

## 🔧 Trocar telefone / WhatsApp / e-mail

1. **Rápido:** edite `assets/js/config.js` (bloco `fallback`).
2. **Profissional:** rode `supabase/schema.sql` no Supabase e preencha
   `url` + `anonKey` no mesmo `config.js` — depois disso, os contatos são
   editados pelo painel do Supabase, sem republicar o site.

## 📤 Publicar no GitHub

```bash
bash publicar_github.sh
```

Detalhes passo a passo (incluindo hospedar grátis no GitHub Pages e
configurar o Supabase) estão no **GUIA.md**.
