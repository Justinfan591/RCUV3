// Function to toggle chat box visibility
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    console.log("Chat icon clicked!");

    if (chatBox.classList.contains('show')) {
        chatBox.classList.remove('show');
        console.log("Chat box hidden.");
    } else {
        chatBox.classList.add('show');
        console.log("Chat box visible.");
    }
}

// Function to toggle speech-to-text box
function toggleSpeechBox() {
    const speechContainer = document.querySelector('.speech-container');
    if (speechContainer.classList.contains('show')) {
        speechContainer.classList.remove('show');
        console.log("Speech-to-text box hidden.");
    } else {
        speechContainer.classList.add('show');
        console.log("Speech-to-text box visible.");
    }
}

// Speech Recognition Code (Same as before)
let isRecording = false;
let recognizer;

async function startVoiceInput() {
    const recordButton = document.getElementById("record-btn");
    const outputBox = document.getElementById("speech-output");

    if (!isRecording) {
        try {
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
                "AGgaAzCEKu7sXD8T7HV1pKT1OJlcinHF8lxdmIxj7wm1G8sHTK0bJQQJ99AKACYeBjFXJ3w3AAAYACOGrn8f",
                "eastus"
            );
            speechConfig.speechRecognitionLanguage = "en-US";

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

            recognizer.recognized = (sender, event) => {
                if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    const transcribedText = event.result.text;
                    console.log(`Recognized: ${transcribedText}`);
                    outputBox.value = transcribedText;
                } else {
                    console.log("No speech recognized.");
                }
            };

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

    outputBox.select();
    navigator.clipboard.writeText(outputBox.value).then(() => {
    }).catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy. Try selecting and copying manually.");
    });
}
