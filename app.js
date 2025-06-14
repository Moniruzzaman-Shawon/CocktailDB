document.getElementById('cart-main-container').innerHTML = '';
let cartItems = [];
let cartTotal = 0;

const MAX_CART_ITEMS = 7;

const allCocktails = (query = '') => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`) //dynamic
        .then(res => res.json())
        .then(data => {
            const cocktails = data.drinks;
            if (cocktails) {
                displayAllCocktails(cocktails);
            } else {
                document.getElementById('cocktail-container').innerHTML = '<h1 class="text-danger text-center">No drinks found.</h1>';
            }
        })
        .catch(err => console.error('Fetch error:', err));
};

const displayAllCocktails = (cocktails) => {
    const container = document.getElementById('cocktail-container');
    container.innerHTML = '';

    cocktails.forEach(cocktail => {
        const div = document.createElement('div');
        div.className = 'col-12 col-md-4';

        div.innerHTML = `
      <div class="card h-100 p-2">
        <img class="card-img-top" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${cocktail.strDrink}</h5>
          <p class="card-text">${cocktail.strInstructions?.slice(0, 40)}...</p>
          <div class="d-flex justify-content-center gap-2 mt-2">
            <button class="btn btn-outline-primary btn-sm" onclick="showDetails('${cocktail.idDrink}')">Details</button>
            <button class="btn btn-outline-success btn-sm" onclick="handleAddToCart('${cocktail.strDrink}', '${cocktail.strDrinkThumb}', ${getRandomPrice()})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
        container.appendChild(div);
    });
};

function getRandomPrice() {
    return (Math.random() * 15 + 5).toFixed(2);
}

const handleAddToCart = (drinkName, drinkImage, price) => {
    if (cartItems.length >= MAX_CART_ITEMS) {
        alert(`You can add only up to ${MAX_CART_ITEMS} items in the cart.`);
        
        return;
    }

    cartItems.push({ name: drinkName, image: drinkImage, price: parseFloat(price) });
    updateCartUI();
};

const updateCartUI = () => {
    const cart = document.getElementById('cart-main-container');
    cart.innerHTML = '';

    cartTotal = 0;

    cartItems.forEach(item => {
        cartTotal += item.price;

        const div = document.createElement('div');
        div.className = 'd-flex align-items-center border-bottom py-2 gap-3';

        div.innerHTML = `
        
      <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />
      <div>
        <p class="mb-0">${item.name}</p>
        <small class="text-muted">$${item.price.toFixed(2)}</small>
      </div>
    `;
        cart.appendChild(div);
    });

    document.getElementById('cart-total').innerText = cartTotal.toFixed(2);
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
        <p>${drink.strInstructions}</p>
      `;
            const drinkModal = new bootstrap.Modal(document.getElementById('drinkModal'));
            drinkModal.show();
        })
        .catch(err => console.error('Fetch error:', err));
};

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    allCocktails(query);
});

allCocktails('a'); //load all by default
