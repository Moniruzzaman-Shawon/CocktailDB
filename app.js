const allCocktails = () => {
  fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
    .then(res => res.json())
    .then(data => {
      if (data.drinks) {
        displayAllCocktails(data.drinks);
      } else {
        console.warn('No drinks found');
      }
    })
    .catch(err => console.error('Fetch error:', err));
};

const displayAllCocktails = (cocktails) => {
  const cocktailContainer = document.getElementById('cocktail-container');
  cocktailContainer.innerHTML = '';

  cocktails.forEach(cocktail => {
    const div = document.createElement('div');

    div.innerHTML = `
      <div class="card h-100 p-2">
        <img class="card-img-top" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
        <div class="card-body">
          <h5 class="card-title">${cocktail.strDrink}</h5>
          <p class="card-text">${cocktail.strInstructions?.slice(0, 40)}...</p>
          <div class="d-flex justify-content-center gap-2" >
            <button class="btn btn-outline-primary btn-sm">Details</button>
            <button class="btn btn-outline-success btn-sm">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    cocktailContainer.appendChild(div);
  });
};


function handleContainer(drinkId) {
  alert(`You clicked drink #${drinkId}`);
}

allCocktails();
