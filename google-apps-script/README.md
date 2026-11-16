# Pré-briefing → planilha + e-mail

O chatbot do site (`index.html`, constante `PREBRIEF_ENDPOINT`) envia cada pré-briefing para um Google Apps Script.
O script grava a resposta na aba **Pré-briefings** da planilha e manda um e-mail para `maiedesignn@gmail.com`
(o endereço fica em `EMAIL_AVISO`, no topo de [`pre-briefing.gs`](pre-briefing.gs)).

## Atualizar o script (mantendo a mesma URL)

1. Abra a planilha de pré-briefings → **Extensões → Apps Script**.
2. Apague o código do editor, cole todo o conteúdo de `pre-briefing.gs` e clique em **Salvar**.
3. No menu de funções do topo, escolha **testarEmail** e clique em **Executar**. O Google vai pedir uma nova
   autorização (agora para enviar e-mail em seu nome): aceite. Um e-mail de teste deve chegar na caixa de entrada.
4. **Implantar → Gerenciar implantações → ✏️ Editar → Versão: Nova versão → Implantar.**
   A URL `/exec` continua a mesma, então o site não precisa mudar.

Sem o passo 4, o site continua usando a versão antiga (só planilha, sem e-mail).

## Observações

- Se o e-mail falhar, a resposta continua salva na planilha.
- O e-mail sai da sua própria conta Google (limite de cerca de 100 envios por dia em contas gratuitas).
- Há um campo invisível anti-spam (`website`): respostas com ele preenchido são ignoradas.
- Textos que começam com `=`, `+`, `-` ou `@` são gravados como texto, para não virarem fórmulas.
