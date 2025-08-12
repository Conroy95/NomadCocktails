let cocktailsData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('cocktails.json')
    .then(res => res.json())
    .then(data => {
      cocktailsData = data;
      renderCocktails(data);
    });

  document.getElementById('search').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const filtered = cocktailsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
    renderCocktails(filtered);
  });

  document.getElementById('toggle-dark').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  });

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
});

function renderCocktails(cocktails) {
  const list = document.getElementById('cocktail-list');
  list.innerHTML = '';
  cocktails.forEach(cocktail => {
    const isFav = favorites.includes(cocktail.name);
    list.innerHTML += `
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