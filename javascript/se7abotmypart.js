 // استيراد (Import) مكتبات Firebase الأساسية.
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, collection, onSnapshot, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        
        // جلب عناصر الـ HTML بناءً على الـ ID الخاص بها.
        const chatContainer = document.getElementById('chat-container');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const loadingSpinner = document.getElementById('loading-spinner');

        // تعريف المتغيرات العامة اللي هنستخدمها في التطبيق.
        let db;
        let auth;
        let userId;
        let isAuthReady = false; // متغير للتأكد من أن تسجيل الدخول تم.
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        // دالة لتهيئة (initialize) خدمات Firebase (Auth و Firestore).
        const initializeFirebase = async () => {
            try {
                // قراءة إعدادات Firebase من البيئة.
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
                const app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
                
                // الاستماع لتغييرات حالة تسجيل الدخول.
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        userId = user.uid;
                    } else {
                        // لو المستخدم مش مسجل دخول، يتم تسجيل دخوله بشكل مجهول.
                        await signInAnonymously(auth);
                    }
                    isAuthReady = true;
                    // بعد تسجيل الدخول، نبدأ في الاستماع لرسائل الشات.
                    listenForMessages();
                });
            } catch (error) {
                console.error("Firebase initialization error:", error);
            }
        };

        // دالة للاستماع لرسائل جديدة في قاعدة بيانات Firestore.
        const listenForMessages = () => {
            // نتأكد أن Firebase جاهز والمستخدم مسجل دخول.
            if (!isAuthReady || !db || !userId) return;

            // تحديد المسار (path) اللي هنخزن فيه الرسائل في قاعدة البيانات.
            const messagesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'messages');
            // عمل query لترتيب الرسائل حسب الوقت (timestamp)
            const q = query(messagesCollectionRef, orderBy('timestamp'));

            // onSnapshot بتستمع للتغييرات في الـ query بشكل مباشر وفي الوقت الفعلي (real-time).
            onSnapshot(q, (querySnapshot) => {
                const fetchedMessages = [];
                // إضافة كل رسالة من قاعدة البيانات لمصفوفة.
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // بنعمل parse للـ content لو كان JSON string.
                    try {
                        data.content = JSON.parse(data.content);
                    } catch (e) {
                        // لو مش JSON string, بنسيبه زي ما هو.
                    }
                    fetchedMessages.push(data);
                });
                // عرض الرسائل على الشاشة.
                renderMessages(fetchedMessages);
            });
        };

        // دالة لعرض الرسائل في الـ HTML.
        const renderMessages = (messages) => {
            chatContainer.innerHTML = ''; // مسح الرسائل القديمة.
            messages.forEach((msg) => {
                // إنشاء عنصر div لكل رسالة.
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${msg.role}`;

                // إضافة أيقونة للمستخدم أو للذكاء الاصطناعي.
                const iconDiv = document.createElement('div');
                iconDiv.className = 'flex-shrink-0';
                if (msg.role === 'user') {
                    iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                } else {
                    iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path d="M12 12L12 16"/><path d="M12 8L12 8"/></svg>';
                }
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'flex-1 text-black';
                // بنتحقق لو الـ content عبارة عن JSON عشان نعرض شريط الحالة.
                if (msg.role === 'ai' && msg.content.response) {
                    const riskLevel = msg.content.response.risk_level;
                    const mainContent = msg.content.response.content;

                    // هنا بنضيف HTML الجديد لشريط الخطورة.
                    contentDiv.innerHTML = `
                        <p class="font-semibold capitalize">AI</p>
                        <p>${mainContent}</p>
                        <div class="danger-bar-container">
                            <div id="bar-${msg.timestamp}" class="danger-bar-fill"></div>
                        </div>
                        <div class="danger-label">Risk Level: ${riskLevel}%</div>
                    `;

                    // بنستخدم setTimeout عشان الـ animation يشتغل بعد ما العنصر يظهر في الصفحة.
                    setTimeout(() => {
                        const barElement = document.getElementById(`bar-${msg.timestamp}`);
                        if (barElement) {
                            barElement.style.width = `${riskLevel}%`;
                        }
                    }, 10);
                } else {
                    contentDiv.innerHTML = `<p class="font-semibold capitalize">${msg.role}</p><p>${msg.content}</p>`;
                }

                // إضافة الأيقونة والمحتوى إلى الـ div الأساسي للرسالة.
                messageDiv.appendChild(iconDiv);
                messageDiv.appendChild(contentDiv);
                chatContainer.appendChild(messageDiv);
            });
            // تحريك الشاشة لآخر رسالة.
            scrollToBottom();
        };

        // دالة لتحريك شاشة الشات لآخر رسالة في القائمة.
        const scrollToBottom = () => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };

        // متغير لمنع إرسال رسائل متعددة في نفس الوقت.
        let isSending = false;

        // دالة لمحاولة عمل fetch (طلب) عدة مرات إذا فشل.
        const fetchWithRetry = async (url, options, maxRetries = 5, delay = 1000) => {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    console.error(`Attempt ${i + 1} failed:`, error);
                    if (i < maxRetries - 1) {
                        await new Promise(res => setTimeout(res, delay));
                        delay *= 2;
                    } else {
                        throw error;
                    }
                }
            }
        };

        // الدالة الرئيسية لإرسال الرسائل إلى الذكاء الاصطناعي.
        const sendMessage = async (input) => {
            // منع الإرسال لو المدخل فارغ أو لو فيه رسالة بتتبعت بالفعل.
            if (!input || isSending) return;

            isSending = true;
            // تعطيل خانة الإدخال وزرار الإرسال.
            messageInput.disabled = true;
            sendButton.disabled = true;
            // إظهار أيقونة التحميل.
            loadingSpinner.classList.remove('hidden');

            const userMessage = {
                role: 'user',
                content: input,
                timestamp: Date.now()
            };
            
            // تخزين رسالة المستخدم في قاعدة بيانات Firestore.
            if (db && userId) {
                const userDocRef = doc(collection(db, 'artifacts', appId, 'users', userId, 'messages'));
                await setDoc(userDocRef, userMessage);
            }

            try {
                // جلب كل سجل المحادثات لإرساله للنموذج.
                const messagesSnapshot = await getDocs(collection(db, 'artifacts', appId, 'users', userId, 'messages'));
                const chatHistory = messagesSnapshot.docs.map(doc => doc.data()).sort((a,b) => a.timestamp - b.timestamp);
                
                // تعريف مهمة الذكاء الاصطناعي (system prompt).
                const systemPrompt = "You are a friendly, helpful AI assistant specializing in general health and wellness for a school project. You are not a medical professional. Your primary goal is to provide general, accessible information and to demonstrate a a dynamic risk assessment. When asked about a health condition, provide a response and also a risk level as a number from 0 to 100. The risk level should be higher for conditions that are typically more serious or urgent. Respond with a JSON object. For example: { \"response\": { \"risk_level\": 25, \"content\": \"...your response text here...\" } }";
                
                // بناء الـ payload لإرساله للـ API.
                const payload = {
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        ...chatHistory.map(msg => ({ role: msg.role === 'ai' ? 'model' : 'user', parts: [{ text: msg.content }] }))
                    ],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "OBJECT",
                            properties: {
                                "response": {
                                    type: "OBJECT",
                                    properties: {
                                        "risk_level": { type: "NUMBER" },
                                        "content": { type: "STRING" }
                                    }
                                }
                            }
                        }
                    }
                };

                const apiKey = ""; // API Key.
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                // عمل طلب للـ API مع إمكانية المحاولة مرة أخرى.
                const result = await fetchWithRetry(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                // معالجة الرد من الـ API.
                let aiResponseContent = 'Sorry, I could not generate a response. Please try again.';
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    aiResponseContent = result.candidates[0].content.parts[0].text;
                }

                // بناء رسالة الذكاء الاصطناعي.
                const aiMessage = {
                    role: 'ai',
                    content: aiResponseContent,
                    timestamp: Date.now()
                };

                // تخزين رسالة الذكاء الاصطناعي في قاعدة البيانات.
                if (db && userId) {
                    const aiDocRef = doc(collection(db, 'artifacts', appId, 'users', userId, 'messages'));
                    await setDoc(aiDocRef, aiMessage);
                }
                
            } catch (error) {
                console.error('Final error after all retries:', error);
                const errorMessage = {
                    role: 'ai',
                    content: JSON.stringify({
                        response: {
                            risk_level: 25,
                            content: 'Sorry, there was an error connecting to the AI. Please try again later.'
                        }
                    }),
                    timestamp: Date.now()
                };
                if (db && userId) {
                    const errorDocRef = doc(collection(db, 'artifacts', appId, 'users', userId, 'messages'));
                    await setDoc(errorDocRef, errorMessage);
                }
            } finally {
                // إعادة تفعيل العناصر وإخفاء أيقونة التحميل.
                isSending = false;
                messageInput.disabled = false;
                sendButton.disabled = false;
                loadingSpinner.classList.add('hidden');
            }
        };

        // إضافة مستمعي الأحداث (event listeners) لزرار الإرسال وخانة الكتابة.
        sendButton.addEventListener('click', () => sendMessage(messageInput.value));
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendMessage(messageInput.value);
            }
        });

        // تشغيل دالة تهيئة Firebase أول ما الصفحة تحمل.
        document.addEventListener('DOMContentLoaded', initializeFirebase);