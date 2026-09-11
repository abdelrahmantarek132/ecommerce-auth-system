document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname.split("/").pop();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if ((currentPage === "home.html" || currentPage === "") && !loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    const signupBtn = document.getElementById("Rigester");
    if (signupBtn) {
        signupBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (name === "" || email === "" || password === "") {
                alert("Please fill in all fields");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }

            const checkUser = users.find(u => u.email === email);
            if (checkUser) {
                alert("Email already registered!");
                return;
            }

            users.push({ name: name, email: email, password: password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Account created successfully!");
            window.location.href = "login.html";
        });
    }

    const loginBtn = document.getElementById("login");
    if (loginBtn) {
        loginBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                alert("Please fill all fields");
                return;
            }

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                window.location.href = "home.html";
            } else {
                alert("Wrong email or password");
            }
        });
    }

    if (currentPage === "home.html" || currentPage === "") {

        const userName = document.getElementById("userName");
        if (userName && loggedInUser) {
            userName.textContent = loggedInUser.name;
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("loggedInUser");
                window.location.href = "login.html";
            });
        }

        const darkBtn = document.getElementById("darkThemeBtn");
        const lightBtn = document.getElementById("lightThemeBtn");

        if (darkBtn) {
            darkBtn.addEventListener("click", function () {
                document.body.classList.add("dark-mode");
                localStorage.setItem("theme", "dark");
            });
        }

        if (lightBtn) {
            lightBtn.addEventListener("click", function () {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("theme", "light");
            });
        }

        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
        const productsContainer = document.getElementById("products");
        const searchInput = document.getElementById("searchInput");
        let products = [];

        function renderProducts(list) {
            productsContainer.innerHTML = "";

            if (list.length === 0) {
                productsContainer.innerHTML = "<p>No products found</p>";
                return;
            }

            list.forEach(function (p) {
                const card = document.createElement("div");
                card.classList.add("product-card");
                card.innerHTML = `
                    <img src="${p.image}" alt="${p.title}">
                    <h3>${p.title.slice(0, 25)}...</h3>
                    <p class="price">$${p.price}</p>
                `;
                productsContainer.appendChild(card);
            });
        }

        fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                products = data;
                renderProducts(products);
            })
            .catch(err => {
                console.log(err);
                productsContainer.innerHTML = "<p>Error loading data</p>";
            });
        if (searchInput) {
            searchInput.addEventListener("input", function (e) {
                const text = e.target.value.toLowerCase();
                const filtered = products.filter(p => p.title.toLowerCase().includes(text));
                renderProducts(filtered);
            });
        }
    }
});

