

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (message === "") return;

    addMessage("You", message);
    input.value = "";

    const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    console.log(data.reply);
    addMessage("IRIS Network Agent", data.reply);
}

function addMessage(sender, text) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}



