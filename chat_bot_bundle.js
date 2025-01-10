(function () {
  window.initializeChatbot = function (options = {}) {
    // Simple configuration options
    const config = {
      name: options.name || "Chatbot",
      description: options.description || "I am here to help you.",

      firstGreeting:
        options.firstGreeting || "Hello! 👋 I'm your AI assistant.",
      secondGreeting:
        options.secondGreeting || "I'm here to help answer your questions.",
      thirdGreeting: options.thirdGreeting || "What can I help you with today?",
      headerColor: options.headerColor || "#696969",
      userMessageColor: options.userMessageColor || "#D3D3D3 ", // Default light gray for user messages
      botMessageColor: options.botMessageColor || "#d1e7dd", // Default light green for bot messages
      code: options.promptCode || "test",
      bottextcolor: options.bottextcolor || "#000000",
      usertextcolor: options.usertextcolor || "#000000",
      width: options.width || "35%",
      height: options.height || "85%",
    };

    async function displayGreetings() {
      const greetings = [
        config.firstGreeting,
        config.secondGreeting,
        config.thirdGreeting
      ];
      for (const message of greetings) {
        // console.log("Sending greeting:", message);
        showTypingIndicator();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        hideTypingIndicator();
        addMessage(message, "bot");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    const chatbotHTML = `
            <div class="logo-container">
                <img src="https://chat-bot-ernesto.vercel.app/logo.jpg" alt="Logo" id="chatbotLogo" class="logo">
            </div>
            <div class="chat-container hidden" id="chatContainer" style="width: ${config.width}; height: ${config.height}">
                <div class="chat-header" style="background-color: ${config.headerColor}">
                    <div class="profile">
                        <div class="profile-image">AI</div>
                        <span style="font-size: 18px">${config.name}</span>
                        
                    </div>
                    <div class = "action">
                     <div class="minimize-btn">
              <i class="fas fa-minus"></i>
            </div>
                    <div class="close-btn">
                        <i class="fas fa-times"></i>
                    </div>
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

                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message..." aria-label="Message input">
                    <button type="submit" aria-label="Send message" style="background-color: ${config.headerColor}">Send</button>
                </div>
            </div>
        `;

    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot";
    chatbotContainer.style.visibility = "hidden"; // Initially hidden

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
    link.onload = () => {
      chatbotContainer.style.visibility = "visible"; // Show when ready
    };
    document.head.appendChild(link);

    const chatContainer = chatbotContainer.querySelector("#chatContainer");
    const chatMessages = chatbotContainer.querySelector("#chatMessages");
    const typingIndicator = chatbotContainer.querySelector(".typing-indicator");
    const input = chatbotContainer.querySelector(".chat-input input");
    const sendButton = chatbotContainer.querySelector(".chat-input button");
    const chatbotLogo = chatbotContainer.querySelector("#chatbotLogo");
    const closeChat = chatbotContainer.querySelector(".close-btn");
    const minimizeChat = chatbotContainer.querySelector(".minimize-btn");

    function addMessage(message, type) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", type);

      if (type === "bot") {
        messageElement.innerHTML = message;
      } else {
        messageElement.textContent = message;
      }

      // Apply colors based on message type
      if (type === "user") {
        messageElement.style.backgroundColor = config.userMessageColor;
        messageElement.style.color = config.usertextcolor;
      } else if (type === "bot") {
        messageElement.style.backgroundColor = config.botMessageColor;
        messageElement.style.color = config.bottextcolor;
      }

      typingIndicator.classList.remove("show");
      chatMessages.insertBefore(messageElement, typingIndicator);

      // Trigger reflow for animation
      void messageElement.offsetWidth;
      messageElement.classList.add("animate");

      // Scroll to the bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      typingIndicator.classList.add("show");
    }
    function hideTypingIndicator() {
      typingIndicator.classList.remove("show");
    }
    function getLastFiveMessages() {
      const allMessages = Array.from(chatMessages.querySelectorAll(".message"));
      const lastFiveMessages = allMessages.slice(-6).map((message) => ({
        type: message.classList.contains("user") ? "user" : "bot",
        content: message.textContent.trim(),
      }));
      return JSON.stringify(lastFiveMessages);
    }
    function clearChatMessages() {
      // Preserve customer-info and typing-indicator
      const customerInfo = chatMessages.querySelector(".customer-info");
      const typingIndicator = chatMessages.querySelector(".typing-indicator");
    
      // Clear all messages
      while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
      }
    
      // Reappend preserved elements in correct order
      if (customerInfo) {
        chatMessages.appendChild(customerInfo);
      }
      if (typingIndicator) {
        chatMessages.appendChild(typingIndicator);
      }
    
    
      // Scroll to the top
      chatMessages.scrollTop = 0;
    }
    function sendMessage() {
      const message = input.value.trim();
      if (message) {
        addMessage(message, "user");
        input.value = "";
        let full_message = getLastFiveMessages();

        // Show the bot typing indicator
        showTypingIndicator();

        // Create URL with query parameters
        const baseUrl =
          "https://www.socialworkmagic.com/_functions/processInput";
        const url = `${baseUrl}?userInput=${encodeURIComponent(
          full_message
        )}&promptCode=${encodeURIComponent(config.code)}`;

        // Send GET request with URL parameters
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Server responded with status ${response.status}`
              );
            }
            return response.json();
          })
          .then((data) => {
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
      if (!chatContainer.classList.contains("hidden")) {
        displayGreetings();
      }
    });

    closeChat.addEventListener("click", () => {
      clearChatMessages();
      chatContainer.classList.add("hidden");
    });
    minimizeChat.addEventListener("click", () => {
      chatContainer.classList.add("hidden");
    });
  };
})();
