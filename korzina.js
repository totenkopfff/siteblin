// Получаем корзину из localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Ссылки на контейнеры в HTML
const cartContainer = document.querySelector('.cart-items');
const summaryItemsElem = document.getElementById('summary-items');
const summaryPriceElem = document.getElementById('summary-price');
const summaryTotalElem = document.getElementById('summary-total');

// Функция рендера корзины
function renderCart() {
  // Убираем старые товары (кроме заголовка и ссылки "Вернуться")
  cartContainer.querySelectorAll('.cart-item').forEach(item => item.remove());

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalItems += item.quantity;
    const price = parseInt(item.price.replace(/\s|₽/g, ''));
    totalPrice += price * item.quantity;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
        <strong>${item.price}</strong>
      </div>
      <div class="item-actions">
        <input type="number" value="${item.quantity}" min="1" />
        <button>Удалить</button>
      </div>
    `;

    // Изменение количества
    const qtyInput = cartItem.querySelector('input');
    qtyInput.addEventListener('change', () => {
      const newQty = parseInt(qtyInput.value);
      if (newQty < 1) {
        qtyInput.value = item.quantity;
        return;
      }
      item.quantity = newQty;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });

    // Удаление товара
    const deleteBtn = cartItem.querySelector('button');
    deleteBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });

    // Вставляем перед ссылкой "Вернуться в каталог"
    const backLink = cartContainer.querySelector('.back-link');
    cartContainer.insertBefore(cartItem, backLink);
  });

  // Обновляем итоговые значения
  summaryItemsElem.textContent = `${totalItems} шт.`;
  summaryPriceElem.textContent = `${totalPrice.toLocaleString()} ₽`;
  summaryTotalElem.textContent = `${totalPrice.toLocaleString()} ₽`;
}


document.querySelector('.logo').addEventListener('click', () => {
  window.location.href = 'catalog.html';
});


// Рендерим корзину при загрузке страницы
renderCart();
