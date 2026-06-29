// =====================================
// Authentication System
// =====================================

// ----------------------
// Employee Registration
// ----------------------

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        message.innerHTML = "";

        if (password !== confirmPassword) {

            message.innerHTML =
                '<div class="alert alert-danger">Passwords do not match.</div>';

            return;

        }

        let users = getUsers();

        const exists = users.find(user => user.email === email);

        if (exists) {

            message.innerHTML =
                '<div class="alert alert-danger">Email already exists.</div>';

            return;

        }

        users.push({

            id: Date.now(),

            name,

            email,

            password,

            role: "employee"

        });

        saveUsers(users);

        message.innerHTML =
            '<div class="alert alert-success">Registration Successful!</div>';

        setTimeout(() => {

            window.location.href = "index.html";

        }, 1500);

    });

}



// ----------------------
// Employee Login
// ----------------------

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const message = document.getElementById("message");

        const users = getUsers();

        const user = users.find(

            u =>

                u.email === email &&

                u.password === password &&

                u.role === "employee"

        );

        if (!user) {

            message.innerHTML =
                '<div class="alert alert-danger">Invalid Email or Password</div>';

            return;

        }

        localStorage.setItem(

            "currentUser",

            JSON.stringify(user)

        );

        window.location.href = "dashboard.html";

    });

}



// ----------------------
// Admin Login
// ----------------------

const adminForm = document.getElementById("adminLoginForm");

if (adminForm) {

    adminForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const message = document.getElementById("message");

        const users = getUsers();

        const admin = users.find(

            u =>

                u.email === email &&

                u.password === password &&

                u.role === "admin"

        );

        if (!admin) {

            message.innerHTML =
                '<div class="alert alert-danger">Invalid Admin Login</div>';

            return;

        }

        localStorage.setItem(

            "currentAdmin",

            JSON.stringify(admin)

        );

        window.location.href = "admin-dashboard.html";

    });

}



// ----------------------
// Logout
// ----------------------

function logout() {

    localStorage.removeItem("currentUser");

    localStorage.removeItem("currentAdmin");

    window.location.href = "index.html";

}
