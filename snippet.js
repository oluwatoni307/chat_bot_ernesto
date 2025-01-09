var Chatbot = (function() {
    var chatbotScript = document.createElement('script');
    var chatbotStyles = document.createElement('link');
    
    return {
        init: function() {
            var currentScript = document.currentScript;
            var config = currentScript.getAttribute('data-config');
            config = config ? JSON.parse(config) : {};
            
            // Load main chatbot script
            chatbotScript.src = 'chat_bot_bundle.js';
            chatbotScript.async = true;
            chatbotScript.onload = function() {
                window.initializeChatbot(config);
            };
            
            // Load chatbot styles
            chatbotStyles.rel = 'stylesheet';
            chatbotStyles.href = 'https://chat-bot-ernesto.vercel.app/chatbot.css';
            
            // Append to document
            document.head.appendChild(chatbotStyles);
            document.body.appendChild(chatbotScript);
        }
    };
})();

// Initialize immediately
Chatbot.init();