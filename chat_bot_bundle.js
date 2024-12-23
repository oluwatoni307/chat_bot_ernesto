(function () {
  window.initializeChatbot = function (options = {}) {

        // Simple configuration options
        const config = {
          name: options.name || 'Chatbot',
          description: options.description || 'I am here to help you.',
          initialMessage: options.initialMessage || 'Hello! How can I help you today?',
          headerColor: options.headerColor || '#007bff' // Default blue color if none provided
        };
    const chatbotHTML = `
            <div class="logo-container">
                <img src="https://chat-bot-ernesto.vercel.app/ernest_logo.jpg" alt="Logo" id="chatbotLogo" class="logo">
            </div>
            <div class="chat-container hidden" id="chatContainer">
                <div class="chat-header" style="background-color: ${config.headerColor}">
                    <div class="profile">
                        <div class="profile-image">AI</div>
                        <span>${config.name}</span>
                        
                    </div>
                    <div class="close-btn">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                <div class="customer-info">
                <div class="profile-image">AI</div>

    <span class="customer-name">${config.name}</span> <!-- Name -->
    <p class="customer-description">
     ${config.description}
    </p> <!-- Description -->
</div>

                    <div class="message bot animate">
                        Hello! How can I help you today?
                    </div>
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message..." aria-label="Message input">
                    <button type="submit" aria-label="Send message">Send</button>
                </div>
            </div>
        `;

    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot";
    chatbotContainer.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotContainer);

    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const chatbotCSS = "https://chat-bot-ernesto.vercel.app/chatbot.css";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chatbotCSS;
    document.head.appendChild(link);

    const chatContainer = chatbotContainer.querySelector("#chatContainer");
    const chatMessages = chatbotContainer.querySelector("#chatMessages");
    const typingIndicator = chatbotContainer.querySelector(".typing-indicator");
    const input = chatbotContainer.querySelector(".chat-input input");
    const sendButton = chatbotContainer.querySelector(".chat-input button");
    const chatbotLogo = chatbotContainer.querySelector("#chatbotLogo");
    const closeChat = chatbotContainer.querySelector(".close-btn");

    function addMessage(message, type) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", type);
      messageElement.textContent = message;
      typingIndicator.classList.remove("show");
      chatMessages.insertBefore(messageElement, typingIndicator);
      void messageElement.offsetWidth; // Trigger reflow for animation
      messageElement.classList.add("animate");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      typingIndicator.classList.add("show");
    }
    function hideTypingIndicator() {
    typingIndicator.classList.remove("show");
}

function sendMessage() {
        const message = input.value.trim();
        if (message) {
            addMessage(message, "user");
            input.value = "";
            const data = {
                userInput: message,
                promptCode: "test",
            };
            
            // Show the bot typing indicator
            showTypingIndicator();
            
            // Send message to the Wix endpoint
            fetch("https://www.socialworkmagic.com/_functions/processInput", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Hide the typing indicator and add the bot's response
                hideTypingIndicator();
                if (data && data.data) {
                    addMessage(data.data, "bot");
                } else {
                    addMessage("Sorry, I couldn't understand that.", "bot");
                }
            })
            .catch((error) => {
                hideTypingIndicator();
                addMessage("Error: Unable to process your message.", "bot");
                console.error("Error:", error);
            });
        }
    }


    sendButton.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    chatbotLogo.addEventListener("click", () => {
      chatContainer.classList.toggle("hidden");
    });

    closeChat.addEventListener("click", () => {
      chatContainer.classList.add("hidden");
    });
  };
})();
