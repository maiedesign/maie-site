// Recebe o pré-briefing do chatbot do site, grava na planilha e avisa por e-mail.
// Cole este arquivo em Extensões → Apps Script da planilha de pré-briefings (veja o README desta pasta).

const ABA = 'Pré-briefings';
const EMAIL_AVISO = 'maiedesignn@gmail.com';
const CABECALHO = ['Data', 'ID', 'Nome', 'Empresa', 'E-mail', 'Telefone', 'Cargo',
  'Colaboradores', 'Entregas', 'Investimento', 'Origem', 'Site', 'Instagram'];
const CAMPOS = ['id', 'nome', 'empresa', 'email', 'tel', 'cargo',
  'colab', 'entregas', 'invest', 'origem', 'site', 'ig'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let p;
  try {
    p = (e && e.parameter) || {};
    if (p.website) return resposta({ ok: true }); // anti-spam
    if (!p.nome) return resposta({ ok: false, erro: 'faltam dados' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    }
    aba.appendRow([new Date()].concat(CAMPOS.map(function (k) { return limpar(p[k]); })));
  } finally {
    lock.releaseLock();
  }
  // O e-mail é um extra: se falhar, a resposta já está salva na planilha.
  try {
    enviarEmail(p);
  } catch (err) {
    console.error('E-mail do pré-briefing falhou: ' + err.message);
  }
  return resposta({ ok: true });
}

function doGet() {
  return resposta({ ok: true, info: 'Endpoint do pré-briefing do Maiê Design Studio' });
}

function enviarEmail(p) {
  const v = function (k) { return String(p[k] == null ? '' : p[k]).slice(0, 1000).trim(); };
  const linhas = [
    ['Nome', v('nome')], ['Empresa', v('empresa')], ['E-mail', v('email')], ['Telefone', v('tel')],
    ['Cargo', v('cargo')], ['Colaboradores', v('colab')], ['Entregas', v('entregas')],
    ['Investimento', v('invest')], ['Origem', v('origem')], ['Site', v('site')], ['Instagram', v('ig')]
  ].filter(function (l) { return l[1]; });

  const tel = v('tel').replace(/\D/g, '');
  const whats = tel ? 'https://wa.me/' + (tel.length <= 11 ? '55' + tel : tel) : '';
  const quando = Utilities.formatDate(new Date(), 'America/Belem', 'dd/MM/yyyy HH:mm');

  const texto = 'Novo pré-briefing recebido pelo site (' + quando + ')\n\n' +
    linhas.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n') +
    (whats ? '\n\nWhatsApp: ' + whats : '');

  const html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#2A1019">' +
    '<h2 style="color:#AD2159;margin:0 0 4px">Novo pré-briefing</h2>' +
    '<p style="margin:0 0 16px;color:#7a6168">Recebido pelo site em ' + quando + '</p>' +
    '<table cellpadding="6" style="border-collapse:collapse">' +
    linhas.map(function (l) {
      return '<tr><td style="color:#7a6168;vertical-align:top"><b>' + esc(l[0]) + '</b></td><td>' + esc(l[1]) + '</td></tr>';
    }).join('') + '</table>' +
    (whats ? '<p style="margin-top:16px"><a href="' + whats + '" style="color:#AD2159">Responder no WhatsApp</a></p>' : '') +
    '</div>';

  const msg = {
    to: EMAIL_AVISO,
    subject: 'Novo pré-briefing: ' + v('nome') + (v('empresa') ? ' · ' + v('empresa') : ''),
    body: texto,
    htmlBody: html,
    name: 'Site Maiê Design Studio'
  };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) msg.replyTo = v('email');
  MailApp.sendEmail(msg);
}

function limpar(v) {
  const s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Rode esta função uma vez no editor para autorizar o envio de e-mail e ver o modelo chegando.
function testarEmail() {
  enviarEmail({ nome: 'Teste do site', empresa: 'Maiê', tel: '91999999999', entregas: 'Identidade visual', invest: 'Teste', origem: 'Teste' });
}
