export function initDotBorderButtons() {
  const selector = '.button, .footer-cta-button, .copy-btn, .back-to-top-btn, .sector-nav-btn, header .brand';
  const buttons = document.querySelectorAll<HTMLElement>(selector);

  buttons.forEach((btn) => {
    if (btn.parentElement?.classList.contains('btn-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'btn-wrapper';

    if (btn.classList.contains('brand')) {
      wrapper.classList.add('header-brand-wrapper');
    } else if (btn.classList.contains('button--orange') || btn.classList.contains('footer-cta-button')) {
      wrapper.classList.add('btn-wrapper--orange');
    } else if (btn.closest('.footer-cta-card') || btn.closest('footer')) {
      wrapper.classList.add('btn-wrapper--dark');
    }

    btn.parentNode?.insertBefore(wrapper, btn);
    wrapper.appendChild(btn);

    wrapper.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="line horizontal top"></div>
      <div class="line vertical right"></div>
      <div class="line horizontal bottom"></div>
      <div class="line vertical left"></div>
      <div class="dot top left"></div>
      <div class="dot top right"></div>
      <div class="dot bottom right"></div>
      <div class="dot bottom left"></div>
    `
    );
  });
}

export function observeDotBorderButtons() {
  initDotBorderButtons();
  const observer = new MutationObserver(() => {
    initDotBorderButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
