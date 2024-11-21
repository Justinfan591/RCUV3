async function callCopilotAPI(userInput) {
    const response = await fetch("https://<tenant>.microsoft.com/copilot/agent/endpoint", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_API_KEY", // Replace with your API key
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: userInput, // User's input
        }),
    });

    if (!response.ok) {
        console.error("Error calling the API", response.status);
        return "Sorry, something went wrong.";
    }

    const data = await response.json();
    return data.reply; // Adjust based on the API's response structure
}
