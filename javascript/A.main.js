document.addEventListener('DOMContentLoaded', () => {
            // الحصول على مراجع لجميع العناصر الضرورية
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
            
            // عناصر تبديل رؤية كلمة المرور لنموذج التسجيل
            const signupPasswordInput = document.getElementById('signup-password');
            const signupToggleYes = document.getElementById('signup-toggle-yes');
            const signupToggleNo = document.getElementById('signup-toggle-no');
            
            // عناصر جديدة لقسم تفاصيل الحساب
            const accountDetailsPopupContainer = document.getElementById('account-details-popup-container');
            const detailsList = document.getElementById('details-list');
            const accountButtonsContainer = document.getElementById('account-buttons-container');
            const toggleAccountDetailsBtn = document.getElementById('toggle-account-details-btn');
            
            // زر تبديل جديد لواجهة المستخدم الخاصة بالمصادقة
            const toggleAuthUIBtn = document.getElementById('toggle-auth-ui-btn');
            const mainUI = document.getElementById('main-ui');

            // مستمعي الأحداث لتبديل النوافذ المنبثقة
            toggleLoginBtn.addEventListener('click', () => {
                loginFormContainer.classList.add('active');
            });
            toggleSignupBtn.addEventListener('click', () => {
                signupFormContainer.classList.add('active');
            });
            
            toggleAccountDetailsBtn.addEventListener('click', () => {
                accountDetailsPopupContainer.classList.add('active');
            });

            // مستمعي الأحداث لإغلاق النوافذ المنبثقة
            closeLoginBtn.addEventListener('click', () => {
                loginFormContainer.classList.remove('active');
            });
            closeSignupBtn.addEventListener('click', () => {
                signupFormContainer.classList.remove('active');
            });
            closeAccountDetailsBtn.addEventListener('click', () => {
                accountDetailsPopupContainer.classList.remove('active');
            });
            
            // مستمع أحداث جديد لرابط "إنشاء حساب جديد"
            createAccountLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginFormContainer.classList.remove('active');
                signupFormContainer.classList.add('active');
            });

            // دالة للتعامل مع تبديل رؤية كلمة المرور وتحديث واجهة المستخدم
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

            // إضافة مستمعي الأحداث لتبديل نص كلمة مرور التسجيل
            signupToggleYes.addEventListener('click', () => {
                handlePasswordToggle(signupPasswordInput, signupToggleYes, signupToggleNo, true);
            });
            signupToggleNo.addEventListener('click', () => {
                handlePasswordToggle(signupPasswordInput, signupToggleYes, signupToggleNo, false);
            });

            // التعامل مع إرسال نموذج التسجيل
            signupFormContent.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // الحصول على القيم من حقول الإدخال
                const name = document.getElementById('signup-name').value;
                const place = document.getElementById('signup-place').value;
                const birthday = document.getElementById('signup-birthday').value;
                const phone = document.getElementById('signup-phone').value;
                const username = document.getElementById('signup-username').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;

                // التحقق مما إذا كان هناك مستخدم بهذا الاسم موجود بالفعل
                const existingUser = localStorage.getItem(username);
                if (existingUser) {
                    signupMessage.textContent = '❌ اسم المستخدم موجود بالفعل!';
                    signupMessage.classList.remove('success');
                    signupMessage.classList.add('error');
                    return;
                }

                // تخزين بيانات المستخدم في كائن بسيط، بما في ذلك حقل الهاتف الجديد
                const userData = { email, password, name, place, birthday, phone };
                // حفظ بيانات المستخدم في localStorage باستخدام اسم المستخدم كمفتاح
                localStorage.setItem(username, JSON.stringify(userData));
                
                signupMessage.textContent = '🎉 تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.';
                signupMessage.classList.remove('error');
                signupMessage.classList.add('success');
                
                // مسح حقول النموذج بعد التسجيل الناجح
                document.getElementById('signup-name').value = '';
                document.getElementById('signup-place').value = '';
                document.getElementById('signup-birthday').value = '';
                document.getElementById('signup-phone').value = '';
                document.getElementById('signup-username').value = '';
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
                
                // إخفاء نموذج التسجيل تلقائياً وعرض نموذج تسجيل الدخول بعد تأخير قصير
                setTimeout(() => {
                    signupFormContainer.classList.remove('active');
                    signupMessage.textContent = '';
                    // فتح نموذج تسجيل الدخول
                    loginFormContainer.classList.add('active');
                    loginMessage.textContent = '🎉 تم إنشاء الحساب! يرجى تسجيل الدخول.';
                    loginMessage.classList.remove('error');
                    loginMessage.classList.add('success');
                }, 2000);
            });

            // التعامل مع إرسال نموذج تسجيل الدخول
            loginFormContent.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // الحصول على القيم من حقول الإدخال
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                
                // استرجاع بيانات المستخدم من localStorage
                const storedUser = localStorage.getItem(username);

                // التحقق مما إذا كان اسم المستخدم موجودًا
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    // التحقق مما إذا كانت كلمة المرور متطابقة
                    if (userData.password === password) {
                        loginMessage.textContent = '✅ تم تسجيل الدخول بنجاح!';
                        loginMessage.classList.remove('error');
                        loginMessage.classList.add('success');
                        
                        // إخفاء نموذج تسجيل الدخول بعد تسجيل الدخول الناجح
                        setTimeout(() => {
                            loginFormContainer.classList.remove('active');
                            loginMessage.textContent = '';
                            document.getElementById('login-username').value = '';
                            document.getElementById('login-password').value = '';
                            
                            // إخفاء div الأزرار الرئيسية
                            mainButtons.classList.add('hidden');
                        }, 1000);

                        // إظهار معلومات المستخدم، زر تفاصيل الحساب، وزر تسجيل الخروج
                        userInfoContainer.classList.remove('hidden');
                        accountButtonsContainer.classList.remove('hidden');
                        welcomeMessage.classList.add('hidden');
                        
                        // تعيين الصورة الرمزية إلى الحرف الأول من اسم المستخدم
                        userAvatar.textContent = username.charAt(0).toUpperCase();

                        // تخزين بيانات المستخدم في متغير شبيه بالمتغيرات العامة للوصول إليها لاحقًا
                        window.currentUserData = userData;
                        window.currentUsername = username;

                    } else {
                        loginMessage.textContent = '❌ كلمة المرور غير صحيحة.';
                        loginMessage.classList.remove('success');
                        loginMessage.classList.add('error');
                    }
                } else {
                    loginMessage.textContent = '❌ اسم المستخدم غير موجود.';
                    loginMessage.classList.remove('success');
                    loginMessage.classList.add('error');
                }
            });

            // التعامل مع النقر على زر "عرض تفاصيل الحساب"
            toggleAccountDetailsBtn.addEventListener('click', () => {
                const userData = window.currentUserData;
                const username = window.currentUsername;
                
                if (userData) {
                    detailsList.innerHTML = `
                        <li><strong>مرحباً، ${userData.name}!</strong></li>
                        <li><strong>المكان:</strong> ${userData.place}</li>
                        <li><strong>تاريخ الميلاد:</strong> ${userData.birthday}</li>
                        <li><strong>الهاتف:</strong> ${userData.phone}</li>
                        <li><strong>اسم المستخدم:</strong> ${username}</li>
                        <li><strong>البريد الإلكتروني:</strong> ${userData.email}</li>
                    `;
                    accountDetailsPopupContainer.classList.add('active');
                }
            });

            // التعامل مع النقر على رابط "نسيت كلمة المرور"
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                
                if (localStorage.getItem(username)) {
                    loginMessage.textContent = `✅ تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور إلى البريد الإلكتروني المرتبط بـ ${username}!`;
                    loginMessage.classList.remove('error');
                    loginMessage.classList.add('success');
                } else {
                    loginMessage.textContent = '❌ اسم المستخدم غير موجود.';
                    loginMessage.classList.remove('success');
                    loginMessage.classList.add('error');
                }
            });

            // التعامل مع النقر على زر "تسجيل الخروج"
            logoutBtn.addEventListener('click', () => {
                // إخفاء معلومات المستخدم، زر تفاصيل الحساب، وأي نوافذ منبثقة مفتوحة
                userInfoContainer.classList.add('hidden');
                accountButtonsContainer.classList.add('hidden');
                accountDetailsPopupContainer.classList.remove('active');
                
                // إظهار div الأزرار الرئيسية للسماح بعمليات تسجيل دخول جديدة
                mainButtons.classList.remove('hidden');
                
                // مسح رسالة الترحيب وإعادة تعيين العرض
                welcomeMessage.textContent = '';
                welcomeMessage.classList.remove('success', 'error');
                welcomeMessage.classList.remove('hidden');

                // إعادة تعيين عرض الصورة الرمزية
                userAvatar.textContent = '';
                userAvatar.style.backgroundImage = '';
                userAvatar.style.backgroundColor = '#2c68a3';

                // مسح بيانات المستخدم المخزنة
                window.currentUserData = null;
                window.currentUsername = null;
                
                // على الهاتف المحمول، إخفاء واجهة المستخدم الرئيسية للمصادقة
                if (window.innerWidth <= 768) {
                    mainUI.classList.add('hidden');
                }
            });

            // إضافة مستمع الأحداث الجديد لزر تبديل واجهة المستخدم الرئيسية للمصادقة
            toggleAuthUIBtn.addEventListener('click', () => {
                mainUI.classList.toggle('hidden');
            });
            
            // التحقق من الحالة الأولية عند التحميل لعرض الهاتف المحمول
            if (window.innerWidth <= 768) {
                mainUI.classList.add('hidden');
            }
        });

