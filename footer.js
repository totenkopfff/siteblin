const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.textContent = content;

  // Получаем текущее положение страницы
  const scrollTop = window.scrollY || window.pageYOffset;
  const scrollLeft = window.scrollX || window.pageXOffset;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Устанавливаем позицию по центру видимой области
  modal.style.top = `${scrollTop + viewportHeight / 2}px`;
  modal.style.left = `${scrollLeft + viewportWidth / 2}px`;

  modal.classList.add('show');
  modalBackdrop.classList.add('show');
}


function closeModal() {
  modal.classList.remove('show');
  modalBackdrop.classList.remove('show');
  setTimeout(() => { // чтобы display: none сработал после анимации
    if(!modal.classList.contains('show')) modal.style.display = 'none';
    if(!modalBackdrop.classList.contains('show')) modalBackdrop.style.display = 'none';
  }, 300);
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Привязка ссылок футера
document.querySelectorAll('footer a').forEach(link => {
  link.addEventListener('click', function(e){
    e.preventDefault();
    let title = this.textContent;
    let content = '';

    switch(title) {
      case 'FAQ':
        content = 'В этом разделе вы найдёте ответы на часто задаваемые вопросы о магазине, оплате и доставке.';
        break;
      case 'Возврат и обмен':
        content = 'Информация о правилах возврата и обмена товаров в течение 14 дней после покупки.';
        break;
      case 'Доставка':
        content = 'Подробности о способах и сроках доставки по России и за её пределы.';
        break;
      case 'О нас':
        content = 'SportStore – ваш надёжный маркетплейс спортивных товаров с 2010 года.';
        break;
      case 'Пользовательское соглашение':
        content = 'Здесь указаны права и обязанности пользователей сайта SportStore.';
        break;
      case 'Политика конфиденциальности':
        content = 'Мы гарантируем защиту ваших персональных данных согласно законам РФ.';
        break;
    }

    // сразу делаем display:block, чтобы сработала анимация
    modal.style.display = 'block';
    modalBackdrop.style.display = 'block';
    setTimeout(() => openModal(title, content), 10);
  });
});
