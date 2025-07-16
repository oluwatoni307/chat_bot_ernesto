(function () {
  window.initializeChatbot = function (options = {}) {
    // Simple configuration options
    const config = {
      name: options.name || "Chatbot",
      description: options.description || "I am here to help you.",
      firstGreeting: options.firstGreeting || "Hello! 👋 I'm your AI assistant.",
      secondGreeting: options.secondGreeting || "I'm here to help answer your questions.",
      thirdGreeting: options.thirdGreeting || "What can I help you with today?",
      headerColor: options.headerColor || "#696969",
      userMessageColor: options.userMessageColor || "#D3D3D3", // Default light gray for user messages
      botMessageColor: options.botMessageColor || "#d1e7dd", // Default light green for bot messages
      code: options.promptCode || "test",
      bottextcolor: options.bottextcolor || "#000000",
      usertextcolor: options.usertextcolor || "#000000",
      width: options.width || "35%",
      height: options.height || "85%",
    };
    let wasMinimized = false;
    let greet = false;
    let conversationHistory = ""; // Store conversation history as string

    async function displayGreetings() {
      const greetings = [config.firstGreeting, config.secondGreeting, config.thirdGreeting];
      for (const message of greetings) {
        showTypingIndicator();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        hideTypingIndicator();
        addMessage(message, "bot");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      greet = true;
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
              <div class="action">
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
                  <span class="customer-name">${config.name}</span>
                  <p class="customer-description">${config.description}</p>
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
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
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
        // Handle HTML content with Tailwind classes for bot messages
        if (greet === false) {
          // For greeting messages, use plain text
          messageElement.textContent = message;
        } else {
          // For API responses, insert HTML directly (assumes HTML with Tailwind classes)
          try {
            messageElement.innerHTML = message;
          } catch (error) {
            console.warn("HTML parsing failed:", error);
            messageElement.textContent = message;
          }
        }
      } else {
        // User messages remain as plain text
        messageElement.textContent = message;
      }

      // Apply colors based on message type with !important to override external themes
      if (type === "user") {
        messageElement.setAttribute(
          "style",
          `background-color: ${config.userMessageColor} !important; color: ${config.usertextcolor} !important;`
        );
      } else if (type === "bot") {
        messageElement.setAttribute(
          "style",
          `background-color: ${config.botMessageColor} !important; color: ${config.bottextcolor} !important;`
        );
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
    
    function clearChatMessages() {
      const customerInfo = chatMessages.querySelector(".customer-info");
      const typingIndicator = chatMessages.querySelector(".typing-indicator");
      while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
      }
      if (customerInfo) chatMessages.appendChild(customerInfo);
      if (typingIndicator) chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = 0;
      // Clear the conversation history when chat is cleared
      conversationHistory = "";
    }
    
    function sendMessage() {
      const message = input.value.trim();
      if (message) {
        addMessage(message, "user");
        input.value = "";
        showTypingIndicator();

        const baseUrl = "https://www.socialworkmagic.com/_functions/processInput";
        const url = `${baseUrl}?userInput=${encodeURIComponent(message)}&history=${encodeURIComponent(conversationHistory)}&promptCode=${encodeURIComponent(config.code)}`;

        fetch(url)
          .then((response) => {
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
            return response.json();
          })
          .then((data) => {
            hideTypingIndicator();
            if (data && data.data) {
              // Expecting structured response: { updated_history: "...", response: "..." }
              try {
                const parsedData = JSON.parse(data.data);
                
                // Update the conversation history with the backend's managed version
                conversationHistory = parsedData.updated_history || "";
                
                // Display the response
                addMessage(parsedData.response || "Sorry, I couldn't understand that.", "bot");
              } catch (error) {
                console.warn("Failed to parse structured response:", error);
                // Fallback to treating data.data as plain response
                addMessage(data.data, "bot");
              }
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
      if (e.key === "Enter") sendMessage();
    });

    chatbotLogo.addEventListener("click", () => {
      chatContainer.classList.toggle("hidden");
      if (!chatContainer.classList.contains("hidden") && !wasMinimized) {
        displayGreetings();
      }
    });

    closeChat.addEventListener("click", () => {
      wasMinimized = false;
      clearChatMessages();
      greet = false;
      chatContainer.classList.add("hidden");
    });
    minimizeChat.addEventListener("click", () => {
      wasMinimized = true;
      chatContainer.classList.add("hidden");
    });
  };
})();
