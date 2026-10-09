# Relatório Técnico — Site MR Pinturas

Revisão completa do `index.html` original. Abaixo: o que estava **quebrado**, o que foi **melhorado** e o checklist para **publicar**.

---

## 🔴 Bugs corrigidos

| # | Problema no original | Correção aplicada |
|---|----------------------|-------------------|
| 1 | **Lightbox sem animação**: usava `display:none` + `opacity` com transição. Como `display` não é animável, o fade de abertura nunca aparecia e o fechamento era instantâneo. | Trocado por `visibility + opacity + pointer-events` — agora abre e fecha com fade suave, sem hacks de `setTimeout`. |
| 2 | **Contadores nunca animavam**: `IntersectionObserver` com `threshold: 0.5` exigia que 50% da seção estivesse visível — impossível em telas onde a faixa de números é mais alta que metade da viewport. Os números ficavam em "0". | `threshold: 0.1` + `rootMargin`, com fallback para navegadores sem `IntersectionObserver` e respeito a `prefers-reduced-motion`. |
| 3 | **Filtro da galeria sem transição**: a transição (`item.style.transition`) era injetada via JS *depois* do primeiro paint, e o show/hide usava styles inline, brigando com o CSS. | Animação movida para o CSS com classes `.is-fading` / `.is-hidden`; o JS só alterna classes. |
| 4 | **FAQ cortava respostas longas**: `max-height: 300px` fixo no CSS truncava respostas maiores (ex.: "Quanto tempo leva uma pintura?"). | Altura calculada dinamicamente via JS (`scrollHeight`), mantendo a animação. |
| 5 | **Imagens hospedadas em URL temporária** (`image.qwenlm.ai`): ~1,3 MB cada (8,9 MB no total), quadradas e fora do controle do site — risco de sair do ar a qualquer momento. | Imagens baixadas, recortadas/otimizadas para JPEG progressivo em `assets/img/opt/` (**8,9 MB → ~900 KB**), com `onerror` apontando para a URL antiga como reserva. |
| 6 | **Âncoras escondidas atrás do header sticky**: o scroll manual usava `offsetTop - 80` fixo, dessincronizado do header real. | Scroll manual removido; uso de `scroll-margin-top` no CSS (funciona com qualquer altura de header e com o scroll nativo). |

## 🟡 Melhorias de robustez (site funciona mesmo se um CDN cair)

- **AOS (animações)**: se o CDN `unpkg` falhar, um mini-motor de reveal com `IntersectionObserver` assume (`html.aos-off` + `.aos-in`). Sem JS, um `<noscript>` garante que nada fique invisível.
- **Font Awesome**: detecção de falha de carga (fonte não registrada) e substituição automática por glifos nativos (★, ✔, →, 📍…), para o site nunca mostrar "quadrados" ou ícones vazios.
- **Fontes Poppins/Inter**: pilha de fallback com fontes de sistema (`-apple-system, Segoe UI, Roboto…`).
- **Blur-up de imagens**: cada foto da galeria tem um placeholder minúsculo (~1 KB, embutido em base64) como fundo — não aparece mais "buraco branco" enquanto carrega.
- **Menu mobile**: fecha com `Esc` e com clique fora; `aria-expanded` e ícone ☰/ sincronizados.
- **Botão do WhatsApp**: menor no celular e respiro extra no rodapé para não cobrir o copyright.

## 🟢 SEO, acessibilidade e performance

- **SEO**: `canonical`, Open Graph/Twitter Card, `theme-color`, favicon SVG embutido e **JSON-LD `PaintingBusiness`** (telefone, horários, regiões atendidas, serviços) — elegível para rich results locais no Google.
- **Acessibilidade**: skip-link, `<main>` envolvendo o conteúdo, perguntas do FAQ viraram `<button>` com `aria-expanded`/`aria-controls`, itens da galeria navegáveis por teclado (`Enter`/`Espaço`), lightbox com `role="dialog"` + foco gerenciado, `aria-label` em estrelas e botões, foco visível (`:focus-visible`), `prefers-reduced-motion` respeitado.
- **Performance**: `preload` do hero, `loading="lazy"` + `decoding="async"` + `width/height` (sem layout shift) nas demais imagens, `rel="noopener"` em links externos, listener de scroll passivo, ano do rodapé automático.

## 📁 Estrutura de arquivos

```
index.html                  → site completo (versão corrigida)
assets/img/opt/hero-wide.jpg→ hero 1600×900 otimizado (68 KB)
assets/img/opt/*.jpg        → fotos da galeria/sobre otimizadas
RELATORIO.md                → este documento
```

## ✅ Checklist antes de publicar

1. **Trocar o domínio fictício** `https://www.mrpinturas.com.br/` (aparece no `canonical`, `og:url` e no JSON-LD) pelo domínio real — buscar e substituir.
2. **`og:image`**: usar URL absoluta da imagem (`https://seudominio.com.br/assets/img/opt/hero-wide.jpg`).
3. **Redes sociais**: os links de Facebook/Instagram/LinkedIn estão com `href="#"` — colocar as URLs reais (ou remover os ícones).
4. **Subir a pasta inteira** (index.html + assets/) para a hospedagem (Hostinger, Netlify, Vercel, cPanel…).
5. **Google Search Console + Google Meu Negócio**: enviar o sitemap e vincular o perfil da empresa ao site para ranquear em "pintor em Belo Horizonte".
6. Opcional: criar `sitemap.xml` e `robots.txt` apontando para o domínio.
