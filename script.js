// Function to toggle chat box visibility
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    console.log("Chat icon clicked!"); // Check if this logs in the console
    if (chatBox.classList.contains('show')) {
        chatBox.classList.remove('show');
        console.log("Chat box hidden.");
    } else {
        chatBox.classList.add('show');
        console.log("Chat box visible.");
    }
}


// Example function to call the Copilot API
async function callCopilotAPI(userInput) {
    try {
        const response = await fetch("https://<your-api-endpoint>", {
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_API_KEY",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: userInput,
            }),
        });

        if (!response.ok) {
            console.error("API Error:", response.status);
            return "An error occurred while processing your request.";
        }

        const data = await response.json();
        return data.reply; // Adjust based on API response format
    } catch (error) {
        console.error("Error:", error);
        return "An error occurred. Please try again later.";
    }
}

// Handle sending messages
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";
    document.getElementById("agent-response").innerText = "Processing...";

    const response = await callCopilotAPI(userInput);
    document.getElementById("agent-response").innerText = response;
}
async function initiateCall() {
    try {
        const response = await fetch('https://<your-backend-domain>/start-call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: '+<user-phone-number>', // Replace with dynamic input if required
            }),
        });

        if (!response.ok) {
            console.error('Error initiating call:', response.statusText);
            alert('Failed to initiate call. Please try again later.');
            return;
        }

        const data = await response.json();
        console.log('Call initiated:', data);
        alert('Call has been initiated! Please wait for a response.');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while initiating the call.');
    }
}