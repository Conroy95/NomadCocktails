let cocktailsData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const toggleBtn = document.getElementById('toggle-dark');

  // Fetch data
  fetch('cocktails.json')
    .then(res => res.json())
    .then(data => {
      cocktailsData = data;
      renderCocktails(data);
    })
    .catch(err => console.error("Oeps! Data niet gevonden."));

  // Zoeken met kleine vertraging voor rustiger beeld
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = cocktailsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
    renderCocktails(filtered);
  });

  // Dark Mode Toggle
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  });

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  }

  // PWA SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
});

function renderCocktails(cocktails) {
  const list = document.getElementById('cocktail-list');
  
  if (cocktails.length === 0) {
    list.innerHTML = `<div class="empty-state">Geen cocktails gevonden... 🍹</div>`;
    return;
  }

  // Gebruik map en join voor betere performance dan +=
  list.innerHTML = cocktails.map((cocktail, index) => {
    const isFav = favorites.includes(cocktail.name);
    return `
      <div class="cocktail-card" style="animation-delay: ${index * 0.05}s">
        <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
        <div class="card-info">
          <p class="ingredients">${cocktail.ingredients.join(' • ')}</p>
          <h2>${cocktail.name}</h2>
          <p class="instructions">${cocktail.instructions}</p>
        </div>
        <button class="favorite-btn ${isFav ? 'active' : ''}" 
                onclick="toggleFavorite('${cocktail.name.replace(/'/g, "\\'")}')">
          ${isFav ? '★ Opgeslagen' : '☆ Bewaar recept'}
        </button>
      </div>
    `;
  }).join('');
}

window.toggleFavorite = function(name) {
  favorites = favorites.includes(name) 
    ? favorites.filter(f => f !== name) 
    : [...favorites, name];
    
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderCocktails(cocktailsData);
};
