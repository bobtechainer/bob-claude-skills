# Viết cho rõ khi dữ liệu có chỗ lạ

## Điều phải hiểu trước

Dữ liệu Trường học số ở môi trường phát triển **có nhiều chỗ vô lý, và đó là chuyện bình thường**. Một trường cấp hai có lớp 12. Một em đứng tên ở hai mươi lớp. Bài tập tên "ddcd". Sổ lớp có ba em cùng tên.

**Những chỗ đó không phải chủ đề của bản báo cáo.** Việc của bản báo cáo vẫn là một việc duy nhất: trả lời câu người dùng hỏi, cho họ đọc hiểu và làm được việc họ cần.

File này chỉ chứa **bốn luật không nằm trong hợp đồng trang** của `SKILL.md`. Chúng là bốn cách dữ liệu lạ làm câu văn hỏng.

---

## 1. Chỗ trống là *chưa đọc được*, không phải *không có*

> Hỏng: *"Từ thứ Hai đến thứ Sáu, hai lớp chưa được xếp tiết nào"* → *"thầy chưa có chỗ gặp lớp để nhắc bài."*

Thầy chủ nhiệm gặp lớp mỗi ngày. Thời khoá biểu trống chỉ có nghĩa là chưa ai nhập.

Viết *"trong khoảng này hệ thống chưa có tiết nào của lớp"*, không viết *"lớp không có tiết"*. Và **đừng suy ra việc-làm-tiếp từ một chỗ trống**.

## 2. Không giao việc dựa trên thứ mình vừa nói là không tin được

> Hỏng: *"…không rút một kết luận điểm nào theo lớp"* — rồi câu sau: *"Trong 13 phòng thi thì 2 phòng chưa chấm."*
>
> Hỏng: *"trang chưa dám khẳng định đây đúng là cháu nhà mình"* — rồi: *"anh/chị có thể hỏi cháu tối nay."*

Số thì cứ đưa, kèm một câu nói rõ nó chưa chắc. Nhưng **đừng gắn việc-làm-tiếp vào nó**. Người đọc làm theo rồi mới biết sai thì mất lòng tin cả bản.

## 3. Đừng giao việc mà người đọc không làm được

> Hỏng: *"Thầy vẫn gặp lớp 6a2 ở môn Hóa học chiều Chủ nhật tiết 10, nên có thể nhắc bài Toán ngay trong hai buổi đó."*

Người nhận dạy Toán, trường không dạy Chủ nhật, và lớp 6 chưa tách môn Hoá.

Dữ liệu ghi tiết Chủ nhật thì cứ ghi vào bảng. Nhưng khi lịch trông lạ, viết việc-làm-tiếp **không phụ thuộc lịch**: *"nhắc các em ở tiết gần nhất"*, thay vì chỉ đích danh một buổi mình không chắc có.

## 4. Khoảng đo chạm nghỉ hè

Khoảng đo chạm tháng 6, 7, hoặc nửa đầu tháng 8 thì nói ngay tại chỗ con số: *"khoảng này gồm cả kỳ nghỉ hè nên số thấp là bình thường"*.

Và **không rút xu hướng tăng hay giảm qua một khoảng có nghỉ hè**. Đường cong đó là lịch nghỉ, không phải nhịp làm việc của ai. Muốn nói xu hướng thì cắt khoảng lại cho nằm hẳn trong năm học.

Một câu cảnh báo ở mục trên **không cứu được** một câu rút xu hướng ở mục dưới — đó là lỗi thật, `scripts/check_thuc_te.py` chặn mã `XU_HUONG_QUA_HE`.

---

## Máy làm được phần nào

`scripts/check_thuc_te.py` chặn luật 4 và một phần luật số 0 của hợp đồng trang. `scripts/check_voice.py` chặn tiếng của máy lọt ra thân bài.

**Ba luật còn lại ở file này máy không bắt được đáng tin** — chúng cần đọc hiểu, nên chúng thuộc về `agents/qa-04-nguoi-doc.md`. Đã thử bốn lần bắt máy đoán nghĩa và cả bốn lần đều sai; chi tiết ở `references/09-bang-chung.md`.
