// import axios from '../node_modules/axios/dist/esm/axios.js';


// export default function Shop(){
//     axios.get('https://dummyjson.com/products')
//     .then(response =>{
//     const products = response.data.products;
    
//     displayProducts(products)
    
//     })
//     .catch(error => {
//         console.error('Error fetching the products:', error);
//     });
//     }
    
//     function displayProducts(products){
//         const shopContainer = document.getElementById('shop')
//         if(!shopContainer){
//         console.error('No element with id "shop" found in the document.');
//             return;   
//         }
    
    
//     shopContainer.innerHTML = ''
    
//     for(let product of products){
//             const productElement = document.createElement('div');
//             productElement.className = 'border rounded-xl flex flex-col items-center  hover:shadow-xl'
//             productElement.innerHTML =`
//             <img src = "${product.thumbnail}"/>
//             <p class="text-md font-semibold mb-2">${product.title}</p>
//             <p class="text-blue-300 font-bold"> ${product.price}&#8364</p>
//             `
//             productElement.addEventListener('click', () => {
//                 window.location.href = `single-product.html?id=${product.id}`;
//             });
//             shopContainer.appendChild(productElement);
//         }
//     }
import axios from '../node_modules/axios/dist/esm/axios.js';

export default function Shop() {
    axios.get('https://dummyjson.com/products')
    .then(response => {
        const allProducts = response.data.products;
        displayProducts(allProducts);
        
        // Fetch and display categories
        axios.get('https://dummyjson.com/products/category-list')
        .then(categoryResponse => {
            const categories = categoryResponse.data;
            displayCategories(categories, allProducts);
        })
        .catch(error => {
            console.error('Error fetching the categories:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching the products:', error);
    });
}

function displayCategories(categories, allProducts) {
    const tabsContainer = document.getElementById('tabs');
    if (!tabsContainer) {
        console.error('No element with id "tabs" found in the document.');
        return;
    }

    tabsContainer.innerHTML = '';

    // Create 'All' tab to show all products
    const allTab = document.createElement('button');
    allTab.className = 'px-4 py-2 bg-blue-500 text-white rounded-full m-2 hover:bg-blue-700';
    allTab.innerText = 'All';
    allTab.addEventListener('click', () => {
        displayProducts(allProducts);
    });
    tabsContainer.appendChild(allTab);

    // Create tabs for each category
    const categoriesToShow = categories.slice(0, 7); // Show only the first 6 categories
    categoriesToShow.forEach(category => {
        const tabElement = document.createElement('button');
        tabElement.className = 'px-4 py-2 bg-blue-500 text-white rounded-full m-2 hover:bg-blue-700';
        tabElement.innerText = category.toString(); // Ensure category is a string
        tabElement.addEventListener('click', () => {
            fetchProductsByCategory(category);
        });
        tabsContainer.appendChild(tabElement);
    });
}

function fetchProductsByCategory(category) {
    axios.get(`https://dummyjson.com/products/category/${category}`)
    .then(response => {
        const products = response.data.products;
        displayProducts(products);
    })
    .catch(error => {
        console.error(`Error fetching the products for category ${category}:`, error);
    });
}

function displayProducts(products) {
    const shopContainer = document.getElementById('shop');
    if (!shopContainer) {
        console.error('No element with id "shop" found in the document.');
        return;   
    }

    shopContainer.innerHTML = '';

    for (let product of products) {
        const productElement = document.createElement('div');
        productElement.className = 'border rounded-xl flex flex-col items-center hover:shadow-xl p-4';
        productElement.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="mb-2 w-full h-48 object-cover rounded">
            <p class="text-md font-semibold mb-2">${product.title}</p>
            <p class="text-blue-300 font-bold">${product.price}&#8364;</p>
            <button class="favorite-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">&#128722 Add to Cart</button>
            <p  class=" msg text-sm text-red-600 hidden "></p>

            `;
           
            // Add click event listener to the "Add to Cart" button
            const favoriteButton = productElement.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', () => {
                addToCart(product, 1); // Adding one item by default
                
                // Show the "added to cart" message
                const message = productElement.querySelector('.msg');
                if (message) {
                    message.classList.remove('hidden');
                    
                    // Hide the message after 5 seconds
                    setTimeout(() => {
                        message.classList.add('hidden');
                    }, 3000);
                    let cart = JSON.parse(localStorage.getItem('cart')) || {};
                    const quantity = cart[product.id] ? cart[product.id].quantity:0
                    message.innerHTML = `Product added to cart ${quantity} times.`
                    

                }
            });
            
        // productElement.addEventListener('click', () => {
        //     window.location.href = `single-product.html?id=${product.id}`;
        // });
        productElement.addEventListener('click', (event) => {
            // Prevent product element click event from triggering when clicking the button
            if (!event.target.classList.contains('favorite-button')) {
                window.location.href = `single-product.html?id=${product.id}`;
            }
    })
        shopContainer.appendChild(productElement);
    }
    
}

function addToCart(product, quantity){
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if(cart[product.id]){
        cart[product.id].quantity += parseInt(quantity) 
    }
    else{
        cart[product.id] = {
            id:product.id,
            title: product.title,
            price: product.price,
            quantity: parseInt(quantity),
            thumbnail: product.thumbnail
        }
       
        
    }

    const isLoggedIn = JSON.parse(localStorage.getItem('is_loggedin'))
    if(isLoggedIn){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    else{
        alert('Please login first!')
    }
}
