# Bảng nghiệm thu — copy sang `<thư-mục-báo-cáo>/qc/spec-matrix.md`

`scripts/qc_score.py` đọc file này. Giữ đúng năm cột, đúng thứ tự.

**Cột `Status`:** `✓` đã kiểm · `~` đã làm nhưng chưa kiểm · `✗` còn mở.
**Chỉ `✓` được tính vào độ hoàn thành.** `~` liệt kê riêng — **không bao giờ báo `~` là xong**.

**Cột `W`:** `5` yêu cầu cốt lõi (sai là bản báo cáo dắt người đọc đi sai) · `3` yêu cầu chống lưng · `1` mài giũa.

**Cột `Verify`:** ghi rõ ai chứng minh — `du-lieu:` lăng kính 1 · `giong:` lăng kính 2 · `hinh:` lăng kính 3 · `doc:` lăng kính 4 · `may:` một script.

Cửa mở khi: **độ hoàn thành 100%** và **không còn P0, P1 nào mở**.

---

## Phần cứng — mọi bản báo cáo đều có, không bỏ dòng nào

| ID | Requirement | Verify | W | Status |
|---|---|---|---|---|
| G01 | Yêu cầu báo cáo kết thúc bằng một file HTML trong tay người hỏi, kể cả khi không có dữ liệu | doc: file mở được | 5 | ✗ |
| G02 | Mỗi khối số mang cửa sổ **dội lại** từ phản hồi, không phải cửa sổ đã yêu cầu | du-lieu: 2.2 | 5 | ✗ |
| G03 | Không con số nào nằm dưới tiêu đề cửa sổ khác với cửa sổ sinh ra nó | du-lieu: 2.3 | 5 | ✗ |
| G04 | Mọi con số có `data-fig` khớp một mục trong khối JSON đồng hành | may: check_sidecar.py | 5 | ✗ |
| G05 | Danh sách dài bằng trần đều có câu nói rõ bị giới hạn; không từ chỉ lượng `toàn bộ`/`tất cả`/`duy nhất` trên chúng | du-lieu: 2.6 | 5 | ✗ |
| G06 | Trường `note` của phản hồi hiện nguyên văn cạnh số rút ra từ nó, trong thân trang | du-lieu: 2.7 | 3 | ✗ |
| G07 | Sĩ số là số dòng `role=="student"`; không in `_count`, `student_count`, hay độ dài mảng | du-lieu: 2.4 | 5 | ✗ |
| G08 | Khoá thiếu in `chưa chấm`/`chưa có điểm`, bị loại khỏi trung bình, và số dòng đã loại được nói ra | du-lieu: 2.5 | 5 | ✗ |
| G09 | Không in `class_name` từ `find_at_risk_students` hay `search_students` | du-lieu: 2.8 | 5 | ✗ |
| G10 | Giá trị trường `exam` mang chữ "phòng thi"/"ca thi", trừ khi khớp được trong `list_exams` | du-lieu: 2.9 | 3 | ✗ |
| G11 | Mọi câu so sánh kỳ trước có lời gọi thứ hai trong log, hai cửa sổ hiện trên trang, kèm nhãn tự-tính | du-lieu: 2.10 | 5 | ✗ |
| G12 | Câu `lớp không có X` có lời gọi trên mọi lớp bộ môn cùng tên, và trang liệt kê `class_id` đã hỏi | du-lieu: 2.11 | 5 | ✗ |
| G13 | Câu nói về cả lớp rút từ đọc từng em có in cỡ mẫu `đã tra n/N em` | du-lieu: 2.12 | 3 | ✗ |
| G14 | Cửa chốt chuyên cần: `present==0` khắp sổ lớp thì có bảng cảnh báo và **không** con số chuyên cần nào chỗ khác | du-lieu: 2.13 | 5 | ✗ |
| G15 | Mọi câu về nguyên nhân, cơ chế, bản chất dữ liệu đều có trường trả về chống lưng, hoặc ghi `chưa rõ nguyên nhân` | du-lieu: bước 3 | 5 | ✗ |
| G16 | Không phủ định về một khoảng ngày mà không có lời gọi phủ đúng khoảng đó | du-lieu: bước 3 | 5 | ✗ |
| G17 | Không tự mâu thuẫn: một con số một giá trị, một bộ dữ liệu một nhãn | du-lieu: bước 4 | 5 | ✗ |
| G18 | Khối đầu trang có: tên báo cáo, phạm vi, cửa sổ theo từng loại dữ liệu, dòng giả định, giờ đọc số liệu | doc: câu 2 | 5 | ✗ |
| G19 | Khối cuối trang "Số liệu lấy từ đâu" liệt kê công cụ + cửa sổ cho từng nhóm số, kèm các câu giới hạn | du-lieu: bước 1 | 3 | ✗ |
| G20 | Mục "Chưa dựng được, và vì sao" có mặt khi người dùng xin thứ hệ thống chưa cho | doc: câu 4 | 3 | ✗ |
| V01 | `check_voice.py` báo 0 lỗi chặn | may: check_voice.py | 5 | ✗ |
| V02 | Mỗi dòng nhận xét có đủ ba nhịp: sự việc kèm cửa sổ → nghĩa trong lớp → một việc làm tiếp | giong: 2.1 | 5 | ✗ |
| V03 | Việc làm tiếp thuộc tay người đọc, không lệch người | giong: 2.3 | 3 | ✗ |
| V04 | Nhãn `cần theo dõi`/`cần hỗ trợ` có câu nói ngưỡng và câu nói rõ đây không phải xếp loại | giong: 2.4 | 3 | ✗ |
| V05 | Không con số đáng lo nào được nhấn, đặt trước câu giải nghĩa, hay đặt trong đoạn "nếu làm bừa" | giong: 2.5 | 5 | ✗ |
| V06 | Bảng nhận xét không cùng một khuôn | giong: 2.2 | 1 | ✗ |
| V07 | Tiêu đề mục là câu nói ra điều người đọc sẽ thấy | giong: 2.6 | 1 | ✗ |
| V08 | Trang không tự giới thiệu mình | giong: 2.7 | 1 | ✗ |
| H01 | Mọi màu trên trang có mặt trong `04-mau-va-chu.md`; `validate_palette.js` không FAIL | hinh: bước 1 | 5 | ✗ |
| H02 | Cảnh báo tương phản có kênh cứu: nhãn số trực tiếp hoặc bảng song sinh | hinh: bước 1 | 5 | ✗ |
| H03 | Cửa 3 đúng: tên lớp/môn/học sinh cùng một màu; khoảng điểm và khối dùng dải đơn sắc | hinh: bước 2 | 5 | ✗ |
| H04 | Không quá 5 chuỗi phân loại; hình so mọi cặp không quá 3 khi thiếu nhãn trực tiếp | hinh: bước 2 | 3 | ✗ |
| H05 | Kích thước dấu đúng: cột ≤24px, bo 4px đầu dữ liệu vuông chân, đường 2px, nền vùng 10% | hinh: bước 3 | 3 | ✗ |
| H06 | Khe nền 2px và vành nền 2px làm việc phân cách; không viền quanh dấu | hinh: bước 3 | 3 | ✗ |
| H07 | `vector-effect="non-scaling-stroke"` trên lưới, trục, nét dữ liệu | hinh: bước 3 | 3 | ✗ |
| H08 | Chữ không mang màu dữ liệu | hinh: bước 4 | 5 | ✗ |
| H09 | Không nhãn nào bị cắt hay trào; không `overflow:hidden` trên đoạn cột | hinh: bước 4 | 5 | ✗ |
| H10 | **Mọi** biểu đồ có bảng song sinh chứa đủ giá trị | hinh: bước 5 | 5 | ✗ |
| H11 | Khi in, `details` bảng số liệu mở ra, không bị ẩn | hinh: bước 5 | 5 | ✗ |
| H12 | Khi in, hoạt ảnh hiện dần và hoạt ảnh vẽ đường đều mở bung — không thẻ nào in ra trắng | hinh: bước 6 | 5 | ✗ |
| H13 | `@page { size: A4 }`, `break-inside: avoid` trên thẻ và mục | hinh: bước 6 | 3 | ✗ |
| H14 | Hàng chỉ số 4–6 ô; đúng một số lớn mỗi trang; 3–6 hình mỗi trang | hinh: bước 7 | 3 | ✗ |
| H15 | Khung biểu đồ chừa cả dải nhãn trục — không thanh cuộn dọc bên trong thẻ | hinh: bước 7 | 3 | ✗ |
| H16 | Mọi biểu đồ có `role="img"` và `aria-label` nói ra kết luận | hinh: bước 7 | 3 | ✗ |
| H17 | `prefers-reduced-motion` được tôn trọng | hinh: bước 7 | 1 | ✗ |
| H18 | Không khớp lỗi nào trong danh sách 25 lỗi | hinh: bước 8 | 5 | ✗ |
| D01 | Người đọc độc lập làm được việc ở nhịp ba của họ | doc: câu 1 | 5 | ✗ |
| D02 | Không con số nào người đọc không nói lại được với người khác | doc: câu 3 | 5 | ✗ |
| D03 | Con số ở lại trong đầu người đọc là con số quan trọng, không phải con số đã bị rút lại | doc: câu 5 | 5 | ✗ |
| D04 | File mở được ngoại tuyến — không tham chiếu `http` nào | may: grep | 5 | ✗ |
| D05 | Xuất CSV có BOM `﻿` | may: grep | 3 | ✗ |
| D06 | Tên sắp bằng `localeCompare(..., 'vi')` | may: grep | 3 | ✗ |
| D07 | Số theo lối Việt: phẩy thập phân, chấm hàng nghìn, `—` cho chỗ thiếu | giong: đọc | 3 | ✗ |

---

## Phần riêng theo yêu cầu — thêm dòng ở đây

Mỗi chỉ số người dùng đã đồng ý thành một dòng. Mỗi mục trong trang thành một dòng. `W=5` cho chỉ số phục vụ trực tiếp quyết định ở nhịp ba; `W=3` cho chỉ số chống lưng; `W=1` cho phần mài giũa.

| ID | Requirement | Verify | W | Status |
|---|---|---|---|---|
| R01 | *(ví dụ)* Tỉ lệ nộp nhiệm vụ theo từng nhiệm vụ, cửa sổ 31/08–06/09, kèm delta tuần trước | du-lieu: G11 | 5 | ✗ |
| R02 | *(ví dụ)* Danh sách 21 em chưa nộp, khoá theo `student_id`, hiện kèm `code` để phân biệt tên trùng | du-lieu: G07 | 5 | ✗ |

---

## Luật chống bò phạm vi

Lăng kính đề xuất thêm mục hay thêm chỉ số thì **không** tự thêm dòng. Mục mới phải xin người dùng đồng ý trước. Lăng kính chỉ báo phát hiện.

## Luật chống lặp vô hạn

Một lỗi cùng nội dung mở qua **3 vòng** thì `qc_score.py` in `STALLED` và việc đúng là **dừng, đưa lên người dùng** kèm bằng chứng — không tranh luận vòng tròn.

## Luật khôi phục

`qc/spec-matrix.md` và `qc/defects.md` là nguồn sự thật duy nhất. Phiên bị ngắt giữa đường thì đọc lại hai file này là biết đang ở đâu.
