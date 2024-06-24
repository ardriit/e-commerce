export default function Header(){
    const isLoggedIn = JSON.parse(localStorage.getItem('is_loggedin'));

    return`
        <header class= "bg-blue-300 shadow-xl mb-4">
        <div class = "container mx-auto py-7 flex justify-between">
        <h1 class= "text-white text-4xl font-bold"><a href="index.html">E-SHOP</a></h1>
        <nav> 
            <ul class = "flex gap-5 text-lg">
                <li><a href="index.html">Shop</a></li>
                <li><a href="cart.html">Cart</a></li>
                ${isLoggedIn ? `
                <li><a href="dashboard.html">Dashboard</a></li>
                ` : `
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
                `}
            </ul>
        </nav>
        </div>
        </header>
    `;

}