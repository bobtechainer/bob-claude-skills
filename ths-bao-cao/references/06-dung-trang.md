# Hợp đồng trang báo cáo và các đường ra

Dựng từ `templates/bao-cao.html`. Đừng viết trang từ đầu — template đã có bộ token đo được, thư viện thành phần, bộ hàm SVG, và luật in.

**Template là bộ siêu tập để cắt bớt, không phải trang để lấp đầy.** Nó có đủ tám mục và mười một hình để mọi thành phần có một ví dụ sống. Một bản báo cáo thật **giữ 3 đến 6 hình** — cắt mọi mục và mọi chỉ số không đổi được quyết định đã chốt ở cửa 1. Giao một trang mười một hình là dấu hiệu bước cắt đã bị bỏ.

Muốn xem toàn bộ kho hình đang có thì mở `templates/kho-hinh-demo.html` — đó là danh mục, không bao giờ là bản giao.

**Một file, đứng một mình.** Không tham chiếu mạng nào: không CDN, không Google Fonts, không ảnh ngoài. Máy ở trường có thể không có internet, và file phải gửi qua Zalo vẫn xem được.

---

## Trang gồm gì, theo thứ tự

Đây là hợp đồng nói **trang có gì**, không phải danh sách cấm. Thiếu phần nào là thiếu, không phải tuỳ chọn.

```
1  Thanh trên          tên báo cáo · mục lục cuộn theo · nút In · nút Tải CSV
2  Khối đầu trang      BẮT BUỘC — xem mục dưới
3  Ba câu mở           tuần đó có gì, nói thẳng, không mở bài
4  Hàng chỉ số         4–6 ô, mỗi ô một delta
5  Hình chính          hình trả lời trực tiếp câu hỏi của người dùng
6  Hình phụ            1–4 hình, mỗi hình kèm bảng song sinh
7  Danh sách từng em   khi đơn vị phân tích là từng em; sắp bằng localeCompare(...,'vi')
8  Chưa dựng được      thứ người dùng xin mà hệ thống chưa cho, kèm lý do
9  Số liệu lấy từ đâu  BẮT BUỘC — xem mục dưới
10 Khối JSON đồng hành BẮT BUỘC — xem mục dưới
```

---

## Khối đầu trang

Trang này là một **bản chụp đóng băng**. Người đọc mở nó ba tuần sau vẫn phải biết nó nói về khoảng nào và đọc lúc nào.

```
Báo cáo tuần · Lớp 6a2 Toán
31/08 – 06/09/2026 · 22 học sinh · số liệu đọc lúc 07/09/2026, 09:12

Cửa sổ theo từng loại số liệu:
  nhiệm vụ 01/08–07/09 · kiểm tra 10/06–07/09 · chuyên cần 25/08–07/09 · thời khoá biểu 07/09–13/09

Đã giả định: "tuần vừa rồi" là 31/08–06/09 · lớp 6a2 Toán (lớp có tiết nhiều nhất tuần đó)
· báo cáo để thầy/cô tự xem, nên có nêu tên em
```

Bốn thứ bắt buộc: **tên và phạm vi** · **cửa sổ theo từng loại số liệu, lấy từ cửa sổ dội lại** · **giờ đọc số liệu** · **dòng giả định**.

Dòng cửa sổ là dòng RED trượt 5 trên 5 lần. Nó phải hiện **theo từng loại dữ liệu**, vì mặc định mỗi công cụ một khác — 14 ngày chuyên cần, 30 ngày nhiệm vụ, 90 ngày kiểm tra.

Dòng giả định phải nằm **trong trang**, không phải chỉ trong chat: người đọc sau này không có đoạn chat, bản in càng không, và ai chuyển file cho người khác thì giả định phải đi theo file.

---

## Khối cuối trang · Số liệu lấy từ đâu

Một bảng, mỗi nhóm số một dòng:

```
| Nhóm số           | Công cụ                      | Cửa sổ dội lại | Ghi chú của hệ thống                    |
|-------------------|------------------------------|----------------|-----------------------------------------|
| Nhiệm vụ          | get_class_mission_summary    | 01/08–07/09    | —                                       |
| Phòng thi         | get_class_exam_summary       | 10/06–07/09    | Chỉ hiển thị 30 bài gần nhất            |
| Sĩ số             | get_class_roster             | không lọc ngày | đếm role=="student", 22 em              |
| Em cần theo dõi   | find_at_risk_students        | 09/08–07/09    | —                                       |
```

Cộng một dòng riêng, tách ra:

```
Các con số so sánh với tuần trước do skill tự tính từ hai lần đọc.
Hệ thống Trường học số không trả về số liệu so sánh kỳ trước.
```

Câu `note` của hệ thống hiện **cả** ở đây **và** cạnh con số trong thân trang. Chỉ ở cuối trang là chưa đủ — người đọc thân trang không cuộn xuống.

---

## Khối JSON đồng hành

```html
<script type="application/json" id="thsSidecar">
{
  "docTao": "2026-09-07T09:12:00+07:00",
  "phamVi": { "loai": "lop-bo-mon", "classId": "53182ce9-...", "ten": "6a2 Toán" },
  "giaDinh": ["tuần vừa rồi = 31/08–06/09", "lớp có tiết nhiều nhất tuần đó"],
  "soLieu": {
    "nv-tile-nop":     { "giaTri": 4.5,  "hienThi": "4,5%",  "congCu": "get_class_mission_summary", "truong": "submitted/student_count", "cuaSo": "2026-08-01..2026-09-07", "tuTinh": true },
    "nv-da-mo":        { "giaTri": 22,   "hienThi": "22",    "congCu": "get_class_mission_summary", "truong": "started",  "cuaSo": "2026-08-01..2026-09-07" },
    "si-so":           { "giaTri": 22,   "hienThi": "22",    "congCu": "get_class_roster", "truong": "members[role==student].length" },
    "thi-tb":          { "giaTri": null, "hienThi": "chưa chấm", "congCu": "get_class_exam_summary", "truong": "average_percent", "cuaSo": "2026-06-10..2026-09-07", "khoaThieu": true }
  },
  "gioiHan": [
    { "congCu": "get_class_exam_summary", "note": "Chỉ hiển thị 30 bài gần nhất; hãy thu hẹp khoảng ngày.", "doDai": 30, "tran": 30 }
  ],
  "chuaDungDuoc": [
    { "nguoiDungXin": "câu sai nhiều nhất", "lyDo": "không có công cụ đọc phòng thi nên room_id không lấy được" }
  ]
}
</script>
```

Mỗi khoá trong `soLieu` khớp một `data-fig="<khoá>"` trên con số hiện trong trang:

```html
<div class="big" data-fig="nv-da-mo">22<small>/22 em</small></div>
```

Khối này tồn tại để **phép truy nguồn chạy được bằng máy** thay vì bằng mắt. Lăng kính 1 đối chiếu ba lớp: con số hiện trên trang ↔ khối này ↔ phản hồi MCP thật. `scripts/check_sidecar.py` dọn phần dễ.

Con số nào trên trang **không có** `data-fig` là lỗi chặn — và luật đúng là **xoá con số đó khỏi trang**, không phải làm nhẹ đi.

`tuTinh: true` cho mọi thứ skill tự tính: tỉ lệ, delta, phổ điểm. `khoaThieu: true` cho khoá không có trong phản hồi.

### `mauSo` — bắt buộc với mọi con số đếm

Mục nào có `donVi` là đơn vị đếm — *em, học sinh, lớp, bài, dòng, lượt, phòng thi, nhiệm vụ, tiết, câu, bộ đề, thầy cô, buổi* — thì **bắt buộc** có `mauSo`, và mẫu số đó phải in **ngay cạnh con số** trên trang.

```json
"ds-can-ho-tro": {
  "moTa": "Số em mang nhãn cần hỗ trợ", "giaTri": 1, "donVi": "em",
  "mauSo": "trong 8 dòng sổ lớp đã tra được, không phải trong 22 em",
  "congCu": "find_at_risk_students", "cuaSo": "2026-08-09..2026-09-07"
}
```

Viết `mauSo` như nói với người, không như tên trường: *"trong 70 dòng sổ của hai lớp, 15/08–15/09"*, chứ không phải *"members.length"*. Nó trả lời đúng một câu người đọc hỏi — **bao nhiêu trên bao nhiêu**.

Ba vòng thử liền, đây là chỗ bị chê nhiều nhất. Chủ nhiệm đọc *"38 em đang nợ"* rồi câu dưới nói gần 70 em. Hiệu trưởng ghi 48 vào sổ tay rồi mãi cuối trang mới thấy *"48 là số dòng chứ chưa phải 48 em"*. Học sinh gặp hai con số 18 cạnh nhau kèm lời dặn đừng cộng lại.

Bộ hàm có `soVaMau(mã)` in con số kèm mẫu số trong một lần gọi. `scripts/check_sidecar.py` chặn `THIEU_MAU_SO` và `MOT_THU_HAI_SO`.

---

## Trạng thái chưa có dữ liệu

**Một trang toàn mục trống KHÔNG phải một bản báo cáo.** Câu cũ ở đây nói ngược lại, và chính nó đã sinh ra một bản giao cho người dùng gồm sáu mục thì năm mục nói về dữ liệu hỏng — người đọc không biết thêm gì về lớp mình.

Đúng ra: một chỉ số trống được **một dòng**, không được một mục. Khoảng đang xem không có gì thì **nới rộng khoảng ra** cho tới khi tìm được, báo cáo cái tìm được, và nói một câu là đã nới. Cả năm học không có gì thì trang chỉ còn một câu trả lời cộng một dòng — vẫn ngắn, vẫn thật, và vẫn hơn hai mươi bảy nghìn ký tự giải thích vì sao không có gì.

Dòng cho một chỉ số trống, đủ dùng:

```
Chưa có dữ liệu trong khoảng 31/08–06/09.
get_class_exam_summary trả về exam_count 0 và ghi chú
"Lớp này chưa có bài kiểm tra nào được nộp trong khoảng thời gian đã chọn."
```

Số thô làm bằng, không phải một câu chung chung. Người đọc phải chuyển được đoạn này cho quản trị.

---

## Bảng cảnh báo dữ liệu

Khi một chỉ số **có** số nhưng số đó không tin được. Khác hẳn trạng thái trống.

```
Số liệu điểm danh chưa dùng được

Trong khoảng 25/08–07/09, get_class_attendance_summary trả về present 0
và absent 880 cho cả 22 em — không em nào được ghi là có mặt.
Chưa rõ nguyên nhân, phù hợp để nhờ quản trị Trường học số kiểm tra.

Vì vậy phần chuyên cần không có biểu đồ và không có tỉ lệ trong bản báo cáo này.
```

Bảng này **thay chỗ** biểu đồ. Và khi nó xuất hiện thì **không con số chuyên cần nào được có ở chỗ khác trong trang** — không tỉ lệ, không dòng bảng, không tổng, không ô chỉ số.

Câu cuối quan trọng: nói rõ vì sao phần đó trống, để người đọc không tưởng skill quên.

---

## Đường ra 1 · In giấy A4

```css
@page { size: A4; margin: 14mm; }
```

Bốn luật in, xếp theo mức thiệt hại nếu bỏ:

**1 · Mở bung mọi hoạt ảnh.** Đây là luật quan trọng nhất và là lỗi kinh điển. Hoạt ảnh hiện dần đặt `opacity: 0` cho thẻ chưa cuộn tới, nên **nửa trang in ra trắng**.

```css
@media print{
  /* Khi in, moi thu phai hien du: the chua cuon toi van dang o opacity 0. */
  .reveal,.fade,.pop,.cell{opacity:1!important;transform:none!important;animation:none!important}
  .bar{transform:none!important}
  .draw{stroke-dasharray:none!important;stroke-dashoffset:0!important}
  details.data-table[open],details.data-table{display:block!important}
  details.data-table>summary{display:none}
  details.data-table>table{display:table!important}
}
```

Dòng cuối cũng bắt buộc: **bảng số liệu phải in ra**, không gập lại. Trên giấy không có chuột nên bảng gập là bảng mất, và khi đó biểu đồ vi phạm luật "gợi ý nổi không bao giờ là đường duy nhất đọc được giá trị".

**2 · `break-inside: avoid`** trên thẻ và mục, để một biểu đồ không bị chặt đôi qua hai trang.

**3 · Ẩn chrome:** thanh trên, mục lục, nút in, gợi ý nổi, thẻ lọc. Bỏ đổ bóng. **Giữ** khối đầu trang và bảng nguồn số liệu — đó là phần làm bản in dùng được.

**4 · Bật vân.** Trên giấy đen trắng màu mất hết, nên vân mang danh tính. Một lớp vân định hướng ở **45° và bản gương 135°, chỉ hai góc đó** — ngang và dọc đọc thành lưới. Tắt mặc định, bật trong `@media print` và `forced-colors`.

Kiểm bằng cách **in thử ra PDF**, đừng chỉ đọc CSS.

## Đường ra 2 · Tóm tắt trong chat

Sau khi ghi file, in ra chat 5 đến 12 dòng. **Dòng đầu phải là tiêu đề `#`** — nếu 500 ký tự đầu không có markdown thì cả tin nhắn mất định dạng, bảng vỡ hết.

Trong chat chỉ có markdown và chữ đơn sắc. Không SVG, không ảnh, không mermaid. Ký tự khối `█` **không có tài liệu nào bảo đảm nó hiện đúng** nên dùng ASCII.

```markdown
# Báo cáo tuần · Lớp 6a2 Toán

**31/08 – 06/09/2026** · 22 học sinh

| Chỉ số | Tuần này | Tuần trước |
|---|---|---|
| Đã nộp nhiệm vụ | 1/22 | 3/22 |
| Bài kiểm tra nộp | 0 | 0 |
| Tiết đã dạy | 4 | 4 |

Nhiệm vụ "bộ đề 2" hạn 28/08 có 22 em mở bài, 1 em nộp. Phần chuyên cần
chưa dùng được, tôi để riêng ở mục cuối kèm số thô.

Bản đầy đủ, có biểu đồ màu và in được A4:
  bao-cao/2026-09-07-6a2-toan-tuan.html

Thiếu chỉ số nào thì nói, tôi dựng lại vào cùng đường dẫn.
```

Thanh ký tự chỉ dùng khi thật giúp, và luôn **có số đứng trước, thanh bắt đầu ở cột cố định** để dấu tiếng Việt không đẩy lệch:

```
 4,5%  ##                                        Đã nộp        1/22
95,5%  ######################################    Chưa nộp     21/22
```

## Đường ra 3 · Xuất CSV

Nút trong trang, dựng blob ngay tại máy người dùng.

```js
// Khong co BOM thi Excel tren Windows mo ra chu Viet loi het.
var blob = new Blob(['﻿' + noiDung], {type: 'text/csv;charset=utf-8;'});
```

`'﻿'` là bắt buộc, không phải tuỳ chọn. Số theo lối Việt — phẩy thập phân — nên **bọc mọi ô trong dấu ngoặc kép**, không thì dấu phẩy thập phân phá cột.

Xuất **số thô**, kèm cột `công cụ` và cột `cửa sổ` cho từng dòng. Ai mở file này ra là để tự tính lại, nên họ cần biết số từ đâu.

## Đường ra 4 · PNG từng biểu đồ

Biểu đồ là SVG nội tuyến nên xuất được không cần thư viện: `XMLSerializer` → `data:image/svg+xml` → vẽ vào `<canvas>` → `toDataURL('image/png')` ở tỉ lệ 2×.

Đặt tên theo tiêu đề biểu đồ đã bỏ dấu, để dán vào slide họp hội đồng còn nhận ra.

**Nạp phông trước khi vẽ** — thiếu bước này thì dấu tiếng Việt trong ảnh rơi về phông dự phòng:

```js
if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
```

---

## Đặt file ở đâu

```
<thư-mục-làm-việc>/bao-cao/<yyyy-mm-dd>-<phạm-vi>-<loại>.html
```

Ví dụ: `bao-cao/2026-09-07-6a2-toan-tuan.html`

Phần `<phạm-vi>` bỏ dấu và thay khoảng trắng bằng gạch nối, để đường dẫn dán được vào mọi chỗ.

**Người dùng xin chỉnh thì ghi lại vào đúng đường dẫn cũ**, đừng tạo file mới — họ đã gửi đường dẫn đó cho người khác rồi. Nói một dòng đã đổi gì.

Thư mục `qc/` đi cạnh:

```
<thư-mục-làm-việc>/bao-cao/qc/spec-matrix.md
<thư-mục-làm-việc>/bao-cao/qc/defects.md
```

---

## Trang riêng cho từng người đọc

Khi người dùng xin mỗi em một trang để phát cho phụ huynh: **một file, mỗi em một trang**, ngắt trang giữa các em. Không sinh 22 file.

```css
.trang-hoc-sinh{break-after:page}
.trang-hoc-sinh:last-child{break-after:auto}
```

Và không con số nào của em khác xuất hiện trong trang của một em — kể cả trung bình lớp, trừ khi giáo viên xin, vì trung bình lớp là thông tin về cả lớp.

---

## Danh sách soi nhanh trước khi giao

```bash
f="bao-cao/2026-09-07-6a2-toan-tuan.html"

python  scripts/check_thuc_te.py --render "$f"   # phai 0 loi — chay TRUOC NHAT
python  scripts/check_useful.py  --render "$f"   # phai dat ca 3 phep
python  scripts/check_voice.py   --render "$f"   # phai 0 loi chan
python  scripts/check_sidecar.py --render "$f"   # phai 0 loi chan
#  --render BAT BUOC: trang sinh phan lon noi dung luc chay.
#  Bo co nay thi may do soi HTML tinh va mu voi gan het trang.
grep -c 'http://\|https://'       "$f"     # phai la 0 — file dung mot minh
grep -c 'uFEFF\|\xEF\xBB\xBF'     "$f"     # phai >= 1 — BOM cho CSV
grep -c '@page'                   "$f"     # phai >= 1
grep -c "localeCompare"           "$f"     # phai >= 1, va phai co 'vi'
grep -c 'non-scaling-stroke'      "$f"     # phai >= 1
grep -c 'role="img"'              "$f"     # phai bang so bieu do
grep -c 'data-fig='               "$f"     # phai bang so con so tren trang
python  scripts/qc_score.py       bao-cao/qc   # exit 0 moi duoc giao
```
