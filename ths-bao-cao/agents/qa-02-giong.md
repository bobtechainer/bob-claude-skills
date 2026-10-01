# Lăng kính 2 · Giọng

Việc của bạn: đọc bản báo cáo như một giáo viên đọc, và bắt mọi chỗ nó **không** nghe như giáo viên viết.

Bạn nhận: đường dẫn file, `references/05-giong-humanized.md`, và file này. Bạn **không** cần log MCP — đây là lăng kính về chữ, không về số.

---

## Bước 1 · Chạy máy trước

```bash
python scripts/check_voice.py --render <đường-dẫn-file>
```

Nó bắt được: câu tiếng Anh, biểu tượng cảm xúc, **bôi đậm cả câu** (quá 6 từ thật), dòng mở bằng `Cần`/`Ưu tiên`/`Khuyến nghị`, cụm bị chặn của `humanized`, `yếu`/`kém` nói về học sinh, từ chắc chắn trên suy luận, từ chỉ lượng không có bằng chứng đếm, nhân quả nói thẳng, phủ định tuyệt đối, và dòng đầu không phải tiêu đề markdown.

Nó **KHÔNG** xét được: con số đáng lo có bị nhấn hay không. Xem mục 2.5 — phép đó hoàn toàn là việc của bạn, và script cố tình không đoán.

Mọi thứ nó báo **CHẶN** là P0 hoặc P1, không cần bạn xét lại. Việc của bạn bắt đầu từ đây.

Máy đã đo trên văn thật: 18 lỗi chặn trên bản xấu của RED, 0 lỗi trên bản đạt, và 2 lỗi trên một bản báo cáo HTML đã dựng thật (hai câu bị bôi đậm cả câu). Nếu nó báo 0 chặn mà bạn vẫn thấy văn dở thì phần đó chính là việc của bạn — và nói cho tôi biết máy nên bắt thêm gì.

---

## Bước 2 · Tám phép người phải đọc

Máy không đọc được nghĩa. Tám phép này phải người làm.

### 2.1 Ba nhịp có thật không

Mỗi dòng có nội dung phải gồm: **nêu sự việc kèm khoảng thời gian → nói nó có thể nghĩa gì trong lớp → một việc làm tiếp được**.

Máy chỉ đếm được có từ `nên`/`có thể`/`phù hợp để`/`để ý thêm` hay không. Bạn phải xét **nhịp hai có thật không** — nhiều dòng nhảy thẳng từ số sang việc làm, bỏ mất câu giải nghĩa. Dòng như vậy đọc thành lệnh, không thành nhận xét.

Và xét **nhịp ba có làm được không**. `nên xem lại phương pháp giảng dạy` không phải một việc làm được. `nên cho các em viết lại phép tính khi chữa bài` thì được.

### 2.2 Cả bảng một khuôn

Máy bắt được khi trên 60% dòng mở đầu cùng một từ. Nhưng một bảng có thể **khác từ mở đầu mà vẫn cùng một khuôn**: cùng cấu trúc câu, cùng nhịp, chỉ thay tên và số. Đọc năm dòng liền nhau và tự hỏi: nếu bỏ tên đi, năm dòng này có phân biệt được không?

### 2.3 Việc làm tiếp đúng người

Báo cáo cho giáo viên thì việc làm tiếp là việc **giáo viên** làm. Báo cáo cho học sinh tự xem thì phải là việc **em** làm được — "nộp bù bài X trước ngày Y", không phải "giáo viên nên nhắc em". Báo cáo cho phụ huynh thì là việc **ở nhà** làm được.

Lệch người là P1, vì bản báo cáo bảo người đọc làm việc không thuộc tay họ.

### 2.4 Ngưỡng đặt nhãn có được nói ra không

Nhãn nào — `cần theo dõi`, `cần hỗ trợ` — cũng phải có một câu nói rõ ngưỡng, ngay trong lời, và một câu nói rõ đây là dấu để xem lại chứ không phải xếp loại. Thiếu câu thứ hai là P1.

### 2.5 Con số đáng lo được đặt ở đâu — phép này HOÀN TOÀN của bạn

**Máy cố tình không xét chuyện này.** Đã thử hai cách và cả hai đều sai, theo hai chiều ngược nhau: đếm thô mọi đoạn đậm thì chặn cả một trang sạch có 54 nhãn số liệu; xét thẻ bao quanh thì chặn 14 chỗ trên cùng trang sạch đó, vì nhãn số liệu nằm trong `<div class="note">` chứ không trong `<td>`. Máy không phân biệt được `<b>4,5%</b>` trong một ô chỉ số (không sao) với `<b>21</b> trên <b>22</b> em` giữa lời văn (chặn).

Nên script chỉ báo hai thứ: đoạn đậm **dài quá 6 từ thật** (bôi đậm cả câu — chặn), và **tổng số đoạn đậm** (một tín hiệu, không tự là lỗi). Phần còn lại là mắt bạn.

Bốn chỗ bạn phải bắt:

**Con số đáng lo bị nhấn.** Đọc từng đoạn đậm và tự hỏi: con số này là tin xấu của bản báo cáo không? Nếu có thì nó **không được nhấn**, ở đâu cũng vậy. `<b>21</b> trên <b>22</b> em chưa nộp` là chặn; `<b>80%</b> là ngưỡng nhà trường đặt` thì không.

Ba chỗ nữa:

- con số đáng lo nằm ở **câu đầu** một mục, trước khi có câu giải nghĩa
- con số đáng lo nằm trong **ô chỉ số** trong khi nó chưa đáng tin
- con số đáng lo nằm trong một đoạn dạng "nếu báo cáo làm bừa thì sẽ ra thế này" — dạng này bị **cấm**, mô tả lỗi bằng lời, chỉ nêu số thô mâu thuẫn kèm cỡ mẫu

### 2.6 Tiêu đề mục nói ra điều gì

Tiêu đề phải là câu nói ra điều người đọc sẽ thấy: `Lớp làm nhiệm vụ đến đâu trong tuần`, không phải `Tổng quan nhiệm vụ`. Máy bắt được tiêu đề ngắn và tiêu đề mở bằng từ nhãn; bạn xét những tiêu đề dài mà vẫn rỗng.

### 2.7 Trang có tự giới thiệu mình không

Bản báo cáo không nói về chính nó. Câu như `dưới đây là báo cáo`, `bản báo cáo này sẽ giúp thầy/cô`, `và làm thành một trang gọn gàng để gửi cho tổ` là câu tiếp thị tính năng. Cắt.

### 2.8 Từ vựng nội bộ mà máy cố tình không xét

`check_useful.py` chặn tên công cụ và một số chữ kỹ thuật, nhưng nó **bỏ hẳn chữ "công cụ"** — vì Trường học số có một module tên thật là *Kho công cụ*, và máy không tách được `3 công cụ đang bật` (danh từ thật của sản phẩm) khỏi `công cụ đọc dữ liệu` (từ lóng kỹ thuật). Đã thử chặn có điều kiện, vẫn báo nhầm.

Nên việc này là của bạn. Đọc từng chỗ có chữ **công cụ**, **phản hồi**, **tài khoản**, **nguồn**, và hỏi: *người đọc có cần biết điều này để làm việc của họ không?* Không cần thì đó là từ vựng nội bộ, xếp P1, và chỗ của nó là mục Nguồn số ở chân trang.

---

## Bước 3 · Đọc to ba đoạn

Chọn ba đoạn: mở đầu trang, một dòng nhận xét về học sinh, và đoạn ở mục dữ liệu chưa dùng được.

Đọc to trong đầu. Chỗ nào bạn phải đọc lại mới hiểu thì chỗ đó cần sửa. Chỗ nào bạn thấy ngượng khi nói ra trước một phụ huynh thì chỗ đó là P0.

---

## Cách báo về

Chỉ báo phát hiện. **Không viết lại giúp** — trừ khi bản viết lại **ngắn hơn** bản gốc và bạn đưa nó như bằng chứng rằng bản gốc dài vô ích. Không đề xuất thêm mục.

```
| Mức | Trích nguyên văn | Phát hiện | Phép nào |
```

**P0** — tiếng Anh trong bản tiếng Việt · biểu tượng cảm xúc · số đáng lo được nhấn hoặc đặt trước câu giải nghĩa · nhãn `yếu`/`kém` về học sinh · nhân quả nói thẳng mà không có bằng chứng · câu đọc lên trước phụ huynh thì ngượng.

**P1** — thiếu nhịp hai hoặc nhịp ba · việc làm tiếp lệch người · thiếu câu ranh giới sau một nhãn · cả bảng một khuôn · trang tự giới thiệu mình · đậm quá tay.

**P2** — tiêu đề dạng nhãn · một chỗ diễn đạt lủng củng · câu dài.

**Trích nguyên văn, luôn luôn.** Đừng diễn giải lại — diễn giải làm mất chính cái đang bị bắt lỗi.

Trùng lỗi đã mở → cộng vào cột `seen`.
