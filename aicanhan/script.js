document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const sendBtn = document.getElementById('chatbot-send');
    const userInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const commandListBtn = document.getElementById('command-list-btn');
    const commandModal = document.getElementById('command-list-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const commandList = document.getElementById('command-list');

    // --- State and Data ---
    const dataUrl = 'data.json';
    let fuse;
    let chatData = [];

    // --- Fuse.js Options ---
    const options = {
        keys: ['cauhoi'],
        includeScore: true,
        threshold: 0.4, // Adjusted threshold
    };

    // --- Fetch Data and Initialize ---
    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            chatData = data;
            fuse = new Fuse(chatData, options);
            populateCommandList();
            console.log('Data loaded, Fuse.js initialized, and command list populated.');
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            addMessage('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.', 'bot');
        });

    // --- Event Listeners ---
    sendBtn.addEventListener('click', () => handleUserMessage());
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    commandListBtn.addEventListener('click', () => {
        commandModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        commandModal.classList.add('hidden');
    });

    // Close modal if clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === commandModal) {
            commandModal.classList.add('hidden');
        }
    });

    // --- Core Functions ---
    function handleUserMessage(predefinedQuery = null) {
        const query = predefinedQuery || userInput.value.trim();
        if (query === '') return;

        addMessage(query, 'user');
        userInput.value = '';
        showTypingIndicator();

        // Find the best match using Fuse.js
        setTimeout(() => {
            const results = fuse.search(query);
            let response;

            if (results.length > 0 && results[0].score < options.threshold) {
                response = results[0].item.traloi;
            } else {
                response = 'Xin lỗi, tôi không tìm thấy câu trả lời phù hợp. Bạn có thể xem danh sách câu lệnh hoặc thử một từ khóa khác.';
            }
            hideTypingIndicator();
            addMessage(response, 'bot');
        }, 800); // Simulate thinking
    }

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const p = document.createElement('p');
        p.innerHTML = text; // Use innerHTML to render potential HTML in answers
        messageElement.appendChild(p);

        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    function populateCommandList() {
        commandList.innerHTML = '';
        chatData.forEach(item => {
            if (item.cauhoi && item.cauhoi.length > 0) {
                const commandText = item.cauhoi[0]; // Take the first question as the command
                const li = document.createElement('li');
                li.textContent = commandText;
                li.addEventListener('click', () => {
                    handleUserMessage(commandText);
                    commandModal.classList.add('hidden');
                });
                commandList.appendChild(li);
            }
        });
    }

    // --- Utility Functions ---
    function showTypingIndicator() {
        if (document.querySelector('.typing-indicator')) return;
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
