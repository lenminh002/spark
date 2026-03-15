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

}

async function clearMessages() {
    document.getElementById('messages').innerHTML = '';
    let messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot');
    messageElement.textContent = "Chat cleared. Start a new conversation!";
    document.getElementById('messages').appendChild(messageElement);
}


userInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});