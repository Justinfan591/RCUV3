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
// Voice Input and Speech-to-Text Integration
async function startVoiceInput() {
    try {
        // Check if the browser supports audio recording
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support audio recording.');
            return;
        }

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        // Gather recorded audio data
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        // Once recording stops, process the audio
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

            // Display processing feedback
            const inputBox = document.getElementById('user-input');
            inputBox.value = "Processing your voice...";

            // Send the audio to the Speech-to-Text API
            const transcription = await transcribeAudio(audioBlob);

            // Update the input box with the transcribed text
            inputBox.value = transcription;

            // Automatically send the transcription to the AI agent
            sendMessage(); // Call the existing sendMessage function to send the input
        };

        // Start recording for 5 seconds
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000); // Stop recording after 5 seconds
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Failed to access the microphone. Please check your permissions.');
    }
}

// Function to send audio to a Speech-to-Text API
async function transcribeAudio(audioBlob) {
    try {
        const response = await fetch("https://<your-speech-to-text-api-endpoint>", {
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_API_KEY", // Add your Speech-to-Text API Key
                "Content-Type": "audio/wav",
            },
            body: audioBlob,
        });

        if (!response.ok) {
            console.error("Speech-to-Text API Error:", response.status);
            return "Sorry, I couldn't understand your speech.";
        }

        const data = await response.json();
        return data.DisplayText || data.transcription; // Adjust based on API response format
    } catch (error) {
        console.error("Error transcribing audio:", error);
        return "An error occurred while processing your speech.";
    }
}

