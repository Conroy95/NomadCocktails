fetch('cocktails.json')
  .then(res => res.json())
  .then(data => renderCocktails(data));

function renderCocktails(cocktails) {
  const list = document.getElementById('cocktail-list');
  cocktails.forEach(cocktail => {
    list.innerHTML += `
      <div class="cocktail-card">
        <img src="${cocktail.image}" alt="${cocktail.name}">
        <h2>${cocktail.name}</h2>
        <p>${cocktail.ingredients.join(', ')}</p>
        <small>${cocktail.instructions}</small>
      </div>
    `;
  });
}
