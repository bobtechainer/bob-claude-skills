# Luồng hỏi lại — đọc trước, gợi ý sau, luôn giao bản báo cáo

## Luật trung tâm

**Một yêu cầu báo cáo luôn kết thúc bằng một file trong tay người hỏi.**

Câu hỏi **đi kèm** bản báo cáo, không thay nó. Thiếu thông tin thì suy mặc định hợp lý nhất, dựng bản báo cáo theo mặc định đó, **nói rõ đã giả định gì**, rồi hỏi. Người hỏi nhận được thứ dùng được ngay và chỉnh một câu là xong.

Đây là chỗ RED sập nặng nhất: **5 trên 5 bản thử kết thúc tay không.** Ba bản có câu hỏi tốt nhưng đặt ở cuối, sau hai mươi lời gọi công cụ. Một bản còn tự đề nghị dựng khung báo cáo trống rồi không dựng — nên giáo viên phải đi thêm một vòng.

Kết thúc bằng chat không phải một kết thúc được phép.

---

## Ba mảnh cần có

| Mảnh | Là gì | Suy mặc định thế nào nếu thiếu |
|---|---|---|
| **Phạm vi** | Lớp nào, môn nào, một em, một khối, cả trường | `get_schedule()` → lớp người đó đang dạy tuần này. Một lớp thì lấy luôn. Nhiều lớp thì lấy lớp có hoạt động nhiều nhất trong cửa sổ, và nói rõ đã chọn lớp nào |
| **Khoảng thời gian** | Tuần nào, tháng nào, kỳ thi nào | "tuần này" → thứ Hai đến hôm nay. "tuần vừa rồi" → thứ Hai đến Chủ nhật tuần trước. Không nói gì → 7 ngày gần nhất **có hoạt động**, không phải 7 ngày trống |
| **Ai đọc** | Tự xem, gửi tổ, họp phụ huynh, gửi Phòng, gửi một phụ huynh | Mặc định là **người hỏi tự xem** — nêu tên em cụ thể được phép. Xem mục quyền riêng tư bên dưới |

Đủ ba mảnh thì **dựng luôn, không chặn**. Thiếu mảnh nào thì vẫn dựng, kèm dòng giả định, kèm câu hỏi.

---

## Đọc dữ liệu TRƯỚC khi hỏi

Đây là điều khiến câu hỏi có ích thay vì làm người ta mệt. Không bao giờ hỏi "anh/chị muốn những chỉ số nào?" — người hỏi không biết hệ thống có gì.

Thứ tự luôn là: **định hướng → đọc thật → gợi ý cụ thể → dựng**.

```
1. get_schedule()                      ai đang hỏi, dạy lớp nào, tuần này có tiết nào
2. list_teacher_classes()              các lớp thấy được, kèm lớp bộ môn cùng tên
3. run_reads([...])                    4 chỉ số trên cửa sổ đã suy, gộp một lượt
4. run_reads([...])                    cùng 4 chỉ số trên cửa sổ liền trước, để có delta
```

Bốn lời gọi này rẻ và chúng biến câu hỏi chung chung thành câu hỏi có số. So sánh:

> ~~Thầy/cô muốn báo cáo gồm những chỉ số nào?~~

> Lớp 6a2 Toán trong khoảng 31/08–06/09 có một nhiệm vụ đã quá hạn — 21 trên 22 em chưa nộp — và không có bài kiểm tra nào nộp trong tuần. Số liệu điểm danh của lớp đang lỗi nên tôi để riêng ra.
> Tôi dựng bản báo cáo xoáy vào nhiệm vụ, kèm danh sách 21 em chưa nộp. Nếu thầy/cô cần cả bài kiểm tra thì mở rộng ra một tháng sẽ có 12 phòng thi trong tháng 8 — nói một câu là tôi dựng lại.

Câu thứ hai không hỏi gì cả mà vẫn để người đọc chỉnh được, và họ đã có bản báo cáo trong tay.

---

## Gợi ý chỉ số theo vai

Mặc định theo vai, chọn từ những gì `01-du-lieu-ths.md` nói là đọc được thật. Đề xuất bộ này, đừng bắt người hỏi tự nghĩ ra.

### Giáo viên bộ môn — một lớp, một môn

1. Nhiệm vụ trong tuần: giao mấy cái, bao nhiêu em nộp đúng hạn, cái nào cả lớp cùng bỏ
2. Phòng thi trong tuần: mỗi phòng bao nhiêu lượt nộp, trung bình, cao nhất, thấp nhất, bao nhiêu em đạt
3. Em cần theo dõi: tụt điểm hoặc bỏ nhiệm vụ, kèm việc làm tiếp cho từng em
4. So với tuần trước, ba chỉ số trên
5. Chuyên cần — **chỉ khi số liệu qua được cửa chốt**

### Giáo viên chủ nhiệm — một lớp, nhiều môn

Bắt buộc quét sang các lớp bộ môn cùng tên; lớp chủ nhiệm không giữ nhiệm vụ và tiết học.

1. Bức tranh chung: mỗi môn một dòng — nhiệm vụ đã nộp, điểm trung bình phòng thi
2. Em cần quan tâm, gộp qua các môn, sắp theo số môn có vấn đề
3. Nhiệm vụ quá hạn còn mở, theo môn
4. Chuyên cần — **chỉ khi qua cửa chốt**
5. Nếu để họp phụ huynh: một trang riêng cho từng em, không nêu tên em khác

### Tổ trưởng chuyên môn — một môn, nhiều lớp

1. Xếp cạnh nhau các lớp cùng môn: trung bình phòng thi, tỉ lệ nộp nhiệm vụ
2. Lớp nhô lên và lớp tụt xuống, kèm mức chênh
3. Nhiệm vụ nào cả nhiều lớp cùng bỏ — dấu hiệu bài quá khó hoặc giao chồng
4. **Phổ điểm chỉ dựng khi sổ lớp ≤ 50 em** và phải ghi là do skill tự quét
5. **Câu sai nhiều nhất: từ chối tường minh** — hệ thống chưa có công cụ đọc phòng thi

### Ban giám hiệu — cấp trường

1. Chọn đúng dòng trường mình trong `get_school_overview`, in năm học của nó
2. Xếp cạnh nhau các lớp đã đọc — **kèm câu `n lớp đã kiểm tra trên tổng 264`**, không nói "toàn trường" nếu chưa đếm hết
3. Nhiệm vụ quá hạn còn mở, gộp theo khối
4. Em cần hỗ trợ, gộp theo lớp
5. Việc hệ thống đang chặn báo cáo — để nhà trường biết cần yêu cầu gì

### Phụ huynh hoặc học sinh tự xem — một em

1. Nhiệm vụ: đã làm, đang làm, quá hạn chưa làm
2. Điểm từng lượt nộp, theo thời gian — **loại các dòng không có khoá `percent`**, nói rõ đã loại mấy dòng
3. Chuyên cần — dùng `absent_dates`, **không** dùng `marked_periods`
4. Một đoạn nói con đang ổn ở đâu, đang vướng ở đâu, và ở nhà làm gì được

Với một em, hai cửa chặn cứng ở `01-du-lieu-ths.md` mục 6 phải chạy trước: nhiều lớp chủ nhiệm thì hỏi lớp nào; vai người hỏi lệch phạm vi token thì nói ra trong hai câu đầu.

---

## Khi nào ĐƯỢC chặn

Chỉ hai trường hợp. Ngoài hai cái này, luôn giao bản báo cáo.

**1 · Một em có nhiều hơn một lớp chủ nhiệm.** `get_student_profile` trả về nhiều lớp thì dừng và hỏi lớp nào, trước khi đọc theo lớp. Tự chọn im lặng là dựng báo cáo về một em ở một lớp có thể không phải lớp của em — sai kiểu không sửa được sau.

**2 · Vai người hỏi lệch phạm vi token.** Phụ huynh hỏi nhưng đang chạy token quản trị trường thì nói phạm vi token ra **trước khi trích số nào**, rồi hỏi có tiếp không.

Cả hai đều là chuyện đúng-người, không phải chuyện đúng-số. Đoán sai thì bản báo cáo không cứu được.

---

## Số câu hỏi, và đặt ở đâu

**Tối đa ba câu.** Chưa đếm được thì không hỏi thêm.

Chỗ đặt tuỳ tình huống:

- **Yêu cầu mơ hồ** — không nêu lớp, không nêu kỳ thi, không rõ trực tuyến hay trên giấy → câu hỏi nằm trong **năm dòng đầu**, trước mọi phát hiện. Người hỏi thấy ngay là mình cần nói thêm gì.
- **Yêu cầu đủ mảnh** → không hỏi trước. Bản báo cáo ra, và **một dòng ở cuối**: thiếu chỉ số nào thì nói, tôi dựng lại.

Câu hỏi phải kèm phương án đã đề xuất sẵn, để người hỏi bấm một cái là xong chứ không phải tự nghĩ. Dạng đúng:

> Báo cáo này đọc trước cả hội trường, hay in phát riêng từng phụ huynh? Nó quyết định có nêu tên em cụ thể hay không. Tôi đang dựng theo hướng **in riêng từng em** — nếu đọc chung thì tôi đổi sang dạng chỉ có số đếm.

---

## Dòng giả định

Mỗi giả định đã dùng phải hiện **trong trang**, không phải chỉ trong chat. Đặt ngay dưới dòng cửa sổ thời gian:

```
Đã giả định: "tuần vừa rồi" là 31/08–06/09 · lớp 6a2 Toán (lớp thầy/cô có tiết nhiều nhất tuần đó)
· báo cáo để thầy/cô tự xem, nên có nêu tên em
```

Ba lý do phải nằm trong trang: người đọc sau này không có đoạn chat; bản in ra giấy càng không; và ai chuyển file cho người khác thì giả định phải đi theo file.

---

## Vòng chỉnh lại

Người hỏi nói thiếu chỉ số nào thì **dựng lại cả trang, ghi vào cùng đường dẫn file cũ**, đừng ghi file mới. Họ đã gửi đường dẫn đó cho người khác rồi.

Nói một dòng đã đổi gì:

> Đã thêm phần chuyên cần và mở cửa sổ ra 01/08–07/09. Cùng đường dẫn, mở lại là thấy.

---

## Việc không hỏi

Đừng hỏi những thứ đọc được. Mỗi câu hỏi dưới đây đều có một lời gọi trả lời thay:

| Đừng hỏi | Đọc ở đâu |
|---|---|
| Thầy/cô dạy lớp nào? | `list_teacher_classes()` |
| Lớp có bao nhiêu em? | `get_class_roster()`, đếm `role=="student"` |
| Tuần này có tiết nào? | `get_schedule()` |
| Lớp có bài kiểm tra nào chưa? | `get_class_exam_summary()` |
| Trường đang ở năm học nào? | `lookup_reference(kind="school_year")` |
| Có em nào đang tụt không? | `find_at_risk_students()` |

Ngược lại, có ba thứ **không** đọc được và phải hỏi khi cần: **biên ngày của học kỳ** (`lookup_reference` không có loại `term`), **ai sẽ đọc bản báo cáo**, và **kỳ thi nào** khi người hỏi nói "kỳ thi vừa rồi" mà có nhiều phòng thi trong cửa sổ.

---

## Quyền riêng tư — mặc định theo người đọc

Tên đầy đủ của học sinh chỉ hiện khi **đơn vị phân tích đúng là từng em**. Ngoài ra dùng số đếm hoặc tên che.

| Ai đọc | Tên học sinh |
|---|---|
| Người hỏi tự xem | Hiện đầy đủ |
| Gửi tổ chuyên môn, gửi Ban giám hiệu | Chỉ số đếm; cần nêu tên thì tách thành phần phụ lục riêng |
| Đọc chung trước cuộc họp phụ huynh | Chỉ số đếm, không tên |
| In riêng cho từng phụ huynh | Chỉ tên con họ; các em khác thành số đếm |
| Học sinh tự xem | Chỉ chính em đó |

Có tên trùng trong sổ lớp — `Chu Minh Anh` hai lần, `Doãn Hà Anh` hai lần — nên khi hiện tên phải kèm `code` để phân biệt, và khoá mọi bảng theo `student_id`.

Và một luật về giọng, không phải về quyền: học sinh điểm thấp gắn nhãn **cần theo dõi** hoặc **cần hỗ trợ**, không gắn `yếu`/`kém`, trừ khi đang trích đúng tên một khoảng điểm của nhà trường.

---

## Chuyện không có dữ liệu

Khi cửa sổ trả về rỗng, hoặc dữ liệu không qua được cửa chốt, **bản báo cáo vẫn ra** — cùng khung, cùng các mục, mỗi chỉ số ghi `chưa có dữ liệu` kèm số thô làm bằng.

Điều này quan trọng vì tự nó là một câu trả lời có ích: giáo viên biết được tuần đó lớp không có hoạt động nào trên hệ thống, và biết được vì sao. Một trang có sáu mục cùng ghi "chưa có dữ liệu, đây là số thô hệ thống trả về" **hữu ích hơn** một đoạn từ chối trong chat, vì nó gửi được cho quản trị.

Và đường không-có-dữ-liệu bị soi **chặt bằng** đường có dữ liệu. Mọi câu chẩn đoán cũng phải truy được về một lời gọi và một tên trường. Xem `01-du-lieu-ths.md` mục 9 — đây là chỗ cả năm bản RED đều sập.
