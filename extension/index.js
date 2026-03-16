const userInput = document.getElementById('userInput');

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('clearBtn').addEventListener('click', clearMessages);

async function sendMessage() {
    const message = userInput.value;
    if (!message){
        alert("Please enter a message.");
        return;
    };
    const userText = message.trim();

    let messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user');
    messageElement.textContent = userText;
    document.getElementById('messages').appendChild(messageElement);
    userInput.value = '';

    // get response from server
    try{
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: userText})
        });

        if(!response.ok){
            throw new Error(data.error || 'An error occurred while fetching the response.');
        }

        const data = await response.json();

        let assistantMessageElement = document.createElement('div');
        assistantMessageElement.classList.add('message', 'assistant');
        assistantMessageElement.innerHTML = DOMPurify.sanitize(marked.parse(data.response));
        document.getElementById('messages').appendChild(assistantMessageElement);

    }
    catch(error){
        console.error('Error:', error);
        let errorElement = document.createElement('div');
        errorElement.classList.add('message', 'assistant');
        errorElement.textContent = "Sorry, there was an error processing your request. Please try again.";
        document.getElementById('messages').appendChild(errorElement);
    }

}

async function clearMessages() {
    document.getElementById('messages').innerHTML = '';
    let messageElement = document.createElement('div');
    messageElement.classList.add('message', 'assistant');
    messageElement.textContent = "Chat cleared. Start a new conversation!";
    document.getElementById('messages').appendChild(messageElement);
}


userInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});