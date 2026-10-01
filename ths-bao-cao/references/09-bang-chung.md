# Vì sao luật lại như vậy

File này là **kho bằng chứng**, không phải hướng dẫn làm việc. Đọc nó khi bạn định bỏ một luật, đổi một luật, hay thắc mắc vì sao luật lại kỳ cục như thế. Dựng báo cáo thì không cần mở file này.

Mọi câu trong ngoặc kép là nguyên văn của một người đọc bị cắt ngữ cảnh — họ chỉ nhận một file HTML và một vai, không biết gì về cách bản đó được làm ra.

---

## Cách đo

Bảy vòng. Mỗi vòng: sáu vai tự gõ yêu cầu như người thật, dựng ra sáu bản báo cáo; rồi sáu người đọc **mới** mở file và trả lời đúng hai câu — *có hiểu không* và *đạt bao nhiêu phần mục đích*.

| Vòng | Trung bình | Trần | Sàn | Dùng thật được |
|---|---|---|---|---|
| 1 | — | — | — | 0/6 |
| 2 | — | — | — | 0/6 |
| 3 | 72 | 80 | 60 | 6/6 |
| 4 | 77 | 80 | 70 | 6/6 |
| 5 | 71 | 80 | 50 | 6/6 |
| 6 | 70 | 82 | 55 | 6/6 |

**Trần đứng yên, sàn sụp.** Đây là phát hiện quan trọng nhất của cả bảy vòng, và nó nói về skill chứ không nói về báo cáo.

Từ vòng 4 sang vòng 6, `SKILL.md` phình từ 223 lên 322 dòng, 4.911 từ, 24 chỉ thị đánh số. Điểm cao nhất không đổi (80 → 80 → 82) nhưng điểm thấp nhất rơi từ 70 xuống 50. Thêm luật **không làm bản tốt tốt hơn — nó làm bản tệ trở nên có thể xảy ra**, vì agent không giữ nổi 24 chỉ thị cùng lúc với việc đọc dữ liệu và dựng trang, và mỗi agent buông một nhóm luật khác nhau.

Ba giả thuyết khác đã kiểm và trượt, tính trên 18 bản:

| Giả thuyết | Tương quan với điểm |
|---|---|
| Báo cáo dài ra | −0,10 |
| Nhiều câu rào hơn | −0,29 |
| Nhiều câu hơn | +0,03 |

Không thuộc tính nào của **bản báo cáo** giải thích được điểm. Thứ giải thích được là **độ phân tán**: sáu agent đọc cùng một skill viết ra sáu bản dài ngắn chênh nhau 2,5 lần, và khoảng điểm trong một vòng giãn từ 10 lên 30.

Đây đúng là hiện tượng `/writing-skills` gọi tên: *"Variance is a metric. Five different interpretations across five reps means the wording isn't binding — tighten the form before adding words."*

---

## Hai luật đã đo bằng bộ thử nhỏ có đối chứng

Cách đo ở `SKILL.md` mục *"Thử một luật thế nào"*. Mỗi lần: một lỗi cụ thể, một việc nhỏ, dữ liệu thật đóng băng, hai nhánh nhận y hệt nhau, sáu lần lặp mỗi nhánh.

### GỠ · "Con số trong tiêu đề phải mang mẫu số ngay tại đó"

| | Đối chứng | Có luật |
|---|---|---|
| Số từ mỗi tiêu đề | 10,6 | **26,0** |
| Tiêu đề dài nhất | 16 từ | **47 từ** |
| Cảnh báo phạm vi nằm ở câu mở | **6/6** | 4/6 |

Hai phân bố không chồng lấn: đối chứng cao nhất 13,0, nhánh có luật thấp nhất 20,8.

**Đối chứng vốn đã viết đúng** — cả sáu lần đều tự đặt câu *"13 lớp là mẫu chọn tay, chưa phải toàn trường"* vào câu mở đầu. Luật không chữa gì mà làm tiêu đề dài gấp hai rưỡi. Đã gỡ.

### GIỮ · Luật câu mở đầu

Bốn gạch đầu dòng ở phần 1 của hợp đồng trang: nói được một việc làm được · việc gấp nhất đứng trước · câu đổi việc nằm ở đây · câu không đổi việc nằm ở mục nguồn.

| | Đối chứng | Có luật |
|---|---|---|
| Mở bằng rào đón (*"Kính gửi…"*, *"Đây là báo cáo…"*) | **6/6** | **0/6** |
| Việc gấp bắt đầu ở đâu trong câu | **48%** | **7%** |
| Số từ mỗi câu | 45,5 | 36,5 |
| Sáu lần lặp hội tụ về cùng một mở đầu | 2/6 | **5/6** |

Không chồng lấn: đối chứng sớm nhất 41%, nhánh có luật muộn nhất 11%.

Đối chứng **có** mắc lỗi — cả sáu lần đều chôn việc gấp vào nửa sau câu, sau lời chào và con số tổng kết. Luật chữa được cả sáu, làm câu ngắn đi, và sáu lần lặp hội tụ về cùng một hình dạng. Đây là dấu hiệu `/writing-skills` gọi là câu chữ đã ràng buộc được.

**Đây là luật đầu tiên trong cả bộ có bằng chứng có đối chứng rằng nó đáng tồn tại.** Đừng sửa câu chữ của nó mà không đo lại.

---

## Bảng soát luật bằng bộ thử có đối chứng

Năm luật đã đo. Mỗi luật: một việc nhỏ, dữ liệu thật đóng băng, nhánh A không có luật, nhánh B có nguyên văn luật, sáu lần lặp mỗi nhánh.

| Luật | Đối chứng có mắc lỗi? | Luật chữa được? | Giá phải trả | Phán quyết |
|---|---|---|---|---|
| Câu mở đầu | **6/6 chôn việc gấp** | 6/6 đưa lên đầu | câu ngắn đi | **GIỮ** |
| `mauSo` | 25% dòng thiếu mẫu số | 100% dòng đủ | dài thêm 11% | **GIỮ** |
| Điều đáng nói nhất viết cho rõ | 2/6 viết mờ | 6/6 viết rõ | không, còn ngắn hơn | **GIỮ** (bằng chứng yếu hơn) |
| Tít không trách ai khi thân bài gỡ tội | **1/6** | 6/6 | không đáng kể | **GỠ** — 1/6 không phân biệt được với nhiễu |
| Con số trong tiêu đề mang mẫu số | **0/6** | làm tệ hơn: tiêu đề dài gấp 2,5 | rất đắt | **GỠ** |
| Mục tự nói vô ích thì không phải mục | **4/6 dựng thành mục riêng** | 0/6 · khối gộp 6/6 | không | **GIỮ** |
| Một cách đối xử với số 0 | **giải thích 0,2/2 dòng** | 1,7/2 dòng | không | **GIỮ** |
| Việc-làm-tiếp có tên người | 11% dòng thiếu tên | 100% có tên | không | **GIỮ** (bằng chứng vừa phải) |
| Không dựng lời khen từ số xấu | **0/6** | không cần chữa | — | **GỠ** |

### Hai chỗ phép thử này còn yếu, ghi lại để ai sau còn biết

**Bối cảnh trong bộ thử dễ hơn ngoài đời.** Agent chỉ nhận năm dòng số liệu và một việc nhỏ, trong khi dựng báo cáo thật thì nó phải giữ hai trăm dòng dữ liệu cùng hai mươi luật khác. Luật nào đo ra "đối chứng tự làm đúng" thì đúng **trong bối cảnh dễ**; nếu lỗi tái diễn ở vòng đầy đủ thì phải dựng lại phép thử khó hơn chứ đừng vội kết luận luật vô dụng.

**Phép thử `tenNguoi` bị lộ đáp án.** Dữ liệu đóng băng ghi thẳng *"6a1 Toán — tài khoản truonghaiyen"*, tức là đã nói hộ agent rằng đó là tên tài khoản. Nên vế "nhận ra tên tài khoản" của luật đó **chưa thật sự được kiểm**. Vế còn lại — việc-làm-tiếp phải có tên người — thì đo được: 89% lên 100%.

### Ba điều học được từ bảng này

**Luật nghe càng hợp lý càng phải đo.** Hai luật bị gỡ đều sinh ra từ lời chê thật của người đọc thật, và cả hai đều vô dụng hoặc có hại. Lời chê nói đúng chỗ đau, nhưng không nói đúng cách chữa.

**Chẩn đoán vòng 6 của tôi SAI.** Tôi kết luận khoá `mauSo` đẻ ra loại câu dặn *"hai con số này khác nhau, đừng cộng lại"*. Đo ra thì **nhánh đối chứng cũng viết câu dặn** — trung bình 0,5 câu mỗi lần, còn nhánh có luật là 0,2. Agent tự viết câu dặn khi gặp hai con số đụng nhau, bất kể có luật hay không. Luật `CAU_DAN_THAY_VI_SUA` vẫn đáng giữ, nhưng lý do tôi ghi cho nó thì sai.

**Một dấu hiệu cần theo dõi:** nhánh có `mauSo` mắc 1 lỗi số học trong 6 lần (*"22 em còn lại"* trong khi đúng là 21), nhánh đối chứng 0/6. Sức ép phải nhắc mẫu số ở mọi dòng có thể làm người viết lẫn số. Một mẫu thì chưa kết luận được — đo lại nếu thấy tái diễn.

---

## Ba luật đã bị bác và phải bỏ

### 1 · Giấu tên khi sổ lớp có tên trùng — bỏ ở vòng 3

Luật cũ: sổ lớp có nhiều tên gần giống nhau thì đưa số đếm, đừng đưa danh sách tên.

> *"Không cho tên em nào, đẩy việc về lại cho tôi. Tôi vẫn phải mở sổ lớp dò tay mới biết hôm sau gọi ai."*
>
> *"Cái tôi cần nhất — tên em nào chưa nộp — thì không có."*
>
> *"Em vẫn phải tự dò trong app."*

### 2 · Giấu tên khi bản gửi ra ngoài trường — bỏ ở vòng 5

Sau khi bỏ luật 1, tôi đặt lại cùng một ngoại lệ ở chỗ khác. Hiệu trưởng cho **50 điểm**, thấp nhất cả vòng:

> *"Bản báo cáo tự chọn hộ tôi người đọc. Số để làm ra danh sách đó thì có sẵn, nhưng nó đẩy việc tra tên về phía tôi. Không có tên một em nào, mà đây mới là thứ tôi cần để gọi trong buổi họp."*

**Bài học chung:** người **xin** báo cáo là người làm việc từ nó, không phải người nhận cuối. Hiệu trưởng cầm bản này đi họp hội đồng rồi mới soạn cái gửi Phòng. Cắt tên hộ họ là cắt đúng phần họ cần.

### 3 · "Chép mọi con số ra bảng rồi đối chiếu" — bỏ ở vòng 5

Luật bằng chữ, bảo người dựng tự soát trong đầu. Vòng 5 hỏng đúng y như vòng 4. Lý do: việc làm trong đầu không để lại dấu vết, nên bỏ qua được và đã bị bỏ qua. Thay bằng khoá `mauSo` bắt buộc trong khối JSON, máy chặn được.

---

## Từng luật, kèm câu đã làm nó ra đời

### Câu mở đầu

Bản hỏng: *"lớp 6a2 Toán đứng yên: bài giao 0, kiểm tra 0, tiết 0."* Số 0 của tiết học là do môi trường chỉ có tiết cuối tuần. Thầy đọc xong hiểu sai chính tuần dạy của mình.

Vòng 5, khi chỉ số được hỏi đã chết mà câu mở lại bắt đầu bằng lời xin lỗi:

> *"Tôi hỏi bài nợ, câu đầu tiên lại nói về cái không dùng được; việc gấp nhất bị đẩy xuống cuối đoạn."*

### Việc-làm-tiếp

Bản bảo thầy *"hỏi năm em ở đầu tiết Toán xem đã mở bài chưa"* — trong khi lời giải nằm ngay ở bảng cuối trang của chính nó.

Bản bảo giáo viên Toán gặp lớp ở *"tiết Hoá chiều Chủ nhật"*.

Vòng 4, bản gửi học sinh: *"em có thể làm y như vậy với ba bài Toán đang nợ"* — bảng ngay dưới viết *"hạn nộp đã đóng thì tự em bấm nộp cũng không ăn thua"*.

Vòng 5, tổ trưởng:

> *"Bảo tôi làm mà không cho tôi người. Ba việc đều phải có người đứng tên trong biên bản họp. Có hai lớp thôi mà cũng không ghi giúp tôi ai đang dạy."*

### Thứ tự theo mức gấp

> *"Nhìn bảng thì tưởng bài ngày mai là nhẹ nhất."* — bảng sắp theo số ngày quá hạn nên bài hết hạn ngày mai rơi xuống đáy.

### Câu chặn cả bản

Vòng 3, câu *"hai sổ lớp chồng nhau 11 em nên chưa xếp được lớp nào hơn lớp nào"* nằm mãi ở mục 5:

> *"Bốn mục đầu tôi đọc với giả định sai, phải quay ngược lên."*

Vòng 6, câu đổi nghĩa mọi con số phía dưới bị chôn trong năm gạch đầu dòng của khối đầu trang:

> *"Câu này phải nằm ngay cạnh tiêu đề, không nên chôn trong danh sách chung với mấy chuyện kỹ thuật."*

### Tít

Hỏng theo chiều hứa: tít *"Số bài quá hạn đã giảm từ 11 xuống 2"*, ngay dưới *"hai khoảng không so thẳng với nhau được"*. Và *"Con nộp bài rất đều: 50 lượt trong ba tháng, rải ra 8 ngày"* — 50 lượt dồn vào 8 ngày là làm dồn cục.

Hỏng theo chiều trách, vòng 6: tít *"6a1 Toán chưa có dấu vết nào trên hệ thống trong tháng 8"*, đoạn dưới *"tháng 7 và tháng 8 đều nằm trong kỳ nghỉ hè nên con số thấp là bình thường và không phải điểm trừ của ai"*. Người lướt tít chỉ đọc vế trách.

### Lời khen từ một con số xấu

Bản gửi phụ huynh: *"Mức cao nhất con đạt được là 50% và con đạt mức đó ở 8 lượt, nên đây là mốc có thể lấy ra khen con"* — trong khi 18 lượt còn lại là 0%.

### Mẫu số

Ba vòng liền, đây là lỗi bị chê nhiều nhất:

> Chủ nhiệm, vòng 5: *"Con số 38 in to làm tôi tưởng chỉ cần nhắn 38 phụ huynh"* — thật ra gần 70 em.
>
> Hiệu trưởng, vòng 6: *"Đọc lướt là tôi đã ghi 48 vào sổ tay rồi mới thấy dòng cải chính 48 là số dòng chứ chưa phải 48 em."*
>
> Học sinh, vòng 5: hai con số 18 cạnh nhau — *"đọc lần đầu em hiểu thành 36 lượt hỏng."*

### Câu dặn thay vì sửa

Vòng 6 sinh ra hẳn một loại lỗi mới, do chính khoá `mauSo` gây ra. Nó làm người viết **nhận ra** chỗ dễ lẫn, rồi họ xử lý bằng cách viết thêm một câu dặn:

> *"Con số 21 hiện ở hai chỗ trên trang với hai nghĩa khác nhau, nên đọc kỹ chỗ này một lần."*
>
> *"Hai cột đếm hai thứ khác nhau và không cộng được với nhau."*

Giáo viên bộ môn: *"Đã biết là dễ nhầm thì đổi cách gọi đi, đừng bắt người đọc gánh."*

### Nhãn phải khớp thứ nó đếm

Ô đề *"bài đã qua hạn"* mà chú thích bên dưới đếm bài **đã giao**. Tít *"Mỗi em Lớp 9A2 đang nợ từ hai bài trở lên"* trong khi mọi con số chỉ tính trên 43 em của 48.

### Con số chạm trần

Vòng 6, hiệu trưởng:

> *"Tiêu đề và ô chỉ số ghi 'trong 20 lớp bộ môn đã rà', trong khi đính chính lại nằm dưới chân biểu đồ, chữ nhỏ — mà ngay trên đó vừa ghi trường có 269 dòng lớp. Đọc nhanh là nói sai trước hội đồng."*

### Một cách đối xử với số 0

Chỗ này nói *"đừng đọc con số 0 đó thành điểm của mình"*, chỗ kia đếm thẳng *"18 lượt được 0%"* như điểm thật. Phụ huynh: *"đọc xong tôi không biết tin con số đó đến đâu."*

### Mục tự nói là vô ích

Giáo viên bộ môn, vòng 4: *"Hai mục liền giữa bài bắt tôi đọc rồi mới báo là vô ích."*

### Điều đáng nói nhất thì viết mờ

Vòng 6, ô chỉ số ghi *"Ở bốn bài giao gần nhất của lớp, em là người có bài nộp."* Em học sinh phải đọc thêm hai đoạn mới vỡ ra là cả lớp chỉ mình em nộp:

> *"Câu trên thiếu mất chữ duy nhất."*

### Tiếng của máy lọt ra thân bài

Hiệu trưởng đọc *"35 lớp bộ môn khối 6 đến khối 9 đã đọc"* và hiểu thành lớp đã đọc bài.

### Tên tài khoản thay tên người

Tổ trưởng, vòng 5: *"cô truonghaiyen đứng lớp"* — *"câu này tôi không đưa vào biên bản họp tổ được, phải sửa tay."*

---

## Bốn lần máy thử đoán nghĩa và sai

Ghi lại để không ai làm lại lần thứ năm. Chú thích đầy đủ nằm trong chính mã nguồn của từng script.

| Phép đo đã bỏ | Vì sao sai |
|---|---|
| Bôi đậm con số đáng lo | Thử hai cách, sai theo hai chiều ngược nhau. Không tách được nhãn số liệu với nhấn mạnh trong lời văn. |
| "công cụ" là từ lóng | *Kho công cụ* là tên một module có thật của Trường học số. |
| Hai con số mâu thuẫn | Báo "48, 22, 13 là mâu thuẫn" trong khi đó là sĩ số **ba lớp khác nhau**. |
| Nhánh `0 điểm` tràn | Trên DOM đã dựng, khoảng trắng bị gỡ nên một nhãn trục "0" và chữ "điểm" ở hai thẻ khác nhau dính vào nhau. |

**Luật rút ra:** phép đo chỉ được làm hai việc — **so từ vựng**, và **so sự đồng hiện trong cùng một câu**. Ví dụ đúng: `XU_HUONG_QUA_HE` chặn khi một câu vừa có từ chỉ xu hướng vừa dẫn tháng hè; phạm vi một câu nên không bắt oan. Mọi thứ cần đọc hiểu thì giao cho lăng kính người đọc.

---

## Ba lỗi nằm sẵn trong bản mẫu, tìm ra khi chạy thử tay

Cả ba đều đi lọt mọi phép đo, vì chúng hỏng ở chỗ máy không nhìn.

**Trang có thể trắng hoàn toàn.** Mọi khối để `opacity:0`, chỉ script mới gắn `.in` để mở ra. Script ném ngoại lệ giữa chừng là phần còn lại của trang biến mất trên màn hình — mà bản in vẫn đúng vì `@media print` ép `opacity:1`. Đã vá bằng một hoạt ảnh CSS mở mọi thẻ sau 2,5 giây, không cần script.

**Bảng tên dính cột.** `tableView` sinh ra `<table>` trần không mang lớp nào, và không luật CSS nào chạm tới nó. Mã học sinh dính vào tình trạng: `070199019899chưa nộp`.

**Dòng "điểm trung bình 0" không kèm lời giải thích**, nằm sẵn trong bản mẫu — đúng thứ học sinh và phụ huynh đọc thành *bị 0 điểm*.
