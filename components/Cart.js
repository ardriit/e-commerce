
export default function Cart(){
    
   const cartContainer = document.getElementById('cart')
   const cart = JSON.parse(localStorage.getItem('cart'))

   if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
    return;
}

let cartHtml = `

    <table class="w-full text-left border-collapse">
        <tr>
            <th class="border-b py-4">Image</th>
            <th class="border-b py-4">Product</th>
            <th class="border-b py-4">Price</th>
            <th class="border-b py-4">Quantity</th>
            <th class="border-b py-4">Total</th>
            <th class="border-b py-4">Actions</th>
        </tr>`;
    
        
    let totalCost = 0;
    
    for (const productId in cart){
        const item = cart[productId];
        const totalPrice = item.price * item.quantity;
        totalCost += totalPrice;

        cartHtml += `
        <tr>
                <td class="border-b py-4">
                    <img src="${item.thumbnail}" alt="${item.title}" class="size-20 object-cover">
                </td>
                <td class=" border-b py-4">${item.title}</td>
                <td class="border-b py-4">${item.price} &#8364;</td>
                <td class="border-b py-4">${item.quantity}</td>
                <td class="border-b py-4">${totalPrice} &#8364;</td>
                <td class="border-b py-4">
                    <button data-id="${productId}" class="remove-button bg-red-500 text-white font-bold py-2 px-4 rounded-full">Remove</button>
                </td>
            </tr>
        `;
        
    }

    cartHtml += `
    </table>
        <div class="text-right mt-6">
            <p class=" font-bold text-xl">Total: ${totalCost.toFixed(2)} &#8364;</p>
        </div>`
    cartHtml += `<form id = "order-form" class="my-4 flex items-center" action="#">
    <textarea name="address" id="address" class="w-1/3 border border-blue-200 p-3 mx-3" placeholder="Enter email address"></textarea>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full " type="submit">Order</button>
</form>`

    cartContainer.innerHTML = cartHtml;

    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', handleOrder);
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[productId]) {
        delete cart[productId];
        localStorage.setItem('cart', JSON.stringify(cart));
        Cart(); 
    }

}       
function handleOrder(event) {
    event.preventDefault();
    const address = document.getElementById('address').value;
    if (!address) {
        alert('Please enter your address.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const loggedInUser = JSON.parse(localStorage.getItem('is_loggedin'));

    if (!loggedInUser) {
        alert('You must be logged in to place an order.');
        return;
    }

    const userOrders = JSON.parse(localStorage.getItem('orders')) || {};
    const userOrdersList = userOrders[loggedInUser.email] || [];

    const newOrder = {
        date: new Date().toISOString(),
        address: address,
        items: cart
    };

    userOrdersList.push(newOrder);
    userOrders[loggedInUser.email] = userOrdersList;

    localStorage.setItem('orders', JSON.stringify(userOrders));
    localStorage.removeItem('cart'); // Clear cart after placing order
    window.location.href = 'dashboard.html'; // Redirect to dashboard
        Cart()

}