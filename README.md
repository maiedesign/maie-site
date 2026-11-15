# Maiê Design Studio — site

Site do Maiê Design Studio: página pública (propostas, outros serviços, pré-briefing) e área interna do estúdio (painel, projetos, tarefas, clientes, agenda, financeiro, pacotes, pré-briefings, importação de briefings e configurações).

É um site estático: um único `index.html` (HTML + CSS + JavaScript) e a pasta `img/`. Não precisa de build. Publicado automaticamente na Vercel a cada push na branch `main`.

## Rodar no computador

```bash
# dentro da pasta do projeto
python3 -m http.server 8000
# abra http://localhost:8000
```

## Páginas (rotas por #)

| Rota | Página |
|---|---|
| `#propostas` (início) | Página pública com pacotes e como funciona |
| `#outros-servicos` | Design de post e Landing page |
| `#prebriefing` | Formulário "Vamos conversar?" |
| `#entrar` | Login da área interna |
| `#painel`, `#projetos`, `#tarefas`, `#clientes`, `#agenda`, `#financeiro`, `#pacotes`, `#prebriefings`, `#importar`, `#configuracoes` | Área interna |

## Onde editar

No topo do `<script>` em `index.html`:

- `WHATS` – número do WhatsApp (formato `55DDDNÚMERO`)
- `EMAIL` – e-mail de contato
- `PREBRIEF_ENDPOINT` – URL do Apps Script que grava o pré-briefing na planilha
- `SENHA_HASH` – hash SHA-256 da senha da área interna. Para trocar a senha, gere o hash da nova (ex.: `printf 'nova-senha' | shasum -a 256`) e cole aqui. Ainda é uma proteção simples, feita no navegador (veja abaixo)
- `PKG` – textos dos pacotes Essencial, instaPRO e Premium
- `OUTROS` – textos e etapas de Design de post e Landing page

## Importante antes de publicar no domínio

Hoje o site é um protótipo que guarda tudo no navegador de quem usa (`localStorage`):

1. **Pré-briefing**: o formulário envia as respostas para uma planilha do Google por um Apps Script. Siga [`google-apps-script/README.md`](google-apps-script/README.md) e preencha `PREBRIEF_ENDPOINT` no `index.html`. Sem essa URL, as respostas ficam só no navegador do visitante.
2. **Área interna**: a senha fica visível no código e os dados não são compartilhados entre dispositivos. Para uso real, precisa de um back-end (login + banco de dados, ex.: Supabase/Firebase) — ou publique só a parte pública.
3. **Google Sheets e resumo por IA** (Importar briefings): usam os recursos do claude.ai (`window.claude`). Fora do claude.ai, a tela usa respostas de exemplo e um resumo-modelo.

## Publicar com domínio próprio

1. Suba este repositório no GitHub.
2. Conecte o repositório a uma hospedagem estática (Netlify, Vercel, Cloudflare Pages ou GitHub Pages) — sem comando de build, pasta de publicação = raiz.
3. Adicione o domínio no painel da hospedagem e ajuste o DNS no registrador (Registro.br etc.) conforme indicado.

## Marca

Paleta vinho `#5B1531`, magenta `#AD2159`, ameixa `#7B3A5E`, rosa `#F2D8DB`, dourado `#C59A55`.
Fontes: Instrument Serif e DM Sans (Google Fonts).


## Pré-briefing por chat

O formulário foi substituído por um chat flutuante (🌸) com diálogos fixos em JavaScript — sem LLM nem APIs externas. Ao confirmar, os dados seguem para a planilha (Apps Script) e para a tela *Pré-briefings* da área privada. Os links `#prebriefing` abrem o chat.
