# 📘 GUIA COMPLETO — Site MR Pinturas

Tudo o que você precisa: **VS Code**, **Python**, **GitHub**, **Supabase** e o **botão do WhatsApp**.
Leia na ordem — cada parte leva poucos minutos.

---

## 1️⃣ Como abrir e rodar o site no VS Code

### 1.1 Preparar a máquina (só na primeira vez)
1. Instale o **VS Code**: https://code.visualstudio.com (botão *Download*, próximo/próximo/concluir).
2. Instale o **Python**: https://python.org/downloads
   - No Windows, **marque a caixinha “Add Python to PATH”** na instalação (importante!).
3. Instale o **Git**: https://git-scm.com/downloads (só para a parte do GitHub).

### 1.2 Abrir o projeto
1. Copie a pasta do projeto (a que contém `index.html`, `assets/`, `servidor.py`…) para onde quiser, ex.: `Documentos/mr-pinturas`.
2. Abra o VS Code → menu **File → Open Folder…** → selecione a pasta → **OK**.
3. Confie na pasta se aparecer o aviso *“Do you trust the authors?”* → **Yes, I trust the authors**.

### 1.3 Ver o site funcionando no navegador
Abra o terminal dentro do VS Code: menu **Terminal → New Terminal** (ou `Ctrl + '`) e digite:

```bash
python servidor.py
```

O navegador abre sozinho em **http://localhost:8000**.
Sempre que editar um arquivo, é só **recarregar a página** (F5) — o servidor não guarda cache.
Para parar o servidor: `Ctrl + C` no terminal.

> **Alternativa sem Python:** instale a extensão **Live Server**, clique com o botão direito no `index.html` → *Open with Live Server*.

### 1.4 Deixar o VS Code bonito (a “estética”)
Ao abrir a pasta pela primeira vez, o VS Code mostra um balão no canto inferior direito:
*“This workspace has extension recommendations”* → clique em **Install All**.
Isso instala o que está listado em `.vscode/extensions.json`:

| Extensão | Para quê |
|---|---|
| **Prettier** | formata HTML/CSS/JS sozinho ao salvar (código sempre alinhado) |
| **Python** | destaque, autocompletar e formatação dos `.py` |
| **Live Server** | recarga automática do site a cada salvamento |
| **Material Icon Theme** | ícones coloridos por tipo de arquivo na árvore de pastas |

A pasta `.vscode/settings.json` já deixa pronto: **formatação ao salvar**, cores nos parênteses/chaves,
breadcrumbs, mini-map desligado e `__pycache__` escondido.
Para o tema de cores, minha sugestão (gosto pessoal): `Ctrl+K` depois `Ctrl+T` → **One Dark Pro** ou **Dark+**.

---

## 2️⃣ Como o projeto está organizado (e onde o Python entra)

```
index.html                 → a página (conteúdo e estrutura)
assets/css/style.css       → TODO o visual (cores, fontes, layout)
assets/js/config.js        → ⭐ TELEFONE, WHATSAPP E E-MAIL (edite aqui!)
assets/js/main.js          → comportamentos (menu, galeria, lightbox, contatos)
assets/img/originais/      → fotos brutas (PNG)
assets/img/opt/            → fotos leves que o site usa (JPEG otimizado)
servidor.py                → sobe o site localmente (python servidor.py)
ferramentas/otimizar_imagens.py → comprime fotos novas
supabase/schema.sql        → banco de dados dos contatos
publicar_github.sh         → publica no GitHub em 1 comando
```

### Python no projeto (2 utilidades)
```bash
python servidor.py                        # 1) servidor local de desenvolvimento
python ferramentas/otimizar_imagens.py    # 2) comprime fotos colocadas em assets/img/originais/
```
Para a 2ª, instale a biblioteca de imagem uma única vez: `pip install pillow`.
Exemplo do dia a dia: tirou foto de uma obra nova no celular → jogue o arquivo em
`assets/img/originais/` → rode o otimizador → use `assets/img/opt/nome.jpg` no HTML.

---

## 3️⃣ GitHub: criar o repositório em `rafaellfsouza`

⚠️ **Importante:** eu (assistente) **não tenho acesso à sua conta do GitHub** — criar o
repositório exige o seu login, então essa parte é sua (leva 2 minutos). O projeto já está
100% preparado: rode o script e ele faz o resto.

### Opção A — automática (recomendada)
1. Instale o GitHub CLI: https://cli.github.com e faça login no terminal: `gh auth login`
   (escolha *GitHub.com → Login with a web browser*).
2. Dentro da pasta do projeto (terminal do VS Code):
   ```bash
   bash publicar_github.sh
   ```
   Ele cria o repositório **`mr-pinturas`**, faz o commit e envia tudo.

### Opção B — manual (sem instalar nada novo)
1. Abra https://github.com/new logado como **rafaellfsouza**.
2. *Repository name*: `mr-pinturas` → **Public** → **Create repository** (não marque README).
3. No terminal do VS Code, dentro da pasta:
   ```bash
   git init -b main
   git add .
   git commit -m "Site MR Pinturas"
   git remote add origin https://github.com/rafaellfsouza/mr-pinturas.git
   git push -u origin main
   ```
   (Na primeira vez ele pede usuário e um **token**: crie em
   github.com → Settings → Developer settings → Personal access tokens → *tokens (classic)* →
   gere com o escopo `repo` e use no lugar da senha.)

### 🌐 Hospedar o site de graça (GitHub Pages)
1. No repositório: **Settings → Pages**.
2. *Source*: **Deploy from a branch** → branch **main** → pasta **/ (root)** → Save.
3. Em ~1 minuto o site estará no ar em `https://rafaellfsouza.github.io/mr-pinturas/`.

> Depois da primeira publicação, qualquer `git push` atualiza o site sozinho.

---

## 4️⃣ Supabase: banco de dados dos contatos (WhatsApp, telefone, e-mail)

O site lê a tabela **`contatos`** e preenche sozinho todos os botões/links.
Se o Supabase não estiver configurado, o site usa o `config.js` (não quebra nunca).

### 4.1 Criar o banco (5 minutos)
1. Crie conta grátis em https://supabase.com → **New project** (nome: `mr-pinturas`, senha forte, região *South America (São Paulo)*).
2. No menu lateral: **SQL Editor → New query**.
3. Cole **todo** o conteúdo de `supabase/schema.sql` → **Run**.
   Isso cria a tabela + políticas de segurança (visitante só lê; só você edita) + os 3 contatos iniciais.
4. Pegue as chaves: **Project Settings (engrenagem) → API**:
   - *Project URL* → ex.: `https://abcd1234.supabase.co`
   - *anon public key* → uma string longa
5. Cole as duas em `assets/js/config.js`:
   ```js
   supabase: {
       url: "https://abcd1234.supabase.co",
       anonKey: "sua-chave-anon-aqui"
   }
   ```
6. Commit + push. Pronto: o site passa a buscar os contatos no banco.

### 4.2 Trocar o número no futuro (sem republicar o site)
Supabase → **Table Editor → contatos** → edite a linha `whatsapp`:
- `valor` = como aparece escrito, ex.: `(31) 99999-8888`
- `link` = `https://wa.me/5531999998888`
- `mensagem_padrao` = texto que abre pronto no WhatsApp do cliente
Salve (`Save`) e recarregue o site. Fim. ✨

---

## 5️⃣ O botão do WhatsApp: como funciona e como deixar funcional

### Como funciona hoje
Todo botão de orçamento do site (topo, menu, herói, CTA final e bolinha flutuante)
aponta para um link do tipo:

```
https://wa.me/5531983760208?text=Olá! Gostaria de solicitar um orçamento...
```

- `wa.me/` é o endereço oficial do WhatsApp para “conversa direta”;
- depois da barra vai o número **somente com dígitos**: `55` (Brasil) + `DDD` + `número`;
- `?text=` é a mensagem que já abre escrita na conversa do cliente.

Ou seja: **o botão JÁ é funcional** — ao clicar, o navegador/app abre a conversa do
WhatsApp com o número configurado e a mensagem pronta. No celular abre o app; no computador, o WhatsApp Web.

### O que VOCÊ deve fazer para usar o SEU número / link gerado
Escolha **UMA** das três formas (da mais simples à mais profissional):

**Forma 1 — config.js (30 segundos):**
abra `assets/js/config.js` e troque:
```js
whatsappNumero: "5531983760208",        // ← seu número: 55 + DDD + número, só dígitos
whatsappMsg: "Olá! Vim pelo site...",   // ← mensagem que abrirá pronta
```
Salve, recarregue o site e **todos** os botões passam a usar o número novo automaticamente.

**Forma 2 — Supabase (recomendada):** edite a linha `whatsapp` na tabela `contatos`
(campo `link` = o link que você gerar, ex.: `https://wa.me/5531988887777`).
Veja a seção 4.2 acima.

**Forma 3 — manual no HTML (não recomendo, mas existe):** procure no `index.html` por
`wa.me/5531983760208` e troque o número em todos os lugares.

### Gerando um link personalizado (com mensagem própria)
Use qualquer gerador de link de WhatsApp (ex.: wa.link) ou monte na mão:
```
https://wa.me/55DDDNUMERO?text=SUA%20MENSAGEM
```
(espaço vira `%20`; acentos funcionam direto, mas `%20` é obrigatório nos espaços).
Depois cole esse link no `config.js`/Supabase conforme acima — o site já está preparado
para receber um link completo: se o valor começar com `http`, ele é usado exatamente como você gerou.

### Teste rápido
1. Recarregue o site (`F5`).
2. Clique na **bolinha verde** no canto inferior direito.
3. Deve abrir o WhatsApp com a conversa do número escolhido e a mensagem de orçamento pronta para enviar.
Se abrir com número errado → confira `config.js` (ou a tabela `contatos`).

---

## 6️⃣ Fotos com pessoas brasileiras (já trocadas ✅)

- **Seção “Sobre”** e **herói**: equipe/pintor brasileiros uniformizados (`assets/img/opt/equipe.jpg` e `hero-equipe-wide.jpg`).
- **Depoimentos**: rostos brasileiros reais-looking (`avatar-maria.jpg`, `avatar-joao.jpg`, `avatar-ana.jpg`).
- Para trocar qualquer foto: coloque o arquivo em `assets/img/originais/` →
  `python ferramentas/otimizar_imagens.py` → aponte o `src` no HTML para `assets/img/opt/nome.jpg`.

---

## ✅ Checklist final (ordem sugerida)

- [ ] Abrir a pasta no VS Code e rodar `python servidor.py` (seção 1)
- [ ] Instalar as extensões recomendadas (seção 1.4)
- [ ] Colocar SEU número no `assets/js/config.js` (seção 5)
- [ ] Criar repositório no GitHub e publicar (seção 3)
- [ ] Ativar GitHub Pages (seção 3)
- [ ] Criar projeto no Supabase, rodar `schema.sql` e colar as chaves no `config.js` (seção 4)
- [ ] Trocar o domínio fictício `mrpinturas.com.br` no `index.html` (canonical/og:url/JSON-LD) pelo domínio real, se tiver um
- [ ] Preencher os links de Facebook/Instagram (hoje `#`) ou remover os ícones

Dúvidas técnicas do que foi corrigido no código: veja **RELATORIO.md**.
