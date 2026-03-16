const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('clearBtn').addEventListener('click', clearMessages);

let loadingElement = null;

// load chat history from local storage
chrome.storage.local.get('chatHistory', (data) => {
    if (data.chatHistory) {
        document.getElementById('messages').innerHTML = data.chatHistory;
    }
});



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


    isLoading = true;
    // get response from server
    try{

        //Loading indicator
        loadingElement = document.createElement('div');
        loadingElement.classList.add('message', 'assistant');
        loadingElement.textContent = "Thinking...";
        document.getElementById('messages').appendChild(loadingElement);
        userInput.disabled = true;
        sendButton.disabled = true;

        //fetching data from server
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: userText})
        });

        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error || 'An error occurred while fetching the response.');
        }

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
    finally{
        loadingElement.remove();
        userInput.disabled = false;
    }
    saveData();

}

async function clearMessages() {

    await fetch("http://127.0.0.1:5000/clear", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    document.getElementById('messages').innerHTML = '';
    let messageElement = document.createElement('div');
    messageElement.classList.add('message', 'assistant');
    messageElement.textContent = "Chat cleared. Start a new conversation!";
    document.getElementById('messages').appendChild(messageElement);
    saveData();
}


userInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});


function saveData(){
    const messages = document.getElementById('messages').innerHTML;
    chrome.storage.local.set({chatHistory: messages});
}


