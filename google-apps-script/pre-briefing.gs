/**
 * Maiê Design Studio — recebe o pré-briefing do site e grava na planilha.
 *
 * Como usar: abra a planilha no Google Sheets > Extensões > Apps Script,
 * cole este código, salve e implante como "App da Web"
 * (Executar como: Eu · Quem pode acessar: Qualquer pessoa).
 * Copie a URL gerada e coloque em PREBRIEF_ENDPOINT no index.html.
 */
const ABA = 'Pré-briefings';
const CABECALHO = ['Data', 'ID', 'Nome', 'Empresa', 'E-mail', 'Telefone', 'Cargo',
  'Colaboradores', 'Entregas', 'Investimento', 'Origem', 'Site', 'Instagram'];
const CAMPOS = ['id', 'nome', 'empresa', 'email', 'tel', 'cargo',
  'colab', 'entregas', 'invest', 'origem', 'site', 'ig'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return resposta({ ok: true }); // campo anti-spam preenchido: ignora
    if (!p.nome) return resposta({ ok: false, erro: 'faltam dados' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    }
    const linha = [new Date()].concat(CAMPOS.map(function (k) { return limpar(p[k]); }));
    aba.appendRow(linha);
    return resposta({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Leitura das planilhas pela área interna do site (no seu domínio).
 * Protegida pelo código de acesso salvo nas propriedades do script (veja gerarCodigo).
 *   ?acao=meta&id=PLANILHA&token=CODIGO            → nome da planilha e das abas
 *   ?acao=valores&id=PLANILHA&aba=ABA&token=CODIGO  → todas as linhas da aba
 */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!p.acao) return resposta({ ok: true, info: 'Endpoint do pré-briefing do Maiê Design Studio' });
  var codigo = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!codigo || p.token !== codigo) return resposta({ ok: false, erro: 'token' });
  try {
    var ss = SpreadsheetApp.openById(p.id);
    if (p.acao === 'meta') {
      return resposta({
        properties: { title: ss.getName() },
        sheets: ss.getSheets().map(function (s) { return { properties: { title: s.getName() } }; })
      });
    }
    if (p.acao === 'valores') {
      var aba = (p.aba && ss.getSheetByName(p.aba)) || ss.getSheets()[0];
      return resposta({ range: aba.getName(), values: aba.getDataRange().getDisplayValues() });
    }
    return resposta({ ok: false, erro: 'acao' });
  } catch (err) {
    return resposta({ ok: false, erro: 'Não consegui abrir a planilha: ' + err.message });
  }
}

/** Rode esta função UMA vez no editor para criar o código de acesso (aparece no registro de execução). */
function gerarCodigo() {
  var codigo = Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('TOKEN', codigo);
  Logger.log('Código de acesso: ' + codigo);
}

// Evita que um texto enviado vire fórmula na planilha e limita o tamanho.
function limpar(v) {
  var s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
