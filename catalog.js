document.addEventListener('DOMContentLoaded', () => {

  const categoryButtons = document.querySelectorAll('.category-btn');
  const main = document.querySelector('main');
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');

  // --- Фильтрация по категориям ---
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.textContent.toLowerCase();

      document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        switch(category) {
          case 'все товары': card.style.display = 'flex'; break;
          case 'обувь': card.style.display = title.includes('кроссовки') ? 'flex' : 'none'; break;
          case 'одежда': card.style.display = (title.includes('футболка') || title.includes('толстовка')) ? 'flex' : 'none'; break;
          case 'тренажеры': card.style.display = (title.includes('дорожка') || title.includes('велотренажер')) ? 'flex' : 'none'; break;
          case 'фитнес': card.style.display = (title.includes('гантель') || title.includes('фитбол')) ? 'flex' : 'none'; break;
          case 'игровые виды': card.style.display = title.includes('мяч') ? 'flex' : 'none'; break;
          case 'аксессуары': card.style.display = (title.includes('браслет') || title.includes('бутылка')) ? 'flex' : 'none'; break;
          case 'спортивное питание': card.style.display = (title.includes('протеин') || title.includes('bcaa')) ? 'flex' : 'none'; break;
          case 'распродажа':
            const price = parseInt(card.querySelector('.price').textContent.replace(/\s|₽/g, ''));
            card.style.display = price <= 3000 ? 'flex' : 'none';
            break;
          default: card.style.display = 'none';
        }
      });
    });
  });

  // --- Поиск по названию ---
  function searchProducts() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'flex' : 'none';
    });
  }
  searchButton.addEventListener('click', searchProducts);
  searchInput.addEventListener('keyup', e => { if(e.key === 'Enter') searchProducts(); });

  // --- Уведомления ---
  const toastContainer = document.createElement('div');
  toastContainer.style.position = 'fixed';
  toastContainer.style.bottom = '20px';
  toastContainer.style.right = '20px';
  toastContainer.style.display = 'flex';
  toastContainer.style.flexDirection = 'column';
  toastContainer.style.gap = '10px';
  toastContainer.style.zIndex = '9999';
  document.body.appendChild(toastContainer);

  function showToast(message, event=null) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.background = 'var(--accent)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 16px';
    toast.style.borderRadius = '12px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    toast.style.pointerEvents = 'none';

    if(event){
      const rect = event.target.getBoundingClientRect();
      toast.style.position = 'absolute';
      toast.style.left = `${rect.left + window.scrollX}px`;
      toast.style.top = `${rect.top + window.scrollY - 40}px`;
    } else {
      toast.style.position = 'relative';
    }

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(-10px)'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.addEventListener('transitionend', () => toast.remove());
    }, 2000);
  }

  // --- Добавление кнопок "В корзину" и "Избранное" на карточки ---
  document.querySelectorAll('.product-card').forEach(card => {
    const productInfo = card.querySelector('.product-info');
    const addButton = productInfo.querySelector('button');
    const favButton = document.createElement('button');
    favButton.textContent = 'Добавить в избранное';
    favButton.style.marginTop = '8px';
    favButton.className = 'fav-btn';
    productInfo.appendChild(favButton);

    const productName = productInfo.querySelector('h3').textContent;
    const productPrice = productInfo.querySelector('.price').textContent;
    const productImage = card.querySelector('img').src;

    // --- Проверяем избранное ---
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.find(item => item.name === productName)) {
      favButton.textContent = 'В избранном';
      favButton.disabled = true;
      favButton.style.background = '#10b981';
      favButton.style.color = '#fff';
      favButton.style.cursor = 'default';
    }

    favButton.addEventListener('click', (e) => {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (!favorites.find(item => item.name === productName)) {
        favorites.push({ name: productName, price: productPrice, image: productImage, description: '' });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favButton.textContent = 'В избранном';
        favButton.disabled = true;
        favButton.style.background = '#10b981';
        favButton.style.color = '#fff';
        favButton.style.cursor = 'default';
        showToast(`Товар "${productName}" добавлен в избранное!`, e);
      }
    });

    // --- Кнопка "В корзину" ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.find(item => item.name === productName)) {
      addButton.textContent = 'В корзине';
      addButton.disabled = true;
      addButton.style.background = '#f59e0b';
      addButton.style.cursor = 'default';
    }

    addButton.addEventListener('click', (e) => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.name === productName);
      if (!existingItem) {
        cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        addButton.textContent = 'В корзине';
        addButton.disabled = true;
        addButton.style.background = '#f59e0b';
        addButton.style.cursor = 'default';
        showToast(`Товар "${productName}" добавлен в корзину!`, e);
      }
    });
  });

  // --- Модальное окно ---
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');

  main.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    if (e.target.tagName.toLowerCase() === 'button') return;

    const productInfo = card.querySelector('.product-info');
    const productName = productInfo.querySelector('h3').textContent;
    const productPrice = productInfo.querySelector('.price').textContent;
    const productImage = card.querySelector('img').src;
    const productDesc = productInfo.querySelector('p').textContent;

    document.getElementById('modal-title').textContent = productName;
    document.getElementById('modal-content').innerHTML = `
      <img src="${productImage}" alt="${productName}" style="width:100%;max-width:400px;margin-bottom:10px;">
      <p>${productDesc}</p>
      <strong>${productPrice}</strong>
    `;

    modal.style.display = 'block';
    backdrop.style.display = 'block';
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
  });

  backdrop.addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
  });

document.querySelector('.logo').addEventListener('click', () => {
  window.location.href = 'catalog.html';
});


});
