// Function to toggle chat box visibility
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    const speechContainer = document.querySelector('.speech-container'); // Floating speech-to-text box

    console.log("Chat icon clicked!"); // Check if this logs in the console

    if (chatBox.classList.contains('show')) {
        chatBox.classList.remove('show');
        speechContainer.classList.remove('show'); // Hide speech box
        console.log("Chat box and speech box hidden.");
    } else {
        chatBox.classList.add('show');
        speechContainer.classList.add('show'); // Show speech box
        console.log("Chat box and speech box visible.");
    }
}
let isRecording = false;
let recognizer;

// Start or stop speech recognition
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
                } else {
                    console.log("No speech recognized.");
                }
            };

            // Start recognition
            recognizer.startContinuousRecognitionAsync(() => {
                console.log("Speech recognition started.");
                recordButton.textContent = "Stop Recording";
                isRecording = true;
            });
        } catch (error) {
            console.error("Error initializing speech recognition:", error);
            alert("Failed to start speech input. Check microphone permissions.");
        }
    } else {
        // Stop recognition
        recognizer.stopContinuousRecognitionAsync(() => {
            console.log("Speech recognition stopped.");
            recordButton.textContent = "🎤 Speak";
            isRecording = false;
        });
    }
}

// Copy transcription text to clipboard
function copyToClipboard() {
    const outputBox = document.getElementById("speech-output");
    if (outputBox.value.trim() === "") {
        alert("No text to copy! Please transcribe something first.");
        return;
    }

    // Copy text to clipboard
    outputBox.select();
    outputBox.setSelectionRange(0, 99999); // For mobile compatibility

    try {
        navigator.clipboard.writeText(outputBox.value);
        alert("Transcription copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy. Try selecting and copying manually.");
    }
}
