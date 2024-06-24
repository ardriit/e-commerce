export default function Dashboard() {
    const ordersContainer = document.getElementById('orders');
    const loggedInUser = JSON.parse(localStorage.getItem('is_loggedin'));

    

    const userOrders = JSON.parse(localStorage.getItem('orders')) || {};
    const userOrdersList = userOrders[loggedInUser.email] || [];

    if (userOrdersList.length === 0) {
        ordersContainer.innerHTML = '<p class="text-center text-gray-500">You have no orders.</p>';
        return;
    }

    let ordersHtml = '';
    
    userOrdersList.forEach(order => {
        ordersHtml += `
            <div class=" w-full border rounded-lg p-4 mb-4">
                <p class="font-semibold">Date: ${new Date(order.date).toLocaleString()}</p>
                <p class="font-semibold">Address: ${order.address}</p>
                <table class="w-full text-left border-collapse mt-2">
                    <tr>
                        <th class="border-b py-2">Image</th>
                        <th class="border-b py-2">Product</th>
                        <th class="border-b py-2">Price</th>
                        <th class="border-b py-2">Quantity</th>
                        <th class="border-b py-2">Total</th>
                    </tr>`;
        
        let totalCost = 0;

        for (const productId in order.items) {
            const item = order.items[productId];
            const totalPrice = item.price * item.quantity;
            totalCost += totalPrice;

            ordersHtml += `
                <tr>
                    <td class="border-b py-2">
                        <img src="${item.thumbnail}" alt="${item.title}" class="size-20 object-cover">
                    </td>
                    <td class="border-b border py-2">${item.title}</td>
                    <td class="border-b border py-2">${item.price} &#8364;</td>
                    <td class="border-b border py-2 ">${item.quantity}</td>
                    <td class="border-b border py-2">${totalPrice} &#8364;</td>
                </tr>`;
        }

        ordersHtml += `
                </table>
                <div class="text-right mt-2">
                    <p class="font-bold">Order Total: ${totalCost.toFixed(2)} &#8364;</p>
                </div>
            </div>`;
    });

    ordersContainer.innerHTML = ordersHtml;
}