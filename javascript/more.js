 // JavaScript from Main.js
        document.addEventListener('DOMContentLoaded', () => {
            // Get references to all necessary elements
            const toggleLoginBtn = document.getElementById('toggle-login-btn');
            const toggleSignupBtn = document.getElementById('toggle-signup-btn');
            const mainButtons = document.getElementById('main-buttons');
            const userInfoContainer = document.getElementById('user-info-container');
            const userAvatar = document.getElementById('user-avatar');
            const logoutBtn = document.getElementById('logout-btn');
            const welcomeMessage = document.getElementById('welcome-message');
            
            const loginFormContainer = document.getElementById('login-form-container');
            const signupFormContainer = document.getElementById('signup-form-container');

            const forgotPasswordLink = document.getElementById('forgot-password-link');
            const createAccountLink = document.getElementById('create-account-link');
            const closeLoginBtn = document.getElementById('close-login-btn');
            const closeSignupBtn = document.getElementById('close-signup-btn');
            const closeAccountDetailsBtn = document.getElementById('close-account-details-btn');

            const loginFormContent = document.getElementById('login-form-content');
            const signupFormContent = document.getElementById('signup-form-content');
            
            const loginMessage = document.getElementById('login-message');
            const signupMessage = document.getElementById('signup-message');
            
            // Password toggle elements for the signup form
            const signupPasswordInput = document.getElementById('signup-password');
            const signupToggleYes = document.getElementById('signup-toggle-yes');
            const signupToggleNo = document.getElementById('signup-toggle-no');
            
            // New elements for the account details section
            const accountDetailsPopupContainer = document.getElementById('account-details-popup-container');
            const detailsList = document.getElementById('details-list');
            const accountButtonsContainer = document.getElementById('account-buttons-container');
            const toggleAccountDetailsBtn = document.getElementById('toggle-account-details-btn');
            
            // New toggle button for the auth UI
            const toggleAuthUIBtn = document.getElementById('toggle-auth-ui-btn');
            const mainUI = document.getElementById('main-ui');

            // Event listeners to toggle the popups
            toggleLoginBtn.addEventListener('click', () => {
                loginFormContainer.classList.add('active');
            });
            toggleSignupBtn.addEventListener('click', () => {
                signupFormContainer.classList.add('active');
            });
            
            toggleAccountDetailsBtn.addEventListener('click', () => {
                accountDetailsPopupContainer.classList.add('active');
            });

            // Event listeners to close the popups
            closeLoginBtn.addEventListener('click', () => {
                loginFormContainer.classList.remove('active');
            });
            closeSignupBtn.addEventListener('click', () => {
                signupFormContainer.classList.remove('active');
            });
            closeAccountDetailsBtn.addEventListener('click', () => {
                accountDetailsPopupContainer.classList.remove('active');
            });
            
            // New event listener for the "create new account" link
            createAccountLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginFormContainer.classList.remove('active');
                signupFormContainer.classList.add('active');
            });

            // Function to handle the password visibility toggle and update UI
            function handlePasswordToggle(input, yesBtn, noBtn, showPassword) {
                if (showPassword) {
                    input.type = 'text';
                    yesBtn.classList.add('selected');
                    noBtn.classList.remove('selected');
                } else {
                    input.type = 'password';
                    yesBtn.classList.remove('selected');
                    noBtn.classList.add('selected');
                }
            }

            // Add event listeners for the signup password toggle text
            signupToggleYes.addEventListener('click', () => {
                handlePasswordToggle(signupPasswordInput, signupToggleYes, signupToggleNo, true);
            });
            signupToggleNo.addEventListener('click', () => {
                handlePasswordToggle(signupPasswordInput, signupToggleYes, signupToggleNo, false);
            });

            // Handle the sign-up form submission
            signupFormContent.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get values from the input fields
                const name = document.getElementById('signup-name').value;
                const place = document.getElementById('signup-place').value;
                const birthday = document.getElementById('signup-birthday').value;
                const phone = document.getElementById('signup-phone').value;
                const username = document.getElementById('signup-username').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;

                // Check if a user with this username already exists
                const existingUser = localStorage.getItem(username);
                if (existingUser) {
                    signupMessage.textContent = '❌ Username already exists!';
                    signupMessage.classList.remove('success');
                    signupMessage.classList.add('error');
                    return;
                }

                // Store user data in a simple object, including the new phone field
                const userData = { email, password, name, place, birthday, phone };
                // Save the user data to localStorage with the username as the key
                localStorage.setItem(username, JSON.stringify(userData));
                
                signupMessage.textContent = '🎉 Sign up successful! You can now log in.';
                signupMessage.classList.remove('error');
                signupMessage.classList.add('success');
                
                // Clear the form fields after successful sign up
                document.getElementById('signup-name').value = '';
                document.getElementById('signup-place').value = '';
                document.getElementById('signup-birthday').value = '';
                document.getElementById('signup-phone').value = '';
                document.getElementById('signup-username').value = '';
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
                
                // Automatically hide the signup form and show the login form after a short delay
                setTimeout(() => {
                    signupFormContainer.classList.remove('active');
                    signupMessage.textContent = '';
                    // Open the login form
                    loginFormContainer.classList.add('active');
                    loginMessage.textContent = '🎉 Account created! Please log in.';
                    loginMessage.classList.remove('error');
                    loginMessage.classList.add('success');
                }, 2000);
            });

            // Handle the login form submission
            loginFormContent.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get values from the input fields
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                
                // Retrieve user data from localStorage
                const storedUser = localStorage.getItem(username);

                // Check if the username exists
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    // Check if the password matches
                    if (userData.password === password) {
                        loginMessage.textContent = '✅ Login successful!';
                        loginMessage.classList.remove('error');
                        loginMessage.classList.add('success');
                        
                        // Hide the login form after a successful login
                        setTimeout(() => {
                            loginFormContainer.classList.remove('active');
                            loginMessage.textContent = '';
                            document.getElementById('login-username').value = '';
                            document.getElementById('login-password').value = '';
                            
                            // Hide the main-buttons div
                            mainButtons.classList.add('hidden');
                        }, 1000);

                        // Show the user info, account details button, and log out button
                        userInfoContainer.classList.remove('hidden');
                        accountButtonsContainer.classList.remove('hidden');
                        welcomeMessage.classList.add('hidden');
                        
                        // Set the avatar to the first letter of the username
                        userAvatar.textContent = username.charAt(0).toUpperCase();

                        // Store the user data in a global-like variable to access later
                        window.currentUserData = userData;
                        window.currentUsername = username;

                    } else {
                        loginMessage.textContent = '❌ Incorrect password.';
                        loginMessage.classList.remove('success');
                        loginMessage.classList.add('error');
                    }
                } else {
                    loginMessage.textContent = '❌ Username not found.';
                    loginMessage.classList.remove('success');
                    loginMessage.classList.add('error');
                }
            });

            // Handle the "View Account Details" button click
            toggleAccountDetailsBtn.addEventListener('click', () => {
                const userData = window.currentUserData;
                const username = window.currentUsername;
                
                if (userData) {
                    detailsList.innerHTML = `
                        <li><strong>Hello, ${userData.name}!</strong></li>
                        <li><strong>Place:</strong> ${userData.place}</li>
                        <li><strong>Birthday:</strong> ${userData.birthday}</li>
                        <li><strong>Phone:</strong> ${userData.phone}</li>
                        <li><strong>Username:</strong> ${username}</li>
                        <li><strong>Email:</strong> ${userData.email}</li>
                    `;
                    accountDetailsPopupContainer.classList.add('active');
                }
            });

            // Handle the "Forgot Password" link click
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                
                if (localStorage.getItem(username)) {
                    loginMessage.textContent = `✅ Password reset email sent to the email address associated with ${username}!`;
                    loginMessage.classList.remove('error');
                    loginMessage.classList.add('success');
                } else {
                    loginMessage.textContent = '❌ Username not found.';
                    loginMessage.classList.remove('success');
                    loginMessage.classList.add('error');
                }
            });

            // Handle the "Log Out" button click
            logoutBtn.addEventListener('click', () => {
                // Hide user info, account details button, and any open popups
                userInfoContainer.classList.add('hidden');
                accountButtonsContainer.classList.add('hidden');
                accountDetailsPopupContainer.classList.remove('active');
                
                // Show the main-buttons div to allow new logins
                mainButtons.classList.remove('hidden');
                
                // Clear welcome message and reset display
                welcomeMessage.textContent = '';
                welcomeMessage.classList.remove('success', 'error');
                welcomeMessage.classList.remove('hidden');

                // Reset the avatar display
                userAvatar.textContent = '';
                userAvatar.style.backgroundImage = '';
                userAvatar.style.backgroundColor = '#2c68a3';

                // Clear stored user data
                window.currentUserData = null;
                window.currentUsername = null;
                
                // On mobile, hide the main auth UI
                if (window.innerWidth <= 768) {
                    mainUI.classList.add('hidden');
                }
            });

            // Add the new event listener for the main auth UI toggle button
            toggleAuthUIBtn.addEventListener('click', () => {
                mainUI.classList.toggle('hidden');
            });
            
            // Check initial state on load for mobile view
            if (window.innerWidth <= 768) {
                mainUI.classList.add('hidden');
            }
        });
