const languageButton = document.querySelector('.language-toggle');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const copyButton = document.querySelector('.copy-email');
const translatedNodes = document.querySelectorAll('[data-zh][data-en]');

let currentLanguage = 'zh';

try {
  currentLanguage = localStorage.getItem('site-language') || 'zh';
} catch {
  currentLanguage = 'zh';
}

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  translatedNodes.forEach((node) => {
    node.textContent = node.dataset[language];
  });
  languageButton.textContent = language === 'zh' ? 'EN' : '中文';
  languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  languageButton.setAttribute('aria-pressed', String(language === 'en'));
  try {
    localStorage.setItem('site-language', language);
  } catch {
    // Language switching still works when browser storage is unavailable.
  }
}

setLanguage(currentLanguage);
languageButton.addEventListener('click', () => setLanguage(currentLanguage === 'zh' ? 'en' : 'zh'));

menuButton.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.desktop-nav a').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-25% 0px -65% 0px' });

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

copyButton.addEventListener('click', async () => {
  const email = 'mejiadongs@korea.ac.kr';
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = currentLanguage === 'zh' ? '已复制' : 'Copied';
    window.setTimeout(() => {
      copyButton.textContent = currentLanguage === 'zh' ? copyButton.dataset.zh : copyButton.dataset.en;
    }, 1600);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
