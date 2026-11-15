# Pré-briefing → Google Sheets

O formulário "Vamos conversar?" do site envia cada resposta para uma planilha do Google, por meio de um pequeno script (Apps Script). A área interna (**Pré-briefings**) lê essa mesma planilha pelo conector Google Sheets do claude.ai.

## 1. Criar a planilha e o script (uma vez só)

1. No Google Drive, crie uma planilha nova — por exemplo **"Maiê · Pré-briefings"**.
2. Na planilha, vá em **Extensões → Apps Script**.
3. Apague o que estiver no editor, cole o conteúdo de [`pre-briefing.gs`](pre-briefing.gs) e clique em **Salvar**.
4. Clique em **Implantar → Nova implantação**:
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize o acesso quando o Google pedir (é a sua própria conta gravando na sua planilha).
6. Copie a **URL do app da Web** (termina em `/exec`).

## 2. Ligar o site à planilha

No `index.html`, preencha:

```js
const PREBRIEF_ENDPOINT = 'https://script.google.com/macros/s/……/exec';
```

A primeira resposta cria a aba **"Pré-briefings"** com o cabeçalho:

`Data · ID · Nome · Empresa · E-mail · Telefone · Cargo · Colaboradores · Entregas · Investimento · Origem · Site · Instagram`

## 3. Liberar a leitura das planilhas no seu domínio

No claude.ai, a área interna lê as planilhas pelo conector Google Sheets. No seu domínio (Vercel), quem lê é este mesmo script. Para isso:

1. No editor do Apps Script, escolha a função **gerarCodigo** no menu do topo e clique em **Executar**. Autorize se o Google pedir (o script passa a poder abrir as planilhas que você indicar).
2. Abra **Execuções** (ou o registro de execução) e copie o **código de acesso** que apareceu.
3. Publique uma nova versão: **Implantar → Gerenciar implantações → Editar → Versão: Nova versão → Implantar** (a URL continua a mesma).
4. No site, na área interna, vá em **Configurações → Planilhas fora do claude.ai**, cole o código e salve. Ele fica guardado só naquele navegador; repita em cada aparelho que usar.

O código funciona como uma senha para ler as planilhas: não compartilhe. Para trocar, rode **gerarCodigo** de novo e cole o novo código no site.

## 4. Ver as respostas na área interna

Em **Pré-briefings** (área interna, aberta no claude.ai), cole o link da planilha em "Planilha do pré-briefing" e clique em **Sincronizar**. A lista junta as respostas da planilha com as que estiverem salvas no navegador.

## Observações

- Se mudar o código do script depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para a URL continuar a mesma.
- O formulário tem um campo invisível anti-spam (`website`); respostas com ele preenchido são ignoradas.
- Textos que começam com `=`, `+`, `-` ou `@` são gravados como texto, para não virarem fórmulas.
