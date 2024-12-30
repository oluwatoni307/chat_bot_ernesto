(function () {
  window.initializeChatbot = function (options = {}) {
    // Simple configuration options
    const config = {
      name: options.name || "Chatbot",
      description: options.description || "I am here to help you.",
      initialMessage: options.initialMessage || "Hello! How can I help you today?",
      headerColor: options.headerColor || "#696969",
      userMessageColor: options.userMessageColor || "#D3D3D3 ", // Default light gray for user messages
      botMessageColor: options.botMessageColor || "#d1e7dd",   // Default light green for bot messages
      code: options.promptCode || "test",
      bottextcolor: options.bottextcolor || "#000000",
      usertextcolor: options.usertextcolor || "#000000",
      width: options.width || "35%",
      height: options.height ||"85%",
      

    };
    
    const chatbotHTML = `
            <div class="logo-container">
                <img src="https://chat-bot-ernesto.vercel.app/logo.jpg" alt="Logo" id="chatbotLogo" class="logo">
            </div>
            <div class="chat-container hidden" id="chatContainer" style="width: ${config.width}; height: ${config.height}">
                <div class="chat-header" style="background-color: ${config.headerColor}">
                    <div class="profile">
                        <div class="profile-image">AI</div>
                        <span>${config.name}</span>
                        
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

                    <div class="message bot animate" style="background-color: ${config.botMessageColor} ; color: ${config.bottextcolor}">
                       ${config.initialMessage} 
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
    const minimizeChat = chatbotContainer.querySelector(".minimize-btn");

    function addMessage(message, type) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", type);
      messageElement.textContent = message;
    
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
      // Preserve the customer info and initial greeting
      const customerInfo = chatMessages.querySelector(".customer-info");
      const initialGreeting = chatMessages.querySelector(".message.bot");
    
      // Clear all messages
      while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
      }
    
      // Re-add the preserved elements
      if (customerInfo) {
        chatMessages.appendChild(customerInfo);
      }
      if (initialGreeting) {
        chatMessages.appendChild(initialGreeting);
      }
    
      // Ensure the chat scrolls to the top
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    

    function sendMessage() {
      const message = input.value.trim();
      if (message) {
        addMessage(message, "user");
        input.value = "";
        let full_message = getLastFiveMessages()
        const data = {
          userInput: full_message,
          promptCode: config.code,
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
              throw new Error(
                `Server responded with status ${response.status}`
              );
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
      clearChatMessages()
      chatContainer.classList.add("hidden");
    });
    minimizeChat.addEventListener("click", () => {
      chatContainer.classList.add("hidden");
    });
  };
})();
