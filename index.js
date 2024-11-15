(function monitorWhatsApp() {
    console.log("Monitor Started...");

    // List of messages to react 
    // when someone sends a message that includes any of these words
    // in the current chat, the script will react replying with the reaction
    const reactTo = ["+1", "+ 1"];

    // The reaction to send. We accept emojis too!!
    const reaction = "+1";
    
    // This variable will help us to avoid sending the reaction multiple times
    let reacted = false;

    // Check for new messages every 2 second
    const monitor = setInterval(checkLastMessage, 2 * 1000);

    function sendMessage(text) {
        // Find the message input box
        const messageBox = document.querySelector(
            'footer div[contenteditable="true"]'
        );
        if (messageBox) {
            // Focus on the input box
            messageBox.focus();

            // We need to create a new event to trigger the input event
            // This is necessary because WhatsApp uses React 
            // and the input event is not triggered by simply 
            // setting the value of the input box
            const event = new InputEvent("input", {
                bubbles: true,
                cancelable: true,
                data: text,
                inputType: "insertText",
            });
            messageBox.dispatchEvent(event);

            // Wait a moment and then send the message
            setTimeout(() => {
                const sendButton = document.querySelector(
                    'span[data-icon="send"]'
                );
                if (sendButton) sendButton.click();

                // Let's free the monitor
                clearInterval(monitor);
            }, 200);
        }
    }

    // This function will check the last message JUST in the current chat
    function checkLastMessage() {
        const messages = document.querySelectorAll(
            "div.message-in span.selectable-text"
        );
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1].innerText.trim();

            // If the last message is in the reactTo array
            // and we haven't reacted to it yet
            if (reactTo.some(item => lastMessage.includes(item)) && !reacted) {
                sendMessage(reaction);
                reacted = true;
            }
        }
    }

})();
