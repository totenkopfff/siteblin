const favContainer = document.querySelector('#favorites');

function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favContainer.innerHTML = '<h4>Избранное</h4>';

  if (favorites.length === 0) {
    favContainer.innerHTML += '<p style="color:var(--muted)">Список избранного пуст.</p>';
    return;
  }

  favorites.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.position = 'relative';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:120px; height:120px; object-fit:cover; border-radius:8px; float:left; margin-right:12px;">
      <h5>${item.name}</h5>
      <p>${item.description}</p>
      <strong>${item.price}</strong>
      <button class="remove-fav" style="
        position:absolute;
        top:12px;
        right:12px;
        background:#ef4444;
        color:#fff;
        border:none;
        border-radius:6px;
        padding:6px 10px;
        cursor:pointer;
        font-weight:600;
      ">Удалить</button>
      <div style="clear:both;"></div>
    `;
    favContainer.appendChild(div);

    // Обработчик удаления
    div.querySelector('.remove-fav').addEventListener('click', () => {
      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites(); // Обновляем список после удаления
    });
  });
}

// Обновление при открытии вкладки "Избранное"
document.querySelector('button[data-tab="favorites"]').addEventListener('click', renderFavorites);
