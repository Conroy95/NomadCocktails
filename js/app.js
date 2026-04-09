let cocktailsData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const listElement = document.getElementById('cocktail-list');
  const searchInput = document.getElementById('search');
  const toggleBtn = document.getElementById('toggle-dark');

  // Cocktails laden
  fetch('cocktails.json')
    .then(res => res.json())
    .then(data => {
      cocktailsData = data;
      renderCocktails(data);
    });

  // Zoekfunctie
  searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const filtered = cocktailsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
    renderCocktails(filtered);
  });

  // Dark mode
  const toggleTheme = () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  };

  toggleBtn.addEventListener('click', toggleTheme);
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  }

  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.log(err));
  }
});

function renderCocktails(cocktails) {
  const list = document.getElementById('cocktail-list');
  if (cocktails.length === 0) {
    list.innerHTML = `<p style="text-align:center; grid-column:1/-1; padding:40px; opacity:0.5;">Geen cocktails gevonden...</p>`;
    return;
  }

  list.innerHTML = cocktails.map(cocktail => {
    const isFav = favorites.includes(cocktail.name);
    return `
      <div class="cocktail-card">
        <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
        <div class="card-info">
          <p class="ingredients">${cocktail.ingredients.join(' • ')}</p>
          <h2>${cocktail.name}</h2>
          <p class="instructions">${cocktail.instructions}</p>
        </div>
        <button class="favorite-btn ${isFav ? 'active' : ''}" 
                onclick="toggleFavorite('${cocktail.name.replace(/'/g, "\\'")}')">
          ${isFav ? '★ Favoriet' : '☆ Voeg toe'}
        </button>
      </div>
    `;
  }).join('');
}

window.toggleFavorite = function(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderCocktails(cocktailsData); // Refresh lijst om de ster-status te updaten
};
