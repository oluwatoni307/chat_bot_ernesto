document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input button");
  const chatMessages = document.getElementById("chatMessages");
  const typingIndicator = document.querySelector(".typing-indicator");
  // Get the chatbot elements
  const chatbotLogo = document.getElementById("chatbotLogo");
  const chatContainer = document.getElementById("chatContainer");
  const closeChat = document.querySelector(".close-btn");

  function addMessage(message, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", type);
    messageElement.textContent = message;

    // Remove typing indicator
    typingIndicator.classList.remove("show");

    // Add message before typing indicator
    chatMessages.insertBefore(messageElement, typingIndicator);

    // Trigger reflow to enable animation
    void messageElement.offsetWidth;

    // Add animate class
    messageElement.classList.add("animate");

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    typingIndicator.classList.add("show");
  }

  sendButton.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = input.value.trim();
    if (message) {
      addMessage(message, "user");
      input.value = "";

      // Simulate bot response
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          addMessage("I received your message!", "bot");
        }, 1500);
      }, 500);
    }
  }

  // Close button functionality

  // Show the chatbot when the logo is clicked
  chatbotLogo.addEventListener("click", () => {
    chatContainer.classList.remove("hidden");
  });

  // Hide the chatbot when the close button is clicked
  closeChat.addEventListener("click", () => {
    chatContainer.classList.add("hidden");
  });
});
