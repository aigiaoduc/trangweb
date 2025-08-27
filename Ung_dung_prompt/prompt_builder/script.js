document.addEventListener('DOMContentLoaded', () => {
    const addTopicBtn = document.getElementById('add-topic-btn');
    const topicsContainer = document.getElementById('topics-container');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const outputPromptTextarea = document.getElementById('output-prompt');
    const copyBtn = document.getElementById('copy-btn');

    let topicCounter = 0;

    // Thêm một chủ đề ngay từ đầu
    addTopic();

    addTopicBtn.addEventListener('click', addTopic);

    function addTopic() {
        topicCounter++;
        const topicId = topicCounter;
        const topicBlock = document.createElement('div');
        topicBlock.className = 'topic-block';
        topicBlock.setAttribute('data-id', topicId);

        topicBlock.innerHTML = `
            <h3>Chủ đề ${topicId}</h3>
            <button type="button" class="btn btn-danger remove-topic-btn"><i class="fa-solid fa-trash-can"></i> Xóa</button>
            <div class="form-group">
                <label for="topic-name-${topicId}">Tên chủ đề:</label>
                <input type="text" id="topic-name-${topicId}" placeholder="Ví dụ: Gene là trung tâm của di truyền học" required>
            </div>
            <div class="form-group">
                <label for="topic-duration-${topicId}">Thời lượng giảng dạy (tiết):</label>
                <input type="number" id="topic-duration-${topicId}" placeholder="Ví dụ: 5" required>
            </div>
            <div class="form-group">
                <label for="topic-content-${topicId}">Nội dung/đơn vị kiến thức:</label>
                <textarea id="topic-content-${topicId}" placeholder="Liệt kê các nội dung kiến thức chính, mỗi nội dung trên một dòng" required rows="4"></textarea>
            </div>
        `;

        topicsContainer.appendChild(topicBlock);

        topicBlock.querySelector('.remove-topic-btn').addEventListener('click', () => {
            topicBlock.remove();
            updateTopicTitles();
        });
    }
    
    function updateTopicTitles() {
        const allTopics = topicsContainer.querySelectorAll('.topic-block');
        allTopics.forEach((topic, index) => {
            topic.querySelector('h3').textContent = `Chủ đề ${index + 1}`;
        });
    }


    generateBtn.addEventListener('click', () => {
        if (!document.getElementById('matrix-form').checkValidity()) {
            alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
            return;
        }

        const subject = document.getElementById('subject').value;
        const examTime = document.getElementById('exam-time').value;
        const mcqPoints = document.getElementById('mcq-points').value;
        const mcqMultipleChoice = document.getElementById('mcq-multiple-choice').value;
        const mcqTrueFalse = document.getElementById('mcq-true-false').value;
        const mcqShortAnswer = document.getElementById('mcq-short-answer').value;
        const essayPoints = document.getElementById('essay-points').value;
        const levelKnowledge = document.getElementById('level-knowledge').value;
        const levelComprehension = document.getElementById('level-comprehension').value;
        const levelApplication = document.getElementById('level-application').value;
        const pointsMultipleChoice = document.getElementById('points-multiple-choice').value;
        const pointsTrueFalse = document.getElementById('points-true-false').value;
        const pointsShortAnswer = document.getElementById('points-short-answer').value;
        const pointsEssay = document.getElementById('points-essay').value;

        let topicsString = '';
        const topicBlocks = topicsContainer.querySelectorAll('.topic-block');
        topicBlocks.forEach((block, index) => {
            const id = block.getAttribute('data-id');
            const name = block.querySelector(`#topic-name-${id}`).value;
            const duration = block.querySelector(`#topic-duration-${id}`).value;
            const content = block.querySelector(`#topic-content-${id}`).value;
            
            topicsString += `###${index + 1}. Chủ đề ${index + 1}: [${name}]
`;
            topicsString += `####1. Thời lượng giảng dạy: [${duration} tiết].
`;
            topicsString += `####2. Nội dung/đơn vị kiến thức: [${content}].

`;
        });

        const finalPrompt = `
#1. NGỮ CẢNH
Bạn là một chuyên gia về thiết kế và đánh giá giáo dục, có kiến thức sâu rộng về Chương trình Giáo dục phổ thông 2018 của Việt Nam và các văn bản hướng dẫn chuyên môn như Công văn 7991/BGDĐT-GDTrH. Nhiệm vụ của bạn là xây dựng một ma trận đề kiểm tra định kỳ cho môn học [${subject}] một cách khoa học, logic và chính xác tuyệt đối dựa trên các dữ liệu và yêu cầu được cung cấp.

#2. DỮ LIỆU ĐẦU VÀO
Nội dung tạo ma trận tuyệt đối chỉ được lấy thông tin từ các file đính kèm Sách giáo khoa và mẫu của ma trận đã được đính kèm của Công văn 7991.

##1. THÔNG SỐ CHUNG CỦA BÀI KIỂM TRA
###1. Môn học: [${subject}]
###2. Thời gian làm bài: [${examTime} phút]
###3. Tổng điểm: 10 điểm.
###4. Cơ cấu điểm:
####1. Trắc nghiệm khách quan (TN): [${mcqPoints} điểm] (tương đương [${mcqPoints * 10}%] tổng điểm).
1. Nhiều lựa chọn: [${mcqMultipleChoice} điểm].
2. Đúng - Sai: [${mcqTrueFalse} điểm].
3. Trả lời ngắn: [${mcqShortAnswer} điểm].
####2. Tự luận (TL): [${essayPoints} điểm] (tương đương [${essayPoints * 10}%] tổng điểm).
###5. Tỉ lệ điểm theo mức độ nhận thức:
1. Nhận biết (NB): [${levelKnowledge}%].
2. Thông hiểu (TH): [${levelComprehension}%].
3. Vận dụng (VD): [${levelApplication}%].
###6. Định dạng điểm cho mỗi câu hỏi:
1. Điểm mỗi câu Nhiều lựa chọn: [${pointsMultipleChoice} điểm/câu].
2. Điểm mỗi câu Đúng-Sai (gồm 4 ý nhỏ): [${pointsTrueFalse}].
3. Điểm mỗi câu Trả lời ngắn: [${pointsShortAnswer} điểm/câu].
4. Điểm cho các câu Tự luận: [${pointsEssay}].

##2. THÔNG TIN CÁC CHỦ ĐỀ VÀ TRỌNG SỐ
${topicsString.trim()}
###5. (Thêm các chủ đề khác nếu cần)

#3. HƯỚNG DẪN THỰC HIỆN
Hãy thiết kế một “Ma trận đề kiểm tra định kì” hoàn chỉnh. Quá trình thiết kế phải tuân thủ tuyệt đối các quy trình tính toán và yêu cầu về cấu trúc dưới đây.

##1. QUY TRÌNH TÍNH TOÁN VÀ PHÂN BỔ TỰ ĐỘNG
###1. Tính tổng số tiết: Tính Ttổng​ = ∑(Thời lượng giảng dạy của từng chủ đề).
###2. Tính trọng số và phân bổ điểm cho từng chủ đề:
####1. Trọng số của Chủ đề i được tính bằng công thức: Wi​(%) =​ (Số tiết Chủ đề i​/Ttổng)×100%
####2. Tổng điểm cho Chủ đề i được tính bằng công thức: Si​ = Wi​ × Tổng điểm bài kiểm tra
####3. Làm tròn điểm Si​ đến 0.25 hoặc 0.5 để đảm bảo tính khả thi khi chia điểm.
###3. Phân bổ điểm TN/TL cho từng chủ đề:
####1. Dựa vào tổng điểm Si​ của mỗi chủ đề, phân bổ điểm cho hai phần Trắc nghiệm (Si,TN​) và Tự luận (Si,TL​) sao cho tổng điểm của các cột TN và TL khớp với cơ cấu điểm đã cho ở mục #2.##1.###4.
####2. Ưu tiên phân bổ điểm tự luận trước (thường là các câu hỏi vận dụng ở các chủ đề quan trọng), sau đó phân bổ điểm trắc nghiệm.
###4. Phân bổ điểm theo mức độ nhận thức (NB, TH, VD) trong từng chủ đề:
####1. Với mỗi chủ đề, phân bổ điểm Si,TN​ và Si,TL​ vào 3 cột mức độ Nhận biết, Thông hiểu, Vận dụng theo tỉ lệ chung [${levelKnowledge}% NB, ${levelComprehension}% TH, ${levelApplication}% VD].
####2. Điều chỉnh linh hoạt để điểm số phù hợp với đặc thù kiến thức của chủ đề và định dạng điểm của câu hỏi.
###5. Quy đổi điểm ra số câu hỏi:
####1. Dựa vào "Định dạng điểm cho mỗi câu hỏi" ở mục #2.##1.###6, tính toán số lượng câu hỏi cho từng ô trong ma trận.
####2. Ví dụ: Nếu ô "Nhiều lựa chọn - Nhận biết" của Chủ đề 1 được phân bổ 0.75 điểm, và mỗi câu nhiều lựa chọn là 0.25 điểm, thì số câu hỏi ở ô này là 0.75/0.25=3 câu.
####3. Thực hiện làm tròn toán học và điều chỉnh hợp lý để "Tổng số câu" và "Tổng số điểm" ở các hàng và các cột cuối cùng khớp chính xác với dữ liệu đầu vào.

##2. CẤU TRÚC BẢNG MA TRẬN
Bảng ma trận gồm 6 cột chính:
###1. STT.
###2. Chủ đề/Chương.
###3. Nội dung/Đơn vị kiến thức.
###4. Mức độ đánh giá: Chia thành 2 cột lớn là TNKQ và Tự luận.
####1. Trong TNKQ, có 3 loại: "Nhiều lựa chọn", "Đúng - Sai", "Trả lời ngắn". Mỗi loại lại được chia thành 3 cột nhỏ: "Biết", "Hiểu", "Vận dụng".
####2. Trong Tự luận, có 3 cột nhỏ: "Biết", "Hiểu", "Vận dụng".
###5. Tổng: Gồm 3 cột nhỏ: "Biết", "Hiểu", "Vận dụng" để tổng hợp số điểm của từng mức độ.
###6. Tỉ lệ % điểm.
####1. Các dòng của ma trận tương ứng với từng chủ đề và các đơn vị kiến thức bên trong.
####2. Cuối bảng, phải có các dòng tổng kết: “Tổng số câu”, “Tổng số điểm”, và “Tỉ lệ %” cho từng cột.

#4. YÊU CẦU KẾT QUẢ
##1. Định dạng kết quả đầu ra là một bảng tính Excel theo đúng mẫu ma trận số câu hỏi đã mô tả ở trên và trong Công văn 7991.
##2. Cấu trúc bảng phải giống hệt file mẫu, tuyệt đối không thay đổi thứ tự hay tên gọi các cột.
##3. Tất cả các số liệu (số câu, điểm số, tỉ lệ %) phải được tính toán chính xác và khớp với nhau ở các hàng và cột tổng cộng.
##4. Ma trận phải phản ánh đúng năng lực cần đánh giá của học sinh theo Chương trình Giáo dục phổ thông 2018.
        `;

        outputPromptTextarea.value = finalPrompt.trim();
        resultContainer.style.display = 'block';
        outputPromptTextarea.style.height = 'auto';
        outputPromptTextarea.style.height = (outputPromptTextarea.scrollHeight) + 'px';

    });

    copyBtn.addEventListener('click', () => {
        outputPromptTextarea.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Đã sao chép!';
        setTimeout(() => {
            copyBtn.textContent = 'Sao chép Prompt';
        }, 2000);
    });
});
