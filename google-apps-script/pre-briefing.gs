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
    if (!p.nome || !p.email) return resposta({ ok: false, erro: 'faltam dados' });

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

function doGet() {
  return resposta({ ok: true, info: 'Endpoint do pré-briefing do Maiê Design Studio' });
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
