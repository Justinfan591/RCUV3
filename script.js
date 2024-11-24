// Function to toggle chat box visibility
function toggleChat() {
    const chatBox = document.querySelector(".chat-box");
    const speechContainer = document.querySelector(".speech-container");

    if (chatBox.classList.contains("show")) {
        chatBox.classList.remove("show");
        speechContainer.style.display = "none"; // Hide speech box
    } else {
        chatBox.classList.add("show");
        speechContainer.style.display = "block"; // Show speech box
    }
}

async function startVoiceInput() {
    const recordButton = document.getElementById("record-btn");
    const outputBox = document.getElementById("speech-output");

    if (!isRecording) {
        try {
            // Configure Azure Speech SDK
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
                "AGgaAzCEKu7sXD8T7HV1pKT1OJlcinHF8lxdmIxj7wm1G8sHTK0bJQQJ99AKACYeBjFXJ3w3AAAYACOGrn8f", // Replace with your Azure Speech API Key
                "eastus" // Replace with your Azure region
            );
            speechConfig.speechRecognitionLanguage = "en-US";

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

            // Event listener for recognized speech
            recognizer.recognized = (sender, event) => {
                if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    const transcribedText = event.result.text;
                    console.log(`Recognized: ${transcribedText}`);
                    outputBox.value = transcribedText; // Show in text area
                }
            };

            // Start recognition
            recognizer.startContinuousRecognitionAsync(
                () => {
                    console.log("Speech recognition started.");
                    recordButton.textContent = "Stop Recording";
                    isRecording = true;
                },
                (err) => {
                    console.error("Error starting recognition:", err);
                    alert("Error starting speech recognition. Please try again.");
                }
            );
        } catch (error) {
            console.error("Error initializing speech recognition:", error);
            alert("Failed to start speech input. Check microphone permissions.");
        }
    } else {
        // Stop recognition
        recognizer.stopContinuousRecognitionAsync(
            () => {
                console.log("Speech recognition stopped.");
                recordButton.textContent = "🎤 Speak";
                isRecording = false;
            },
            (err) => {
                console.error("Error stopping recognition:", err);
            }
        );
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
    const iframe = document.getElementById("chat-iframe"); // Target the iframe
    let iframeDoc;

    // Ensure iframe is loaded
    try {
        iframeDoc = iframe.contentWindow.document;
    } catch (e) {
        console.error("Cannot access iframe document:", e);
        alert("Error accessing chatbox. Ensure it is correctly embedded.");
        return;
    }

    if (!isRecording) {
        try {
            // Configure Speech SDK
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
                "YOUR_API_KEY", // Replace with your Azure API Key
                "YOUR_REGION" // Replace with your Azure region
            );
            speechConfig.speechRecognitionLanguage = "en-US";

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

            recognizer.recognized = (sender, event) => {
                if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    const transcribedText = event.result.text;

                    console.log(`Recognized: ${transcribedText}`);

                    // Locate the input field in the iframe and set its value
                    const chatInput = iframeDoc.querySelector("input[type='text']"); // Adjust selector if necessary
                    if (chatInput) {
                        chatInput.value = transcribedText; // Populate the input box
                        console.log("Text added to input box");

                        // Optionally, simulate the "send" button click
                        const sendButton = iframeDoc.querySelector("button[type='submit']");
                        if (sendButton) {
                            sendButton.click();
                            console.log("Message sent!");
                        }
                    } else {
                        console.error("Chat input field not found.");
                    }
                }
            };

            recognizer.startContinuousRecognitionAsync(() => {
                console.log("Speech recognition started.");
                recordButton.textContent = "Stop Recording";
                isRecording = true;
            });
        } catch (error) {
            console.error("Error initializing speech recognition:", error);
            alert("Failed to start voice input. Please check your microphone permissions.");
        }
    } else {
        recognizer.stopContinuousRecognitionAsync(() => {
            console.log("Speech recognition stopped.");
            recordButton.textContent = "🎤 Speak";
            isRecording = false;
        });
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

