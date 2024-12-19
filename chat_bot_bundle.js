(function () {
    // Load the chatbot's HTML, CSS, and JS files dynamically
    const loadScript = (url, callback) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    };

    // Load CSS
    const loadCSS = (url) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    };

    // Load the chatbot HTML into the Shadow DOM
    const loadChatbotHTML = (url) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Create a div container for Shadow DOM
                const shadowHost = document.createElement('div');
                shadowHost.id = 'chatbot-widget';
                document.body.appendChild(shadowHost);

                // Attach the Shadow DOM
                const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
                shadowRoot.innerHTML = html;

                // Initialize the chatbot after loading HTML
                initializeChatbot(shadowRoot);
            })
            .catch(error => console.error('Error loading HTML:', error));
    };

    // Initialize the chatbot
    const initializeChatbot = (shadowRoot) => {
        loadCSS('https://yourcdn.com/chatbot.css'); // External CSS for the chatbot
        loadScript('https://yourcdn.com/chatbot.js', () => {
            // Chatbot JavaScript functionality will be loaded here
            // Initialize the chatbot (this will call the function from chatbot.js)
            if (typeof startChatbot === 'function') {
                startChatbot(shadowRoot);
            }
        });
    };

    // Load the chatbot HTML
    loadChatbotHTML('https://yourcdn.com/chatbot.html'); // Path to your HTML
})();
