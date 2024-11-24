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

// Handle sending messages
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";
    document.getElementById("agent-response").innerText = "Processing...";

    const response = await callCopilotAPI(userInput);
    document.getElementById("agent-response").innerText = response;
}

// Voice Input and Speech-to-Text Integration
let isRecording = false; // Toggle state for recording
let recognizer; // Global variable for recognizer

// Start or stop voice input
async function startVoiceInput() {
    const recordButton = document.getElementById("record-btn");

    if (!isRecording) {
        try {
            // Configure Speech SDK
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
                "AGgaAzCEKu7sXD8T7HV1pKT1OJlcinHF8lxdmIxj7wm1G8sHTK0bJQQJ99AKACYeBjFXJ3w3AAAYACOGrn8f", // Replace with your API key
                "eastus" // Replace with your region
            );
            speechConfig.speechRecognitionLanguage = "en-US"; // Set language

            // Create an audio configuration for the microphone
            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

            // Initialize recognizer
            recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

            // Subscribe to events
            recognizer.recognizing = (sender, event) => {
                console.log(`Recognizing: ${event.result.text}`);
            };

            recognizer.recognized = (sender, event) => {
                if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    const transcribedText = event.result.text;
                    console.log(`Final result: ${transcribedText}`);

                    // Populate the recognized text into the Web Chat input field and send it
                    sendMessageToCopilot(transcribedText);
                } else {
                    console.log("Speech not recognized.");
                }
            };

            recognizer.startContinuousRecognitionAsync(
                () => {
                    console.log("Recognition started.");
                    recordButton.textContent = "Stop Recording";
                    isRecording = true;
                },
                (err) => {
                    console.error("Error starting recognition:", err);
                }
            );
        } catch (error) {
            console.error("Error accessing microphone or initializing recognition:", error);
            alert("Failed to start voice input. Please check your microphone permissions.");
        }
    } else {
        // Stop recognition
        recognizer.stopContinuousRecognitionAsync(
            () => {
                console.log("Recognition stopped.");
                recordButton.textContent = "🎤 Speak";
                isRecording = false;
            },
            (err) => {
                console.error("Error stopping recognition:", err);
            }
        );
    }
}

// Helper function to send message to Copilot Web Chat
function sendMessageToCopilot(message) {
    const iframe = document.querySelector("iframe"); // Target your iframe
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document; // Access iframe's document

    const inputField = iframeDocument.querySelector('input[aria-label="Type your message"]'); // Locate the input field
    const sendButton = iframeDocument.querySelector('button[aria-label="Send"]'); // Locate the send button

    if (inputField && sendButton) {
        inputField.value = message; // Set the transcribed text
        sendButton.click(); // Simulate click to send the message
        console.log(`Sent message: ${message}`);
    } else {
        console.error("Failed to find Web Chat input field or send button.");
    }
}



// Function to send audio to a Speech-to-Text API
async function transcribeAudio(audioBlob) {
    try {
        const response = await fetch("https://eastus.api.cognitive.microsoft.com/", {
            method: "POST",
            headers: {
                "Authorization": "AGgaAzCEKu7sXD8T7HV1pKT1OJlcinHF8lxdmIxj7wm1G8sHTK0bJQQJ99AKACYeBjFXJ3w3AAAYACOGrn8f", // Add your Speech-to-Text API Key
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

function sendMessageToCopilot(message) {
    const iframe = document.querySelector("iframe"); // Target your iframe
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document; // Access iframe's document

    const inputField = iframeDocument.querySelector('input[aria-label="Type your message"]'); // Locate the input field
    const sendButton = iframeDocument.querySelector('button[aria-label="Send"]'); // Locate the send button

    if (inputField && sendButton) {
        inputField.value = message; // Set the transcribed text
        sendButton.click(); // Simulate click to send the message
    } else {
        console.error("Failed to find Web Chat input field or send button.");
    }
}

