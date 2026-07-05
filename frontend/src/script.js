// =========================================================================
// EXTRA FRONTEND POLISH: Password Visibility Toggle
// =========================================================================
const togglePasswordIcon = document.querySelector(".password-box i");
const passwordInput = document.getElementById("password");

if (togglePasswordIcon && passwordInput) {
    togglePasswordIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.classList.remove("fa-eye");
            togglePasswordIcon.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.classList.remove("fa-eye-slash");
            togglePasswordIcon.classList.add("fa-eye");
        }
    });
}

// =========================================================================
// SECTION 1: LOGIN FORM
// =========================================================================
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const loginMessage = document.getElementById("login-message");
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (loginMessage) {
            loginMessage.style.color = "orange";
            loginMessage.innerHTML = "Connecting to authentication services...";
        }

        // ===== MEMBER 4: LOGIN FETCH REQUEST =====
        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (loginMessage) {
                    loginMessage.style.color = "green";
                    loginMessage.innerHTML = "✓ Success! Redirecting to Dashboard...";
                }
                
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 800);
            } else {
                if (loginMessage) {
                    loginMessage.style.color = "red";
                    loginMessage.innerHTML = "✗ " + (data.message || "Login failed");
                }
            }
        } catch (error) {
            if (loginMessage) {
                loginMessage.style.color = "red";
                loginMessage.innerHTML = "✗ Error: " + error.message;
            }
        }
        // ===== END MEMBER 4 LOGIN CODE =====
    });
}

// =========================================================================
// SECTION 2: ORDER PLACEMENT FORM
// =========================================================================
const orderForm = document.getElementById("order-form");

if (orderForm) {
    orderForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const orderMessage = document.getElementById("order-message");

        const customerName = document.getElementById("customer-name").value;
        const quantity = document.getElementById("quantity").value;
        const orderValue = document.getElementById("order-value").value;

        if (orderMessage) {
            orderMessage.style.color = "blue";
            orderMessage.innerHTML = "Processing order details...";
        }

        // ===== MEMBER 4: ORDERS FETCH REQUEST =====
        try {
            const response = await fetch("http://localhost:3002/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: customerName,
                    quantity: quantity,
                    orderValue: orderValue,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (orderMessage) {
                    orderMessage.style.color = "green";
                    orderMessage.innerHTML = "✓ Order #" + (data.orderId || "N/A") + " placed successfully!";
                }
            } else {
                if (orderMessage) {
                    orderMessage.style.color = "red";
                    orderMessage.innerHTML = "✗ " + (data.message || "Order failed");
                }
            }
        } catch (error) {
            if (orderMessage) {
                orderMessage.style.color = "red";
                orderMessage.innerHTML = "✗ Error: " + error.message;
            }
        }
        // ===== END MEMBER 4 ORDERS CODE =====
    });
}

// =========================================================================
// 📊 SECTION 3: ANALYTICS PROCESSING ENGINE (REPORTS INTERFACE)
// =========================================================================
const runAnalyticsBtn = document.getElementById('run-analytics-btn');

if (runAnalyticsBtn) {
    runAnalyticsBtn.addEventListener('click', function () {
        const errorBanner = document.getElementById('analytics-error-banner');
        
        if (errorBanner) {
            errorBanner.style.display = 'none';
            errorBanner.textContent = '';
        }

        fetch('http://localhost:3004/api/reports/summary')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Data Pipeline Interrupted (HTTP Status ${response.status}). Calculations aborted.`);
                }
                return response.json();
            })
            .then(data => {
                const revenueUI = document.getElementById('ui-total-revenue');
                const volumeUI = document.getElementById('ui-total-volume');

                if (revenueUI) {
                    revenueUI.innerText = `$${data.metrics.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                }
                if (volumeUI) {
                    volumeUI.innerText = `${data.metrics.totalItemsSold.toLocaleString()} units`;
                }
            })
            .catch(error => {
                if (errorBanner) {
                    errorBanner.textContent = `⚠️ System Exception: ${error.message}`;
                    errorBanner.style.display = 'block';
                }
            });
    });
}