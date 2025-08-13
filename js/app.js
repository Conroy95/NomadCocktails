let cocktailsData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
  // Recepten laden
  fetch('cocktails.json')
    .then(res => res.json())
    .then(data => {
      cocktailsData = data;
      renderCocktails(data);
    });

  // Zoekfunctie
  document.getElementById('search').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const filtered = cocktailsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
    renderCocktails(filtered);
  });

  // Dark mode
  const toggle = document.getElementById('toggle-dark');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  });
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  // Service Worker voor PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
});

function renderCocktails(cocktails) {
  const list = document.getElementById('cocktail-list');
  list.innerHTML = '';
  cocktails.forEach(cocktail => {
    const isFav = favorites.includes(cocktail.name);
    const card = `
      <div class="cocktail-card">
        <img src="${cocktail.image}" alt="${cocktail.name}">
        <h2>${cocktail.name}</h2>
        <p>${cocktail.ingredients.join(', ')}</p>
        <small>${cocktail.instructions}</small>
        <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${cocktail.name}')">
          ${isFav ? '★ Favoriet' : '☆ Favoriet'}
        </button>
      </div>
    `;
    list.innerHTML += card;
  });
}

function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderCocktails(cocktailsData);
}
