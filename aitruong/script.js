document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('chatbot-send');
    const userInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    // FIX: Corrected ID to match the HTML element 'keyword-suggestions'
    const suggestionsContainer = document.getElementById('keyword-suggestions'); 
    const showKeywordsBtn = document.getElementById('show-keywords-btn'); // Get the new button

    const dataUrl = 'data.json';
    let fuse;
    let chatData = [];
    let userInteracted = false; // Track if user has typed a message

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
            fuse = new Fuse(chatData, {
                keys: ['cauhoi'],
                includeScore: true,
                threshold: 0.5,
            });
            console.log('Data loaded and Fuse.js initialized.');
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

    // Event listener for the new show keywords button
    showKeywordsBtn.addEventListener('click', () => {
        renderKeywordSuggestions();
        // Toggle visibility of suggestions container
        if (suggestionsContainer) { // Ensure container exists before manipulating
            // FIX: Changed toggle from 'flex' to 'block' to match CSS
            suggestionsContainer.style.display = suggestionsContainer.style.display === 'block' ? 'none' : 'block';
        }
    });

    // Event listener for the '?' key press to show suggestions
    userInput.addEventListener('keypress', (e) => {
        if (e.key === '?') {
            e.preventDefault(); // Prevent default behavior of '?'
            renderKeywordSuggestions();
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'block';
            }
        } else if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // --- Functions ---
    function handleUserMessage(predefinedQuery = null) {
        const query = predefinedQuery || userInput.value.trim();
        if (query === '') return;

        // Hide suggestions if user types a message and suggestions are visible
        if (!userInteracted && query && suggestionsContainer && suggestionsContainer.style.display !== 'none') {
            suggestionsContainer.style.display = 'none';
            userInteracted = true; // Mark as interacted once user types
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
                    // Display the most relevant question as a suggestion
                    // Use a random keyword from the cauhoi array for the suggestion
                    const randomIndex = Math.floor(Math.random() * bestResult.item.cauhoi.length);
                    response = `Tôi không chắc lắm, có phải bạn muốn hỏi về: "<strong>${bestResult.item.cauhoi[randomIndex]}</strong>"?`;
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

    // Function to render ONE random keyword suggestion per entry from data.json, limited to 5
    function renderKeywordSuggestions() {
        if (!suggestionsContainer) {
            console.error("Element with ID 'keyword-suggestions' not found.");
            return; // Exit if the container is not found
        }
        suggestionsContainer.innerHTML = ''; // Clear previous suggestions
        
        if (chatData.length === 0) {
            return; // No data, so no keywords to display
        }

        let keywordCount = 0; // Counter for displayed keywords
        const maxKeywordsToShow = 5; // Limit to 5 keywords

        // Iterate through each item in chatData and pick one random keyword
        chatData.forEach(item => {
            if (item.cauhoi && item.cauhoi.length > 0) {
                // Pick a random keyword from the current item's cauhoi array
                const randomIndex = Math.floor(Math.random() * item.cauhoi.length);
                const keyword = item.cauhoi[randomIndex];

                // Only add button if we haven't reached the limit
                if (keywordCount < maxKeywordsToShow) {
                    const btn = document.createElement('button');
                    btn.className = 'suggestion-btn'; // Use the existing class for styling
                    btn.textContent = keyword;
                    btn.onclick = () => {
                        handleUserMessage(keyword); // Send the keyword as a message
                        suggestionsContainer.style.display = 'none'; // Hide suggestions after selection
                    };
                    suggestionsContainer.appendChild(btn);
                    keywordCount++; // Increment the counter
                }
            }
        });
        
        // Note: To make this scrollable, you'll need to add CSS to the #keyword-suggestions element.
        // For example, in your style.css file:
        // #keyword-suggestions {
        //     max-height: 200px; /* Adjust as needed */
        //     overflow-y: auto;
        // }
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
