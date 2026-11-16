# Maiê Design Studio — site público

Site público do Maiê Design Studio: página inicial (pacotes, como funciona), outros serviços e o chat de pré-briefing ("Vamos conversar?"). A área interna do estúdio (painel, projetos, clientes, financeiro etc.) é outro site, outro repositório: **painel-maieosite**.

É um site estático: um único `index.html` (HTML + CSS + JavaScript) e a pasta `img/`. Não precisa de build. Publicado automaticamente na Vercel a cada push na branch `main`.

## Rodar no computador

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Páginas (rotas por #)

| Rota | Página |
|---|---|
| `#propostas` (início) | Página pública com pacotes e como funciona |
| `#outros-servicos` | Design de post e Landing page |
| `#prebriefing` | Abre o chat de pré-briefing (não é mais uma página própria) |
| `#obrigada` | Página de agradecimento (usada internamente pelo chat) |

## Chat de pré-briefing

O botão flutuante 🌸 abre um chat com diálogos fixos em JavaScript (sem IA, sem API externa). Ao final, os dados são enviados por `fetch` ao Google Apps Script configurado em `PREBRIEF_ENDPOINT` (no topo do `index.html`), que grava numa planilha do Google. O código do Apps Script e as instruções de configuração ficam no repositório **painel-maieosite** (é lá que a planilha também é lida pela área interna).

Esse site **não guarda nada no navegador**: nenhum dado do pré-briefing fica salvo localmente aqui — tudo vai direto para a planilha.

## Pacotes exibidos no site

O texto dos pacotes (Essencial, instaPRO, Premium) está fixo no código, na constante `PKG` perto do topo do `index.html`. Para mudar nome, descrição, entregáveis ou bônus exibidos no site público, edite ali e publique. (A tela "Pacotes" do painel interno é separada e não altera automaticamente o que aparece aqui.)

## Link para a área do estúdio

O link "Área do estúdio" do rodapé aponta para a constante `STUDIO_URL`, no topo do `index.html`. Hoje está como `https://studio.maiedesign.com.br/` — ajuste aí se o endereço do painel mudar.

## Contato / WhatsApp

`WHATS` e `EMAIL`, também no topo do `index.html`.
