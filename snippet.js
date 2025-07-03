var Chatbot = (function() {
    var chatbotScript = document.createElement('script');
    var tailwindStyles = document.createElement('link');
    
    return {
        init: function() {
            var currentScript = document.currentScript;
            var config = currentScript.getAttribute('data-config');
            config = config ? JSON.parse(config) : {};
            
            // Load Tailwind CSS first
            tailwindStyles.rel = 'stylesheet';
            tailwindStyles.href = 'https://cdn.tailwindcss.com';
            tailwindStyles.onload = function() {
                console.log("Tailwind CSS loaded successfully!");
                
                // Load main chatbot script after Tailwind is ready
                chatbotScript.src = 'https://chat-bot-ernesto.vercel.app/chat_bot_bundle.js';
                chatbotScript.async = true;
                chatbotScript.onload = function() {
                    window.initializeChatbot(config);
                };
                document.body.appendChild(chatbotScript);
            };
            
            tailwindStyles.onerror = function() {
                console.error("Failed to load Tailwind CSS, loading chatbot anyway...");
                // Still load the chatbot even if Tailwind fails
                chatbotScript.src = 'https://chat-bot-ernesto.vercel.app/chat_bot_bundle.js';
                chatbotScript.async = true;
                chatbotScript.onload = function() {
                    window.initializeChatbot(config);
                };
                document.body.appendChild(chatbotScript);
            };
            
            // Append Tailwind to document head
            document.head.appendChild(tailwindStyles);
        }
    };
})();

// Initialize immediately
Chatbot.init();
