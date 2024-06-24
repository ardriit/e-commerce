// import axios from "../node_modules/axios/dist/esm/axios.js";


// export default function Product(productId) {
//     axios.get(`https://dummyjson.com/products/${productId}`)
//         .then(response => {
//             const product = response.data;
//             displayProductDetails(product);
//         })
//         .catch(error => {
//             console.error('Error fetching the product details:', error);
//         });
// }

// function displayProductDetails(product) {
//     const productContainer = document.getElementById('product-details');
//     if (!productContainer) {
//         console.error('No element with  id "product-details" found');
//         return;
//     }

//     productContainer.innerHTML += `
//         <div class ="flex flex-col items-center">
//             <img src="${product.thumbnail}" class="w-full h-48 object-cover mb-4" alt="${product.title}">
//             <h2 class="text-xl font-bold mb-2">${product.title}</h2>
//             <p class="text-gray-500 underline">${product.category}</p>
//             <p class="text-gray-600 mb-4">${product.description}</p>
//             <p class="text-blue-400 text-xl font-bold mb-4">${product.price} &#8364;</p>
//          </div>
//          <form action="#" id="form" class="flex justify-around my-3">
//             <input class="me-2 text-center border " type="number" min="1" value="1">
//             <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">Add to cart</button>
            
//         </form>     
//     `;
//     const form = document.getElementById('form');
//     form.addEventListener('submit', event => {
//         event.preventDefault();
//         const quantity = form.querySelector('input[type="number"]').value;
//         addToCart(product, quantity);
//     });
// }

// function addToCart(product, quantity) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || {};
    
//     // Shiko a egziston produkti dhe shto
//     if (cart[product.id]) {
//         cart[product.id].quantity += parseInt(quantity);
//     } else {
//         // Nese jo shtoje produktin
//         cart[product.id] = {
//             id: product.id,
//             title: product.title,
//             price: product.price,
//             quantity: parseInt(quantity),
//             thumbnail: product.thumbnail
//         };
//     }

//     // dhe ruaje carten ne localStorage
//     const isLoggedIn = JSON.parse(localStorage.getItem('is_loggedin'));
//     if(isLoggedIn){
//     localStorage.setItem('cart', JSON.stringify(cart));
//     }
//     else{
//         alert(`Please log in first`)
//     }

    // console.log(`Added ${quantity} of ${product.title} to cart.`);
    // console.log('Cart:', cart);
// }


import axios from '../node_modules/axios/dist/esm/axios.js';

export default function Product(productId) {
    axios.get(`https://dummyjson.com/products/${productId}`)
        .then(response => {
            const product = response.data;
            displayProductDetails(product);
            
            // Fetch related products from the same category
            fetchRelatedProducts(product.category, productId);
        })
        .catch(error => {
            console.error('Error fetching the product details:', error);
        });
}

function fetchRelatedProducts(category, excludeProductId) {
    axios.get(`https://dummyjson.com/products/category/${category}`)
        .then(response => {
            const relatedProducts = response.data.products.filter(product => product.id != excludeProductId);
            displayRelatedProducts(relatedProducts);
        })
        .catch(error => {
            console.error('Error fetching related products:', error);
        });
}

function displayProductDetails(product) {
    const productContainer = document.getElementById('product-details');
    if (!productContainer) {
        console.error('No element with id "product-details" found');
        return;
    }

    productContainer.innerHTML = `
        <div class="flex flex-col items-center">
            <img src="${product.thumbnail}" class="w-full h-48 object-cover mb-4" alt="${product.title}">
            <h2 class="text-xl font-bold mb-2">${product.title}</h2>
            <p class="text-gray-500 underline">${product.category}</p>
            <p class="text-gray-600 mb-4">${product.description}</p>
            <p class="text-blue-400 text-xl font-bold mb-4">${product.price} &#8364;</p>
         </div>
         <form action="#" id="form" class="flex justify-around my-3">
            <input class="me-2 text-center border" type="number" min="1" value="1">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">Add to cart</button>
         </form>     
    `;

    const form = document.getElementById('form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        const quantity = form.querySelector('input[type="number"]').value;
        addToCart(product, quantity);
    });
}

function addToCart(product, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    // Check if the product already exists in the cart
    if (cart[product.id]) {
        cart[product.id].quantity += parseInt(quantity);
    } else {
        // If not, add the product to the cart
        cart[product.id] = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: parseInt(quantity),
            thumbnail: product.thumbnail
        };
    }
    // let user = JSON.parse(localStorage.getItem('users'))
    // localStorage.setItem(`cart${user}`, JSON.stringify(cart));
    // console.log(`Added ${quantity} of ${product.title} to cart for user ${user.email}.`);
    //     console.log('Cart:', cart);
    // Save the updated cart to localStorage
    const isLoggedIn = JSON.parse(localStorage.getItem('is_loggedin'));
    if (isLoggedIn) {
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        alert('Please log in first');
    }
}

function displayRelatedProducts(relatedProducts) {
    const relatedContainer = document.getElementById('related');
    if (!relatedContainer) {
        console.error('No element with id "related" found');
        return;
    }

    relatedContainer.innerHTML = '';

    for (let product of relatedProducts) {
        const productElement = document.createElement('div');
        productElement.className = 'border rounded-xl flex flex-col items-center hover:shadow-xl p-4 m-2';
        productElement.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="mb-2 w-full h-48 object-cover rounded">
            <p class="text-md font-semibold mb-2">${product.title}</p>
            <p class="text-blue-300 font-bold">${product.price}&#8364;</p>
        `;
        productElement.addEventListener('click', () => {
            window.location.href = `single-product.html?id=${product.id}`;
        });
        relatedContainer.appendChild(productElement);
    }
}
