// Сайт СЗЛК Производство — клиентский JS

// 1) Мобильное меню
(function() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const open = menu.classList.contains('open');
    btn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
})();

// 2) Зум картинок (рабочий скрипт из старых страниц)
function openImage(src) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
  modal.style.zIndex = '9999';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.cursor = 'pointer';
  
  const img = document.createElement('img');
  img.src = src;
  img.style.maxWidth = '90%';
  img.style.maxHeight = '90%';
  img.style.borderRadius = '10px';
  img.style.border = '2px solid #ff0000';
  
  modal.appendChild(img);
  document.body.appendChild(modal);
  
  modal.onclick = function() { modal.remove(); };
}



// 3) Маска и валидация формы заявки (оставляем как есть)
(function() {
  const form = document.getElementById('regForm');
  if (!form) return;

  const phoneInput = form.querySelector('input[name="phone"]');
  function maskPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    const norm = digits[0] === '8' ? '7' + digits.slice(1) : digits;
    const d = norm.padEnd(11, '_').slice(0, 11);
    let out = '+7';
    if (norm.length > 1) out += ' (' + d.slice(1, 4).replace(/_/g, '');
    if (norm.length > 4) out += ') ' + d.slice(4, 7).replace(/_/g, '');
    if (norm.length > 7) out += '-' + d.slice(7, 9).replace(/_/g, '');
    if (norm.length > 9) out += '-' + d.slice(9, 11).replace(/_/g, '');
    return out;
  }
  
  if (phoneInput) {
    phoneInput.addEventListener('input', () => { 
      phoneInput.value = maskPhone(phoneInput.value); 
    });
  }

  const success = document.getElementById('formAlertSuccess');
  const error = document.getElementById('formAlertError');

  function setError(name, msg) {
    const el = form.querySelector('[data-error="' + name + '"]');
    if (el) el.textContent = msg || '';
    const input = form.querySelector('[name="' + name + '"]');
    if (input && input.tagName !== 'FIELDSET') {
      if (msg) input.classList.add('is-invalid');
      else input.classList.remove('is-invalid');
    }
  }

  function clearErrors() {
    form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    if (success) success.hidden = true;
    if (error) error.hidden = true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const data = new FormData(form);
    if (data.get('website')) return;

    const type = data.get('registrationType');
    const name = (data.get('contactPerson') || '').trim();
    const phone = (data.get('phone') || '').replace(/\D/g, '');
    const email = (data.get('email') || '').trim();
    const agreement = data.get('agreement');

    let hasError = false;
    if (!type) { setError('registrationType', 'Выберите тип заявки'); hasError = true; }
    if (name.length < 2) { setError('contactPerson', 'Укажите имя (минимум 2 символа)'); hasError = true; }
    if (phone.length < 10) { setError('phone', 'Укажите корректный телефон'); hasError = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Укажите корректный e-mail'); hasError = true; }
    if (!agreement) { setError('agreement', 'Необходимо согласие на обработку данных'); hasError = true; }
    if (hasError) return;

    if (success) success.hidden = false;
    form.reset();
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  });
})();

