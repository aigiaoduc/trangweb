document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('chatbot-send');
    const userInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const suggestionsContainer = document.getElementById('chatbot-suggestions');

    const dataUrl = 'data.json';
    let fuse;
    let chatData = [];
    let userInteracted = false;

    // --- Suggestions ---
    const suggestions = ["Giờ vào học", "Danh sách giáo viên", "Số điện thoại trường", "Danh sách học sinh"];

    // --- Fuse.js Options ---
    const options = {
        keys: ['cauhoi'],
        includeScore: true,
        threshold: 0.5, // Looser threshold to find near matches
    };

    // --- Fetch and Parse Data ---
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
            renderSuggestions();
            console.log('Data loaded and Fuse.js initialized.');
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            addMessage('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.', 'bot');
        });

    // --- Event Listeners ---
    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // --- Functions ---
    function handleUserMessage(predefinedQuery = null) {
        const query = predefinedQuery || userInput.value.trim();
        if (query === '') return;

        if (!userInteracted) {
            suggestionsContainer.style.display = 'none';
            userInteracted = true;
        }

        addMessage(query, 'user');
        userInput.value = '';
        showTypingIndicator();

        // Find the best match
        setTimeout(() => {
            const results = fuse.search(query);
            let response;

            if (results.length === 0) {
                response = 'Xin lỗi, tôi không tìm thấy câu trả lời phù hợp. Bạn có thể thử một từ khóa khác.';
            } else {
                const bestResult = results[0];
                if (bestResult.score < 0.3) { // Good match (lower score is better)
                    response = bestResult.item.traloi;
                } else { // Not a great match
                    response = `Tôi không chắc lắm, có phải bạn muốn hỏi về: "<strong>${bestResult.item.cauhoi}</strong>"?`;
                }
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

    function renderSuggestions() {
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = text;
            btn.onclick = () => handleUserMessage(text);
            suggestionsContainer.appendChild(btn);
        });
    }

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
