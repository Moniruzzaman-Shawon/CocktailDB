const MAX_CART_ITEMS = 7;
let totalPrice = 0;

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

const allCocktails = (query = '') => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            const cocktails = data.drinks;
            if (cocktails) {
                displayAllCocktails(cocktails.slice(0, 8));
            } else {
                document.getElementById('cocktail-container').innerHTML = '<h4 class="text-danger text-center">No drinks found.</h4>';
            }
        });
};

const displayAllCocktails = (cocktails) => {
    const container = document.getElementById('cocktail-container');
    container.innerHTML = '';

    cocktails.forEach(cocktail => {
        const price = getRandomPrice();
        const div = document.createElement('div');
        div.style.flex = '1 1 250px';
        div.innerHTML = `
      <div class="card h-100 p-2">
        <img class="card-img-top" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${cocktail.strDrink}</h5>
          <p class="mb-1"><strong>Category:</strong> ${cocktail.strCategory}</p>
          <p class="card-text">${cocktail.strInstructions?.slice(0, 15)}...</p>
          <div class="d-flex justify-content-center gap-2 mt-2">
            <button class="btn btn-outline-primary btn-sm" onclick="showDetails('${cocktail.idDrink}')">Details</button>
            <button class="btn btn-outline-success btn-sm" onclick="handleAddToCart('${cocktail.strDrink}', '${cocktail.strDrinkThumb}', ${price})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
        container.appendChild(div);
    });
};

const handleAddToCart = (drinkName, img, price) => {
    const cart = document.getElementById('cart-main-container');
    const currentItems = cart.querySelectorAll('.cart-item').length;
    const alertContainer = document.getElementById('alert-container');

    if (currentItems >= MAX_CART_ITEMS) {
        alertContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        You can add only up to ${MAX_CART_ITEMS} items in the cart.
      </div>
    `;
        setTimeout(() => (alertContainer.innerHTML = ''), 3000);
        return;
    }

    const div = document.createElement('div');
    div.className = 'cart-item d-flex gap-2 align-items-center border-bottom py-2';
    div.innerHTML = `
    <img src="${img}" alt="${drinkName}" width="50" height="50" class="rounded" />
    <div>
      <p class="mb-0">${drinkName}</p>
      <p class="mb-0 text-muted">৳${price}</p>
    </div>
  `;
    cart.appendChild(div);

    totalPrice += price;
    updateTotal();
};

const updateTotal = () => {
    document.getElementById('total-container').innerText = `Total: ৳${totalPrice}`;
};

const showDetails = (drinkId) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
        .then(res => res.json())
        .then(data => {
            const drink = data.drinks[0];
            const modalBody = document.getElementById('drinkModalBody');
            modalBody.innerHTML = `
        <img src="${drink.strDrinkThumb}" class="img-fluid mb-3" alt="${drink.strDrink}" />
        <h3>${drink.strDrink}</h3>
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        <p><strong>Ingredients:</strong> ${[drink.strIngredient1, drink.strIngredient2, drink.strIngredient3].filter(Boolean).join(', ')}</p>
      `;
            const drinkModal = new bootstrap.Modal(document.getElementById('drinkModal'));
            drinkModal.show();
        });
};

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    allCocktails(query);
});

allCocktails('a'); //show all
