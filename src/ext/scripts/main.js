document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: interactWithChatPage,
        });
    });
});

function interactWithChatPage() {
    const chatHistory = getChatHistory();
    // sendChatMessage("Oi, tudo bem? Está afim de comer chiclete?");

    // Chama a API e, em seguida, envia a resposta para o chat
    // callApi(chatHistory).then(response => {
    //     sendChatMessage(response);
    // });

    // adiciona o botão de interação com o chat

    // Cria um botão e atribui as propriedades
    const button = document.createElement('div');
    button.id = 'reply';
    button.style.position = 'absolute';
    button.style.bottom = '66px';
    button.style.right = '43px';
    button.style.zIndex = '1000';
    button.width = '50px';
    button.height = '50px';
    button.borderRadius = '41px';
    // cursor: pointer;
    button.style.cursor = 'pointer';

    //adiciona o icone ao botão
    const img = document.createElement('img');
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAATxJREFUSInVlS1PA0EQhp9pMCQnuCouPSQfDllQJFiKwHAe0d9QMLQCCPAH6C+ASqjAUgcWEkSR9MOQVnAJroMg15S9HummV8GTbLI3k7xvZnZuV1SVWZKZqTowZwYKpzc7IlIFcnZS0hLV4t1RcD8ajVUgkrmyFwdQX4WqGR3TIvXtxYcsTWCQLv/fIDZFEZ7rUAm2ADiuNej2w4lyJokVbKzk8FwHz3XIL/8M1cXzA+cvjbE5a4PHZptuP6TT++TprQ2AiqAJuSTEvCp2z2pT3R31w0BGv60OOWqRDVYGUYtsSJwigIPtdTZXfbLOPL3wi8vbLM1OLz2DvfzacL+44FiLQ/o/2ruVwWvrw0p8IIOiGfx7TEXK9dJ+xcbFJLmCFMSTDVISB0BVf63CyXXZjE2zYmeQNjN/D74BlRuwnRjp8gQAAAAASUVORK5CYII=";
    img.style.width = '100%'; // Define a largura da imagem como 100% do botão
    img.style.height = '100%'; // Define a altura da imagem como 100% do botão

    button.appendChild(img);

    // Adiciona um evento de click ao botão
    button.addEventListener('click', function () {
        alert('carregando...');

        // Chama a API e, em seguida, envia a resposta para o chat
        callApi(chatHistory).then(response => {
            sendChatMessage(response);
        });
    });

    // adiciona ao elemento .chat-app-form
    const chatAppFormElement = document.querySelector('.chat-app-form');
    if (chatAppFormElement) {
        chatAppFormElement.appendChild(button);
    }

    function getChatHistory() {
        const chatMessagesElement = document.getElementById("chat_msgs");
        return chatMessagesElement ? chatMessagesElement.innerText : '';
    }

    function sendChatMessage(message) {
        const chatInputElement = document.getElementById("chat-input");
        if (chatInputElement) {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8');
            const encoded = encoder.encode(message);
            const decodedMessage = decoder.decode(encoded);
            chatInputElement.value = decodedMessage;
        }
    }

    async function callApi(chatHistory) {
        try {
            const apiUrl = 'https://api.openai.com/v1/chat/completions';
            const api_key = ''; // Substitua pelo sua chave de API

            var user_message = `
            Generate a cute response based on this history or a new one to start the conversation:
                ${chatHistory}
            `;

            const data = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a bot that will respond to chat messages pretending to be a human."
                    },
                    {
                        role: "user",
                        content: user_message
                    },
                ],
                temperature: 0.7
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }

            const jsonResponse = await response.json();
            console.log(jsonResponse)
            const message = jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message;
            return message ? message.content : 'Nenhuma resposta recebida';

        } catch (error) {
            console.error('Houve um problema com a chamada da API: ', error);
        }
    }
}
