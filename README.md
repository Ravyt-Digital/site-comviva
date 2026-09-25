# COMVIVA — redesign demonstrativo

Este repositório contém o site estático do redesign da COMVIVA Arquitetura e Urbanismo. O conteúdo publicado está em [`dist/`](dist/): páginas HTML, CSS, JavaScript e imagens WebP.

Prévia: https://comviva-arquitetura-redesign.ravytdigital.chatgpt.site/

Para visualizar localmente, execute `python -m http.server 8000 --directory dist` e abra `http://localhost:8000/`.

## Implantação na Cloudflare

O Worker `site-comviva` publica os arquivos de `dist/` conforme [`wrangler.jsonc`](wrangler.jsonc). Nas configurações de Builds, use o repositório `Ravyt-Digital/site-comviva`, a branch de produção `main`, o diretório raiz `/`, nenhum comando de build e `npx wrangler deploy` como comando de implantação. Uma alteração enviada à `main` após conectar o repositório deve iniciar um build automático.

Demonstração visual independente; este não é o site oficial da COMVIVA.
