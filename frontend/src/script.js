// =========================================================================
// EXTRA FRONTEND POLISH: Password Visibility Toggle
// =========================================================================
const togglePasswordIcon = document.querySelector(".password-box i");
const passwordInput = document.getElementById("password");

if (togglePasswordIcon && passwordInput) {
    togglePasswordIcon.addEventListener("click", function () {
        // Toggle the input type between password and text
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.classList.remove("fa-eye");
            togglePasswordIcon.classList.add("fa-eye-slash"); // Changes icon to slashed eye
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.classList.remove("fa-eye-slash");
            togglePasswordIcon.classList.add("fa-eye"); // Changes icon back to regular eye
        }
    });
}

// =========================================================================
// SECTION 1: LOGIN FORM & TRANSITION LOGIC
// (Redirects user from index.html to dashboard.html)
// =========================================================================
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevents the page from reloading refresh-style

        // Grab message container to give user feedback
        const loginMessage = document.getElementById("login-message");
        
        if (loginMessage) {
            loginMessage.style.color = "orange";
            loginMessage.innerHTML = "Connecting to authentication services...";
        }

        // -----------------------------------------------------------------
        // TODO (@Jullohn - Member 4): Insert your Login Fetch Request here
        // Target Endpoint: http://localhost:3001/api/auth/login
        // Remember to use port 3001 as updated by Harvey!
        // -----------------------------------------------------------------

        // Temporary transition logic: Simulates a successful login response 
        // and safely redirects to Alvin's dashboard.html layout after 1 second.
        setTimeout(() => {
            if (loginMessage) {
                loginMessage.style.color = "green";
                loginMessage.innerHTML = "✓ Success! Redirecting to Dashboard...";
            }
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);
        }, 500);
    });
}

// =========================================================================
// SECTION 2: ORDER PLACEMENT FORM LOGIC
// =========================================================================
const orderForm = document.getElementById("order-form");

if (orderForm) {
    orderForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevents page reload on submission

        const orderMessage = document.getElementById("order-message");

        if (orderMessage) {
            orderMessage.style.color = "blue";
            orderMessage.innerHTML = "Processing order details...";
        }

        // -----------------------------------------------------------------
        // 🛠️ TODO (@Jullohn - Member 4): Insert your Orders Fetch Request here
        // Target Endpoint: http://localhost:3001/api/orders
        // Extract values from customer-name, quantity, and order-value inputs
        // -----------------------------------------------------------------
        
        // Temporary placeholder feedback until Fetch request is written
        setTimeout(() => {
            if (orderMessage) {
                orderMessage.style.color = "black";
                orderMessage.innerHTML = "ℹ️ Order submitted (Awaiting network link implementation by Member 4).";
            }
        }, 1000);
    });
}