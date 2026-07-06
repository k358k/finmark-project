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
    runAnalyticsBtn.addEventListener('click', async function () {
        const errorBanner = document.getElementById('analytics-error-banner');
        const revenueUI = document.getElementById('ui-total-revenue');
        const volumeUI = document.getElementById('ui-total-volume');
        
        if (errorBanner) {
            errorBanner.style.display = 'none';
            errorBanner.textContent = '';
        }

        const ACTIVE_URL = 'http://localhost:3004/api/reports/summary';
        const STANDBY_URL = 'http://localhost:3014/api/reports/summary';

        // --- ATTEMPT 1: Primary Active Endpoint (Port 3004) ---
        try {
            console.log("Routing data request to Primary Node [Port 3004]...");
            const response = await fetch(ACTIVE_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP Status ${response.status}`);
            }
            
            const data = await response.json();
            
            // Render to browser UI
            if (revenueUI) {
                revenueUI.innerText = `$${data.metrics.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            }
            if (volumeUI) {
                volumeUI.innerText = `${data.metrics.totalItemsSold.toLocaleString()} units`;
            }
            console.log("✓ Success: Data pulled cleanly from Port 3004.");

        } catch (activeError) {
            // --- ATTEMPT 2: Failover to Standby Endpoint (Port 3014) ---
            console.warn("⚠️ Primary Node [3004] unreachable. Initiating instant failover sequence to Backup Node [3014]...", activeError.message);
            
            try {
                const response = await fetch(STANDBY_URL);
                
                if (!response.ok) {
                    throw new Error(`HTTP Status ${response.status}`);
                }
                
                const data = await response.json();
                
                // Render backup data safely onto browser UI
                if (revenueUI) {
                    revenueUI.innerText = `$${data.metrics.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                }
                if (volumeUI) {
                    volumeUI.innerText = `${data.metrics.totalItemsSold.toLocaleString()} units`;
                }
                console.log("✓ High Availability Achieved: Backup Node [Port 3014] handled the request smoothly with zero system downtime.");

            } catch (standbyError) {
                // --- SYSTEM CRASH: Both lines are disconnected ---
                console.error("🚨 Total Service Outage: Both primary and standby engines are completely offline.", standbyError.message);
                if (errorBanner) {
                    errorBanner.textContent = `⚠️ System Exception: Data Pipeline Interrupted. Connection to both Active (3004) and Standby (3014) clusters failed.`;
                    errorBanner.style.display = 'block';
                }
            }
        }
    });
}