# Kho use-case — ví dụ, không phải danh sách phải khớp vào

**Skill này là kim chỉ nam cho mọi loại báo cáo, mọi vai.** Người dùng hỏi gì cũng được — một lớp, một em, một môn, cả khối, cả trường, kho học liệu, đội ngũ, thiết bị, hay thứ chưa ai hỏi bao giờ. Phương pháp mới là sản phẩm; file này chỉ là mười một tình huống hay gặp đã dựng sẵn đường đi.

Yêu cầu trùng một ví dụ thì lấy luôn lời gọi và danh sách hình của nó cho nhanh. **Không trùng thì đi luồng chung ở cuối file** và đừng cố nhét vào — nhét bừa vào một ví dụ gần đúng còn tệ hơn tự dựng từ đầu, vì nó kéo theo cả bộ chỉ số không ai hỏi.

---

## Mỗi bản báo cáo phục vụ một quyết định

Không có danh mục báo cáo cố định. Người dùng hỏi kiểu gì cũng được. Cái cố định là **cách khớp một câu hỏi vào một quyết định**, rồi từ quyết định suy ra chỉ số và hình vẽ.

Mỗi use-case viết theo đúng ba nhịp: **với vai trò là ai · tôi muốn gì · từ đó quyết định được gì.** Nhịp thứ ba là nhịp quan trọng nhất — nó là phép thử để bỏ chỉ số. Chỉ số nào không đổi được quyết định thì cắt khỏi trang.

Khớp yêu cầu vào use-case gần nhất. Không cái nào khớp thì dùng luồng chung ở mục cuối — nó dựng được mọi thứ, chỉ chậm hơn một nhịp.

---

## Cách đọc một khối use-case

```
UC-xx  tên ngắn
  Vai       ai đang hỏi
  Muốn      họ xin gì, bằng lời của họ
  Để        quyết định mà bản báo cáo này phục vụ
  Đọc       các lời gọi MCP, đúng thứ tự
  Hình      hình vẽ, theo tên trong 03-kho-bieu-do.md
  Chặn      cửa riêng của use-case này
```

---

## Giáo viên bộ môn

### UC-01 · Tuần vừa rồi lớp tôi thế nào

```
Vai    Giáo viên bộ môn, một lớp, một môn
Muốn   "Làm cho tôi báo cáo tình hình học tập lớp 6a2 Toán tuần vừa rồi"
Để     Quyết định tiết tới chữa gì trước, và nhắc riêng em nào
```

**Đọc** — cửa sổ là thứ Hai đến Chủ nhật tuần trước, truyền tường minh:

```
1  get_schedule()                                          định hướng: ai hỏi, lớp nào, tuần nào
2  list_teacher_classes()                                   lấy class_id đúng của lớp bộ môn
3  run_reads([ get_class_mission_summary(class_id,f,t),
              get_class_exam_summary(class_id,f,t),
              get_class_attendance_summary(class_id,f,t),
              get_schedule(class_id,f,t),
              get_class_roster(class_id) ])                 5 lời gọi, một lượt
4  run_reads([ ...ba chỉ số đầu trên cửa sổ TUẦN TRƯỚC ])   để có delta
5  find_at_risk_students(class_id,f,t)                      phần danh sách em
```

**Hình**
- `kpiRow` — 4 ô: tỉ lệ nộp nhiệm vụ, điểm trung bình phòng thi, số tiết đã dạy, số em cần theo dõi. Mỗi ô một delta so tuần trước.
- `bars` — nhiệm vụ trong tuần, mỗi dòng một nhiệm vụ, thanh là tỉ lệ đã nộp
- `columns` — mỗi phòng thi một cột, cao là trung bình, kèm vạch cao nhất và thấp nhất
- `barsEmphasis` — em cần theo dõi, tô đậm em xấu nhất, còn lại xám
- Chuyên cần: **`banner` cảnh báo dữ liệu**, không phải biểu đồ, cho tới khi cửa chốt mở

**Chặn**
- `class_id` phải là lớp **bộ môn**. Nhiệm vụ và tiết học không gắn vào lớp chủ nhiệm.
- Sĩ số đếm `role=="student"`, không lấy `student_count`.
- Tuần trống thì vẫn ra trang, mọi mục ghi `chưa có dữ liệu` kèm số thô. Đây là câu trả lời có ích: tuần đó lớp không có hoạt động nào trên hệ thống.

---

### UC-02 · Kỳ thi vừa rồi lớp làm được đến đâu

```
Vai    Giáo viên bộ môn
Muốn   "Báo cáo tình hình điểm số trong kỳ thi vừa rồi"
Để     Quyết định chữa lại chủ đề nào cho cả lớp, và cho em nào làm lại
```

**Đọc**

```
1  get_class_exam_summary(class_id, f, t)     các phòng thi trong cửa sổ
2  get_class_roster(class_id)                 lọc role=="student"
3  nếu sĩ số ≤ 50:
     get_student_exam_scores(student_id, f, t) cho TỪNG em  → tự chia khoảng
   nếu sĩ số > 50: bỏ phần phổ điểm, nói rõ vì sao
```

**Hình**
- `kpiRow` — số lượt nộp, trung bình lớp, cao nhất, số em đạt
- `columns` — mỗi phòng thi một cột
- `bullet` — trung bình lớp so với ngưỡng đạt của phòng
- `histogram` — phổ điểm, **chỉ khi đã quét đủ sổ lớp**, kèm nhãn `do skill tự tính từ n/N em`

**Chặn**
- "kỳ thi vừa rồi" mà cửa sổ có nhiều phòng thi thì **hỏi phòng nào**, kèm danh sách ngày và tên để người hỏi chọn.
- Trường `exam` là **tên phòng thi**, in đúng chữ "phòng thi". Chỉ gọi "bài kiểm tra" sau khi khớp được trong `list_exams`.
- Khoá thiếu `average_percent` in `chưa chấm`, loại khỏi mọi trung bình, nói rõ đã loại mấy dòng.
- Ngưỡng đạt là thiết lập **của từng phòng**, nên tỉ lệ đạt **không so được** giữa các phòng. Không xếp hạng phòng theo tỉ lệ đạt.
- **Bảng câu sai nhiều nhất: từ chối tường minh.** Hệ thống chưa có công cụ đọc phòng thi nên `room_id` không lấy được. Ghi vào mục "chưa dựng được" kèm lý do, đừng vẽ một nửa.

---

### UC-03 · Bài nào cả lớp cùng bỏ

```
Vai    Giáo viên bộ môn
Muốn   "Có bài nào cả lớp không ai làm không?"
Để     Quyết định bài nào giao lại, giãn hạn, hay bỏ
```

**Đọc** `get_class_mission_summary` trên cửa sổ rộng — một tháng, không một tuần.

**Hình** `bars` sắp theo tỉ lệ nộp tăng dần, nhiệm vụ tệ nhất trên cùng. Cột `started` và `submitted` cạnh nhau bằng `stackedBar` từng dòng.

**Chặn** `started 22 / submitted 1` là "cả lớp mở rồi bỏ dở", khác hẳn `started 2 / submitted 1` là "cả lớp không mở". Hai chuyện này dẫn tới hai việc làm khác nhau, nên đừng gộp cả hai vào một tỉ lệ.

---

## Giáo viên chủ nhiệm

### UC-04 · Báo cáo tuần cho lớp chủ nhiệm

```
Vai    Giáo viên chủ nhiệm
Muốn   "Tuần sau tôi họp phụ huynh lớp chủ nhiệm 6a2, làm giúp tôi bản báo cáo tuần"
Để     Quyết định nói gì trước hội trường, và gặp riêng phụ huynh nào
```

**Đọc** — đây là use-case đòi quét lớp con:

```
1  list_teacher_classes()                                       lấy MỌI dòng kind=="subject"
                                                                 có tên bắt đầu bằng "6a2"
2  get_class_roster(6a2 chủ nhiệm)                              sổ lớp thật, lọc role=="student"
3  với TỪNG lớp bộ môn:
     get_class_mission_summary(class_id, f, t)
     get_class_exam_summary(class_id, f, t)
4  find_at_risk_students(6a2, f, t)                             gộp qua các môn
```

**Hình**
- `bars` — mỗi môn một dòng, thanh là tỉ lệ nộp nhiệm vụ của môn đó
- `dotPlot` — điểm trung bình theo môn trên cùng một thang, thấy ngay môn nào lệch
- `barsEmphasis` — em cần quan tâm, sắp theo **số môn** có vấn đề
- `stackedBar` — nhiệm vụ toàn lớp: đã nộp / đang làm / quá hạn chưa làm

**Chặn**
- **Liệt kê các `class_id` đã quét ngay cạnh kết luận.** Số 0 đọc từ lớp chủ nhiệm phải viết là `không đọc được ở lớp chủ nhiệm — nhiệm vụ và tiết học gắn vào lớp bộ môn`.
- Token giáo viên thấy ít lớp con hơn token trường (4 so với 6 với lớp 6a2). Nói rõ đã quét mấy lớp con, đừng nói "tất cả các môn".
- **Hỏi ai đọc.** Đọc chung trước hội trường thì chỉ số đếm, không tên. In riêng từng phụ huynh thì chỉ tên con họ.

---

### UC-05 · Bản riêng cho từng phụ huynh

```
Vai    Giáo viên chủ nhiệm
Muốn   "In cho tôi mỗi em một trang để phát cho phụ huynh"
Để     Đưa phụ huynh một tờ nói đúng về con họ, không có tên em khác
```

**Đọc** với từng `student_id` trong sổ lớp: `get_student_mission_status`, `get_student_exam_scores`, `get_student_attendance`.

**Hình** nhẹ tay — `kpiRow` ba ô, `lineChart` điểm theo thời gian, `stackedBar` nhiệm vụ. Không xếp hạng, không so với bạn cùng lớp.

**Chặn**
- **Một file, một trang một em, `break-after: page` giữa các trang.** Không sinh 22 file.
- Không con số nào của em khác xuất hiện, kể cả trung bình lớp — trừ khi giáo viên xin, vì trung bình lớp là thông tin về cả lớp.
- Không xếp hạng. Không "con đứng thứ mấy".
- Dòng `percent` thiếu khoá thì loại khỏi trung bình và nói rõ đã loại mấy lượt. RED có một bản in "trung bình 17,7%" chỉ vì đếm khoá thiếu thành 0 — và đó là bản gửi phụ huynh.

---

## Tổ trưởng chuyên môn

### UC-06 · So các lớp cùng môn

```
Vai    Tổ trưởng chuyên môn
Muốn   "So sánh kết quả môn Toán giữa các lớp khối 6"
Để     Quyết định họp tổ nói chuyện gì, và dự giờ lớp nào
```

**Đọc** `list_teacher_classes(query="Toán")` → lọc theo khối → với từng lớp: `get_class_exam_summary`, `get_class_mission_summary`, `get_class_roster`.

**Hình**
- `dotPlot` — mỗi lớp một điểm trên thang trung bình, thấy ngay lớp nào tách khỏi nhóm
- `bars` — tỉ lệ nộp nhiệm vụ theo lớp, sắp giảm dần
- `dumbbell` — lớp nào tăng, lớp nào tụt so với cửa sổ trước

**Chặn**
- Sổ lớp chưa gọi thì lớp đó **không được có sĩ số** trong trang.
- **Nếu cùng công cụ trả về danh sách dòng giống hệt nhau cho hai `class_id` khác nhau thì không kết luận theo lớp nào từ công cụ đó** — kể cả kèm lời cảnh báo. Chuyện này có thật với 9A2 Toán, 6a2 Toán và Lớp 7A Toán.
- Danh sách lớp bị cắt trần thì in `n lớp đã kiểm tra`, không nói "cả khối".

---

### UC-07 · Phổ điểm một môn

```
Vai    Tổ trưởng chuyên môn
Muốn   "Cho tôi phổ điểm môn Toán kỳ vừa rồi"
Để     Quyết định ngưỡng ôn tập, và bàn lại độ khó của đề
```

**Đọc** như UC-02 nhưng gộp nhiều lớp. Tổng số em phải quét là tổng sổ lớp — **quá 50 em thì dừng**, nói thẳng là chưa dựng được ở quy mô này và đề nghị làm từng lớp.

**Hình** `histogram` bốn khoảng, dùng khoảng của nhà trường nếu người hỏi cho, không thì `<5 · 5–6,5 · 6,5–8 · >8` và **nói rõ là khoảng do skill đặt**.

**Chặn** ghi ngay dưới biểu đồ: `do skill tự quét điểm n/N em rồi chia khoảng; hệ thống không có công cụ trả về phổ điểm`. Người đọc phải biết con số này là tính ra, không phải đọc ra.

---

## Ban giám hiệu

### UC-08 · Báo cáo cấp trường

```
Vai    Hiệu trưởng, phó hiệu trưởng
Muốn   "Cho tôi báo cáo tổng hợp toàn trường tháng này để báo cáo Phòng"
Để     Quyết định nội dung gửi Phòng, và giao việc cho tổ nào
```

**Đọc**

```
1  get_school_overview()                      → CHỌN ĐÚNG MỘT DÒNG khớp tên trường
2  list_teacher_classes()                      danh sách lớp thấy được (bị cắt trần)
3  với các lớp đã chọn: run_reads([...])       gộp 5 lời gọi mỗi lượt
4  find_at_risk_students(f, t)                 không truyền class_id, gộp toàn bộ
```

**Hình**
- `kpiRow` — số lớp đã đọc trên tổng, tỉ lệ nộp nhiệm vụ, số nhiệm vụ quá hạn còn mở, số em cần hỗ trợ
- `dotPlot` — các lớp đã đọc trên một thang
- `heatmap` — khối × tuần, **dải xanh**, ô trống ghi rõ chưa có dữ liệu
- `bars` — nhiệm vụ quá hạn theo khối

**Chặn** — đây là use-case dễ sai nhất, RED sập ba chỗ ở đây:
- `get_school_overview` trả **20 trường toàn nền tảng**. Chọn một dòng theo tên, in `school_year` của nó, nói một câu là đã bỏ các dòng khác. Không cộng gộp, không lấy trung bình, không gắn nhãn `toàn trường` cho số của nó.
- Từ `toàn trường`, `lớp nào cũng`, `mọi lớp` **chỉ** dùng khi có số ở mức trường chống lưng hoặc đã đếm hết. Không thì in `n lớp đã kiểm tra trên tổng 264` kèm tên lớp.
- 264 lớp là số dòng lớp chủ nhiệm **cộng** lớp bộ môn — riêng 6a2 đã 6 dòng. Đừng trình nó như con số đối chiếu được với sổ trường.
- Không suy ra một ngày là rỗng nếu không có lời gọi phủ ngày đó. RED viết "04/09 và 05/09 thì trống"; hai ngày đó có 195 bản ghi.
- Hạn gửi Phòng và các đầu mục Phòng yêu cầu thì **hỏi** — không đọc được từ đâu.

---

### UC-09 · Việc hệ thống đang chặn báo cáo

```
Vai    Ban giám hiệu, hoặc người phụ trách hệ thống
Muốn   "Vì sao báo cáo thiếu mục này?"
Để     Quyết định yêu cầu gì với đơn vị cung cấp hệ thống
```

Đây là một bản báo cáo thật, không phải lời xin lỗi. Nội dung: từng mục người dùng xin, cửa sổ đã hỏi, con số lấy được hoặc lý do không lấy được, và tên công cụ cộng cửa sổ đứng sau từng con số.

**Chặn** mỗi câu chẩn đoán phải truy được về một lời gọi và một tên trường. Cơ chế nào chưa có trường nào nói ra thì viết `chưa rõ nguyên nhân`. Xem `01-du-lieu-ths.md` mục 9 — đây là chỗ cả năm bản RED cùng sập.

---

## Phụ huynh và học sinh

### UC-10 · Tình hình học tập của con tôi

```
Vai    Phụ huynh
Muốn   "Tôi muốn xem báo cáo tình hình học tập của con tôi"
Để     Quyết định ở nhà kèm con chỗ nào, và có cần gặp giáo viên không
```

**Đọc** `search_students(query=tên)` → `get_student_profile` → `get_student_mission_status`, `get_student_exam_scores`, `get_student_attendance`.

**Hình** — nhẹ nhất trong cả kho: `kpiRow` ba ô, `stackedBar` nhiệm vụ, `lineChart` điểm theo thời gian. Không heatmap, không xếp hạng, không so với lớp.

**Chặn** — use-case này chặn nhiều nhất, vì sai ở đây làm phụ huynh lo về con họ:
- **Nhiều hơn một lớp chủ nhiệm thì dừng và hỏi lớp nào.** Không tự chọn.
- **Vai người hỏi lệch phạm vi token thì nói ra trong hai câu đầu**, trước khi trích số nào.
- **Không bôi đậm con số đáng lo.** Không in con số báo động trong đoạn "nếu báo cáo làm bừa thì ra thế này". Phụ huynh nhớ con số, không nhớ đoạn rút lại nó.
- Không in số `không đạt` trừ khi chính dòng đó có trường `passed`.
- Chuyên cần dùng `absent_dates`. **Không** dùng `marked_periods` — nó đếm qua mọi lớp em có mặt, một tuần ra 1663.
- Bản ghi tự mâu thuẫn — năm sinh sau hôm nay trừ một năm, khối lệch cấp học — thì **không khẳng định danh tính**. Hỏi xác nhận ngày sinh, lớp, mã học sinh, và nói rõ là chưa khớp chắc.
- Giọng: nói con đang ổn ở đâu trước, đang vướng ở đâu sau, và một việc làm được ở nhà. Không nhãn `yếu`/`kém`.

---

### UC-11 · Em tự xem mình

```
Vai    Học sinh
Muốn   "Cho em xem em đang học thế nào"
Để     Quyết định ôn lại phần nào, và nộp bù bài nào
```

Như UC-10, thêm ba luật:
- Chỉ dữ liệu của chính em đó. Không con số nào của bạn khác, kể cả trung bình lớp.
- Không xếp hạng, không so sánh với ai.
- Việc làm tiếp viết cho **em** làm được: "nộp bù bài X trước ngày Y", "xem lại câu dạng Z". Không viết việc của giáo viên.

---

## Luồng chung — khi không use-case nào khớp

Prompt người dùng vô hạn nên luồng này phải dựng được mọi thứ.

```
1  Định hướng      get_schedule() → ai hỏi, thấy được gì
2  Suy ba mảnh     phạm vi · khoảng thời gian · ai đọc   (02-hoi-lai.md)
3  Đọc thật        run_reads gộp, cửa sổ này + cửa sổ trước
4  Chốt quyết định Viết ra MỘT câu: bản báo cáo này giúp người đọc quyết định gì?
                   Không viết được câu đó thì hỏi lại — đó là dấu hiệu chưa hiểu yêu cầu.
5  Chọn chỉ số     Cắt mọi chỉ số không đổi được quyết định ở bước 4
6  Chọn hình       03-kho-bieu-do.md, theo hình dạng dữ liệu, không theo thẩm mỹ
7  Dựng trang      06-dung-trang.md
8  Bốn phép kiểm   01-du-lieu-ths.md mục 8
9  Cửa kiểm duyệt  agents/ — bốn lăng kính
10 Giao            file + tóm tắt trong chat + một dòng mời chỉnh
```

Bước 4 là bước hay bị bỏ và là bước quan trọng nhất. Bản báo cáo gửi tổ trưởng trong RED có năm mục, hai mươi lời gọi công cụ, và không phục vụ quyết định nào — người hỏi cần phổ điểm để bàn ngưỡng ôn tập, nhận về một bản kiểm toán chất lượng dữ liệu.

---

## Chỉ số nào chưa dựng được — nói thẳng, đừng lặng lẽ bỏ

Khi người dùng xin một trong những thứ này, trả lời là hệ thống chưa có công cụ, đừng vẽ xấp xỉ:

| Người dùng xin | Vì sao chưa được |
|---|---|
| Câu sai nhiều nhất | Không có công cụ đọc phòng thi nên `room_id` không lấy được; và `is_correct` tự mâu thuẫn với `score` |
| Báo cáo học kỳ | `lookup_reference` không có loại `term`, không có biên ngày |
| Hạnh kiểm, xếp loại | Không có dữ liệu |
| Điểm trung bình môn, bảng điểm | Không có công cụ |
| Học liệu, bài giảng đã dùng | Có công cụ ghi, không có công cụ đọc |
| Lịch sử liên lạc phụ huynh | Không có dữ liệu |
| Chuyên cần, trong môi trường hiện tại | `present` là 0 ở mọi nơi; xem cửa chốt ở `01-du-lieu-ths.md` |

Những dòng này vào mục **"Chưa dựng được, và vì sao"** ở cuối trang. Nó biến một chỗ thiếu thành một yêu cầu gửi được cho đơn vị vận hành.
