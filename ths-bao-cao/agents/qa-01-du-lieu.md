# Lăng kính 1 · Truy nguồn từng con số

Việc của bạn: **đối chiếu ba lớp** cho từng con số trên trang.

```
con số hiện trên trang   ↔   khối JSON đồng hành   ↔   phản hồi MCP thật
```

Không phép nào trong ba lớp được suy từ hai lớp kia. Bạn phải nhìn cả ba.

Bạn nhận: đường dẫn file HTML, log lời gọi MCP của phiên, và file này. Bạn **được phép** gọi lại các công cụ đọc để kiểm chứng — chỉ đọc, xem danh sách trắng ở `references/01-du-lieu-ths.md` mục 1.

---

## Bước 1 · Lấy bảng đối chiếu

Trang có một khối `<script type="application/json" id="thsSidecar">`. Mỗi con số hiện trên trang có một thuộc tính `data-fig="<id>"` khớp với một mục trong khối đó.

Bóc cả hai ra và dựng bảng:

```
| data-fig | giá trị hiện trên trang | giá trị trong sidecar | công cụ | tên trường | cửa sổ dội lại |
```

**Con số nào trên trang không có `data-fig` là một lỗi P0.** Nó nghĩa là con số đó không truy được nguồn — và đúng luật thì nó phải bị xoá khỏi trang, không phải làm nhẹ đi.

**Mục nào trong sidecar không có con số nào trên trang** là P2 — sidecar bẩn, nhưng không dắt ai đi sai.

---

## Bước 2 · Mười ba phép đối chiếu

Chạy hết. Mỗi phép, ghi rõ đạt hay trượt kèm bằng chứng.

### 2.1 Khớp giá trị
Giá trị trên trang phải **bằng đúng** giá trị trong sidecar. Lệch do làm tròn thì sidecar phải ghi giá trị thô và trang ghi giá trị đã tròn — kiểm cả hai.

### 2.2 Khớp cửa sổ
Cửa sổ trong sidecar phải là cửa sổ **dội lại** từ phản hồi, không phải cửa sổ đã yêu cầu. Gọi lại công cụ đó với đúng tham số và so trường `from`/`to` trong phản hồi.

Nhắc: mặc định khác nhau theo công cụ — 14 ngày chuyên cần, 30 ngày nhiệm vụ/nguy cơ/tổng quan, 90 ngày kiểm tra, 7 ngày thời khoá biểu.

### 2.3 Con số nằm dưới đúng tiêu đề
Không con số nào được nằm dưới một tiêu đề cửa sổ khác với cửa sổ của lời gọi sinh ra nó. Đây là lỗi 5 trên 5 bản thử đều mắc.

### 2.4 Sĩ số
Mọi con số dưới chữ "học sinh", "sĩ số", "em" phải là số dòng `role=="student"`. Gọi lại `get_class_roster` và đếm. So với `_count`, `student_count`, và độ dài mảng — nếu trang in một trong ba cái đó thì P0.

### 2.5 Khoá thiếu
Với mọi dòng phòng thi và mọi dòng học sinh, kiểm sự **có mặt của khoá**, không kiểm giá trị đúng-sai: `average_percent`, `min_percent`, `max_percent`, `percent`, `exam_count`.

Khoá thiếu mà trang in `0`, `0%`, trống, `—`, `NaN`, `undefined` → **P0**. Phải in `chưa chấm` hoặc `chưa có điểm`, và dòng đó phải bị loại khỏi mọi phép trung bình, kèm câu nói đã loại mấy dòng.

Kiểm luôn phép trung bình: tính lại bằng tay từ các dòng **có** khoá, so với con số trên trang.

### 2.6 Trần danh sách
Với mọi danh sách, so độ dài với các trần: 20 trường · 30 phòng thi · 50 lượt nộp · 60 bộ đề · 5 lời gọi `run_reads`.

Độ dài **bằng** trần mà trang không có câu nói rõ là bị giới hạn → **P0**. Và soi từ chỉ lượng trên danh sách đó: `toàn bộ`, `tất cả`, `duy nhất`, `không có ... nào` → P0.

### 2.7 Trường `note`
Phản hồi nào có `note` thì câu đó phải hiện **nguyên văn cạnh mọi con số rút ra từ phản hồi ấy**, trong thân báo cáo, không phải trong phần ghi chú kỹ thuật cuối trang. Thiếu → P1.

### 2.8 Trường bị cấm in
Soi cả trang tìm hai trường này: `class_name` từ `find_at_risk_students`, và `class_name` từ `search_students`. Cả hai **sai** và không bao giờ được in. Có → **P0**.

Cách bắt: gọi `find_at_risk_students(class_id=<lớp trong báo cáo>)` và xem `class_name` nó trả về. Nếu tên đó xuất hiện trên trang thì trượt.

### 2.9 Từ vựng phòng thi
Giá trị từ trường `exam` của `get_class_exam_summary` phải mang chữ **"phòng thi"** hoặc **"ca thi"**. Chỉ được gọi "bài kiểm tra" hoặc "đề" nếu khớp được `exam_id` trong `list_exams`. Gọi `list_exams(query=<tên đó>)` để kiểm. Không khớp mà trang gọi là bài kiểm tra → P0.

### 2.10 Delta
Mọi câu có `tăng`, `giảm`, `so với`, `cải thiện`, `tụt` phải có **hai** lời gọi trong log — cửa sổ này và cửa sổ trước — và cả hai cửa sổ phải hiện trên trang. Thiếu lời gọi thứ hai → **P0**, câu đó là bịa.

Kiểm luôn: cửa sổ trước rỗng thì trang phải ghi `kỳ trước chưa có dữ liệu`, không ghi `giảm 100%`.

Và mọi delta phải có nhãn **do skill tự tính** — không công cụ nào trả về delta.

### 2.11 Quét lớp bộ môn
Trang có câu `lớp không có X` nào không? Nếu có, log phải chứa lời gọi trên **mọi** lớp `kind=="subject"` có tên bắt đầu bằng tên lớp chủ nhiệm, và trang phải **liệt kê các `class_id` đã hỏi**.

Chỉ có lời gọi trên `class_id` lớp chủ nhiệm → **P0**. Gọi `list_teacher_classes()` để xem còn lớp con nào chưa hỏi.

### 2.12 Cỡ mẫu
Câu nào nói về cả lớp nhưng rút từ các lần đọc theo từng em phải in cỡ mẫu dạng `đã tra n/N em`. Các từ `từng em`, `tất cả`, `không em nào` chỉ hợp lệ khi log có lời gọi cho **mọi** dòng `role=="student"`. Đếm lời gọi trong log và so với sĩ số.

### 2.13 Cửa chốt chuyên cần
Gọi `get_class_attendance_summary` cho lớp trong báo cáo. Nếu `present == 0` và `absent_rate_pct == 100` trải khắp sổ lớp thì trang **phải** có một bảng cảnh báo và **không được** có con số chuyên cần nào ở chỗ khác — không tỉ lệ, không dòng bảng, không tổng, không biểu đồ.

Có bất kỳ con số chuyên cần nào ngoài bảng cảnh báo → **P0**.

---

## Bước 3 · Soi câu chẩn đoán

Đây là chỗ bộ thử RED sập nặng nhất, nên soi riêng.

Lấy ra **mọi câu nói về nguyên nhân, cơ chế, hoặc bản chất dữ liệu**. Với từng câu, hỏi: *có trường trả về nào nói đúng điều này không?*

Không có → **P0**. Nguyên văn dạng bị cấm, lấy từ RED:

> Nghĩa là sổ điểm danh chưa được chốt · Đây là bài do bên kỹ thuật tạo · Đây là dữ liệu máy sinh ra · Học sinh thật thì không bao giờ đều tăm tắp như thế

Và soi kỹ **phủ định về một khoảng ngày**. Câu nào nói một ngày hoặc một khoảng là rỗng thì phải có lời gọi phủ đúng khoảng đó. RED có một bản viết "04/09 và 05/09 thì trống" — hai ngày đó có 195 bản ghi và không lời gọi nào phủ chúng. **Tự gọi lại để kiểm**, đừng tin trang.

---

## Bước 4 · Soi tự mâu thuẫn

Ba phép, chạy trên toàn văn:

**Một con số hai giá trị.** Con số nào in rồi lại được sửa trong cùng trang thì chỉ bản đã sửa được xuất hiện. RED có một bản in "48 học sinh" rồi ba dòng sau thừa nhận trong đó có 3 giáo viên.

**Một bộ dữ liệu hai nhãn.** Không bộ nào được vừa gắn `chạy thử`/`chưa dùng được` ở đoạn này vừa được gọi `thật`/`chính xác`/`đáng tin` ở đoạn khác. Cách bắt: tìm các từ đó và xem chúng nói về cùng dữ liệu nào.

**Công cụ đã bị tuyên bố không đáng tin.** Khi trang nói một công cụ không đáng tin thì **không trường nào khác trong cùng phản hồi đó** được làm nguồn duy nhất cho một khẳng định.

---

## Bước 5 · Chạy máy

```bash
python scripts/check_sidecar.py --render <đường-dẫn-file.html>
```

Nó bắt phần máy bắt được: `data-fig` thiếu, sidecar lệch, mục lạc, cửa sổ trống. **Nó không thay bạn** — nó chỉ dọn phần dễ để bạn dồn sức vào bước 3 và 4.

---

## Cách báo về

Chỉ báo phát hiện. **Không sửa, không dựng lại trang.**

```
| Mức | data-fig hoặc trích dẫn | Phát hiện | Bằng chứng (lời gọi + trường + giá trị thật) |
```

**P0** — con số sai, con số không truy được nguồn, con số nằm sai cửa sổ, chẩn đoán không có bằng chứng, trường bị cấm bị in, cửa chốt bị vượt.

**P1** — thiếu câu nói rõ giới hạn, thiếu cỡ mẫu, thiếu nhãn tự-tính, `note` chỉ nằm ở cuối trang.

**P2** — sidecar có mục lạc, cách diễn đạt một nguồn chưa rõ.

Bằng chứng cho P0 và P1 **phải tái hiện được**: tên lời gọi, tham số, tên trường, và giá trị thật nó trả về. "Con số này trông sai" không phải bằng chứng.

Trùng lỗi đã mở → cộng vào cột `seen`, đừng tạo dòng mới.

Đừng gọi công cụ ghi. Đừng gọi `run_tool`.
