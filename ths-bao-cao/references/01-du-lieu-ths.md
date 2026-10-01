# Dữ liệu Trường học số — hợp đồng đọc

Mọi số trong báo cáo phải đến từ một lời gọi trong file này. Không có nguồn khác.

Hai server MCP: **`ths-giaovien`** (token giáo viên) và **`ths-school`** (token quản trị trường). Nạp lược đồ bằng `ToolSearch`.

---

## 1. Hai mươi công cụ đọc. Đây là danh sách trắng.

```
find_tools                    lookup_reference              run_reads
list_teacher_classes          get_class_roster              get_schedule
get_class_attendance_summary  get_class_exam_summary        get_class_mission_summary
get_student_profile           get_student_exam_scores       get_student_attendance
get_student_mission_status    find_at_risk_students         search_students
list_exams                    list_exam_answers             search_questions
list_teaching_assignments     get_school_overview           (get_school_overview chỉ có trên ths-school)
```

**Không bao giờ gọi** `run_tool` — nó là bộ điều phối có thể ghi. Không bao giờ gọi bất cứ tên nào bắt đầu bằng `create_ update_ delete_ add_ remove_ set_ mark_ grade_ attach_ detach_ block_ pin_ replace_ clear_ rate_`. Báo cáo là việc đọc.

`find_tools` gắn nhãn `kind: "đọc"|"ghi"` cho từng công cụ, nhưng **đừng dùng nó để tìm việc**: hỏi nó "báo cáo tình hình học tập lớp trong tuần" thì 13 trong 20 kết quả là công cụ ghi, và nó **bỏ sót hẳn** `get_class_attendance_summary`. Mô tả của nó còn dặn chạy kết quả qua `run_tool`. Dùng danh sách trắng ở trên, không dùng nó.

`run_reads` gộp **tối đa 5** công cụ đọc trong một lượt, nhận **tên không tiền tố** (`get_class_roster`, không phải `mcp__ths-school__get_class_roster`), và tự chối công cụ ghi. `class_id` dùng chung được cho cả hai server — UUID là toàn cục.

## 2. Định danh — ai đang hỏi

Token giáo viên **tự suy ra người gọi**, không có tham số `teacher_id` ở đâu cả. Phép kiểm tra sức khoẻ rẻ nhất, luôn chạy đầu tiên:

```
get_schedule()   →  mode:"teacher_self", tên giáo viên, và đúng tuần này
```

Ngược lại, công cụ theo học sinh **không** tự suy ra học sinh — `get_student_profile()` không tham số là lỗi ngay. Phải giải `student_id` qua `get_class_roster` hoặc `search_students` trước.

Phạm vi quyền do token quyết định, trên **cùng một tên công cụ**: `list_teacher_classes(query="6a2")` trả 4 lớp với token giáo viên và 6 lớp với token trường. Nghĩa là **cùng một báo cáo sẽ khác nhau theo vai** — đó là thiết kế, không phải lỗi. Không tự đắp thêm phân quyền trong skill; dựng trên đúng phần dữ liệu token nhìn thấy.

Nếu vai người yêu cầu không khớp phạm vi token (ví dụ phụ huynh hỏi nhưng đang dùng token quản trị trường), **nói ra trong hai câu đầu, trước khi trích bất kỳ số nào**, rồi hỏi có tiếp không.

## 3. Cửa sổ thời gian — chỗ sai nhiều nhất

Mọi công cụ có lọc ngày đều nhận `from`/`to` dạng `YYYY-MM-DD`, lọc **thật ở phía server**, và **dội lại** cửa sổ nó đã dùng trong phản hồi.

Mặc định khác nhau theo công cụ, và đây là nguồn sai lặng lẽ:

| Công cụ | Cửa sổ mặc định nếu không truyền ngày |
|---|---|
| `get_class_attendance_summary` | **14 ngày** |
| `get_class_mission_summary`, `find_at_risk_students`, `get_school_overview` | **30 ngày** |
| `get_class_exam_summary`, `get_student_exam_scores` | **90 ngày** |
| `get_schedule` | **7 ngày** từ hôm nay |

**Luật cứng:** in ra cửa sổ mà phản hồi **dội lại**, không in cửa sổ mình đã yêu cầu, và không in lại theo cách người dùng nói. Mỗi khối số mang cửa sổ của chính lời gọi sinh ra nó. Số nào không có cửa sổ đứng cạnh thì **xoá khỏi bản báo cáo**, không phải làm nhẹ đi.

Khi cửa sổ dội lại khác cửa sổ đã xin, in cả hai: `yêu cầu từ 01/03, hệ thống chỉ trả từ 10/06`.

Đúng một cửa sổ, một dòng đầu trang, ghi theo từng loại dữ liệu:

```
chuyên cần 31/08–06/09 · kiểm tra 10/06–07/09 · nhiệm vụ 01/08–07/09 · thời khoá biểu 07/09–13/09
```

RED đo được: **5/5 bản thử đều trượt luật này.** Nó là luật số một vì thế.

## 4. Giới hạn danh sách — không có phân trang

Không công cụ báo cáo nào có `cursor`, `offset` hay `limit`. Danh sách bị cắt là cắt.

| Công cụ | Trần | Câu ghi chú nó trả về |
|---|---|---|
| `get_school_overview` | 20 trường | `Chỉ hiển thị 20 trường` |
| `get_class_exam_summary` | 30 phòng thi | `Chỉ hiển thị 30 bài gần nhất; hãy thu hẹp khoảng ngày.` |
| `get_student_exam_scores` | 50 lượt nộp | `Chỉ hiển thị các bài nộp gần nhất...` |
| `list_exams` | 60 bộ đề | `Đã đạt giới hạn 60 bộ đề` |
| `list_teacher_classes` | **60 lớp** khi không lọc tên | `Đã đạt giới hạn 60 lớp; hãy lọc theo tên lớp.` |
| `run_reads` | 5 lời gọi | — |
| `find_tools` | 20 công cụ | — |

**Luật cứng:** nếu độ dài danh sách **bằng** một trong các trần này, thì hoặc gọi lại với cửa sổ hẹp hơn cho đến khi không còn ghi chú, hoặc in kèm câu `danh sách bị giới hạn N mục, có thể còn nữa`. Con số bị cắt là **sàn**, không phải tổng. Và trên danh sách đó **cấm** các từ `toàn bộ`, `tất cả`, `duy nhất`, `không có ... nào`.

Nếu phản hồi có trường `note`, **in nguyên câu đó cạnh mọi số rút ra từ phản hồi ấy** — trong thân báo cáo, không phải trong phần ghi chú kỹ thuật ở cuối.

RED đo được: **5/5 bản thử đều in danh sách bị cắt như thể là tổng.**

## 5. Hình dạng phản hồi và cái bẫy của từng công cụ

Mọi phản hồi dạng danh sách đều có `_count`, `_unit` (`học sinh`, `lớp`, `bài kiểm tra`, `nhiệm vụ`, `tiết`, `bộ đề`, `buổi`...), và `note` khi bị cắt hoặc rỗng. Mỗi phản hồi còn mang gợi ý `_widget` — dùng nó để chọn mục trong trang:

```
roster_table · attendance_table · attendance_summary · score_dist · score_list · mission_table · at_risk_table
```

### `list_teacher_classes` — bước không

Không tham số ngày. Trả `class_id, name, grade, kind ("homeroom"|"subject"), subject, student_count`.

Đây **luôn** là lời gọi đầu tiên khi báo cáo theo lớp. Lý do ở mục tiếp theo.

**Bẫy 1 — có trần 60, và nó cắt ngang.** Gọi không tham số thì trả đúng `_count: 60` kèm `note: "Đã đạt giới hạn 60 lớp; hãy lọc theo tên lớp."`, và 60 dòng đó xếp theo tên nên **dừng ở khối Lớp 12** — chưa bao giờ tới `6a2` hay `Lớp 9A2`. Nghĩa là **không có đường đọc nào liệt kê được mọi lớp bộ môn của một lớp chủ nhiệm**. Cách duy nhất là `query=<tên lớp>`, khớp chuỗi con không phân biệt hoa thường. Môn nào đặt tên không chứa tên lớp thì vĩnh viễn không tìm ra, nên mọi câu về độ phủ môn học phải hiểu là **độ phủ theo khớp tên**, không phải độ phủ thật.

**Bẫy 2 — chỉ trả về lớp mà người gọi thấy.** Không suy ra cấu trúc trường, danh sách môn của một lớp, hay danh sách giáo viên từ nó. Và phạm vi lệch nhiều hơn tưởng: `query="6a2"` cho 4 dòng với token giáo viên, **6** với token trường. Kết luận nào dựa trên "đã quét hết lớp con" phải đọc lại bằng token trường.

**Bẫy 3 — tên gần trùng không quy được về lớp nào.** `query="9A2"` với token trường trả 14 dòng, trong đó có một lớp tên `lớp 9a2` nhưng `grade: "Lớp 1"` với 4 học sinh, kèm bảy lớp bộ môn viết thường đi theo nó.

### Nhiệm vụ và thời khoá biểu gắn vào lớp BỘ MÔN, không phải lớp chủ nhiệm

Đây là bẫy đắt nhất. Đo thật:

```
get_class_mission_summary(6a2 chủ nhiệm)  → mission_count 0
get_class_mission_summary(6a2 Toán)       → mission_count 1  ("nhiệm vụ bộ đề 2")
get_schedule(6a2 chủ nhiệm)               → count 0
```

Bản gửi hiệu trưởng trong RED đã kết luận "toàn trường không có gì để viết" chính vì lỗi này — trong khi sự thật là 21/22 em không nộp một nhiệm vụ đã quá hạn.

**Luật cứng:** trước bất kỳ câu `lớp không có X`, phải lấy mọi dòng `kind=="subject"` có tên bắt đầu bằng tên lớp chủ nhiệm, gọi vòng qua từng lớp đó, và **liệt kê các `class_id` đã hỏi** ngay cạnh kết luận. Số 0 đọc từ `class_id` của lớp chủ nhiệm phải viết là:

> không đọc được ở lớp chủ nhiệm — nhiệm vụ và tiết học gắn vào lớp bộ môn

chứ không phải `lớp không có nhiệm vụ`.

### `get_class_roster`

Bắt buộc `class_id`, không có tham số ngày. Trả `members[]` với `student_id, full_name, code, role`.

**Bẫy 1:** giáo viên chủ nhiệm nằm trong `members[]` với `role:"teacher"`. Sĩ số là `members.filter(m => m.role === "student").length`. **Không bao giờ** in `_count`, `student_count`, hay độ dài mảng dưới chữ "học sinh" hay "sĩ số". Nếu ba con số đó lệch nhau thì in cả ba và dừng lại. Lớp nào chưa gọi `get_class_roster` thì **không được có sĩ số** trong báo cáo.

**Bẫy 2:** sổ lớp thật có tên gần trùng — `Chu Minh Anh` hai lần (mã `060199019898` / `080199019898`), `Doãn Hà Anh` hai lần, `Doãn Việt Anh` hai lần, và `Bùi Tú` cạnh `Bùi Tú Anh`. Khoá mọi bảng theo `student_id`, phân biệt khi hiện bằng `code`.

### `get_class_attendance_summary`

Bắt buộc `class_id`; `from`/`to` tuỳ chọn, mặc định 14 ngày. Trả tổng lớp `{present, absent, late, absent_rate_pct}` cộng từng em `{student_id, full_name, present, absent, late, absent_rate_pct, recent_absent_dates[5]}`, đã sắp xấu-trước.

**Chốt điểm danh — luật cứng.** Trong môi trường hiện tại, `present` là 0 và `absent_rate_pct` là 100 với **mọi** em ở **mọi** lớp, cả ở mức trường (109.941 trên 109.942 bản ghi). Khi thấy `present == 0` và `absent_rate_pct == 100` trải khắp sổ lớp:

- dựng **một** dòng chất lượng dữ liệu, ghi rõ số thô làm bằng
- **không** in một con số chuyên cần nào ở bất kỳ đâu khác — không tỉ lệ, không dòng bảng, không tổng
- **không** vẽ biểu đồ chuyên cần
- **không** đoán cơ chế. Câu `chưa ai chốt điểm danh nên hệ thống mặc định là vắng` là **bịa** — không trường nào trả về trạng thái buổi điểm danh. Viết `số liệu điểm danh chưa dùng được, nhờ quản trị kiểm tra` kèm số thô.

**Bẫy đếm:** `recent_absent_dates` bị cắt còn 5 mục — **không bao giờ** dùng nó làm số ngày. Mẫu số theo ngày hay theo tiết **chỉ** được lấy từ `get_schedule`. Nếu `get_schedule` trả 0 tiết thì báo cáo **không được** khẳng định số ngày hay số tiết nào, và không tỉ lệ nào được dùng nó làm mẫu số.

**Bẫy chiều:** lớp báo `absent_rate_pct` (chiều xấu) còn học sinh báo `attendance_rate_percent` (chiều tốt). Chuẩn hoá về một chiều trước khi in.

### `get_student_attendance`

Trả `{present, absent, late, excused, marked_periods, not_marked, attendance_rate_percent, absent_dates[]}` — công cụ duy nhất có `excused` và `not_marked`.

**Bẫy:** nó đếm mọi dòng điểm danh trên **tất cả** lớp em đó có mặt. Một cửa sổ 7 ngày trả về `marked_periods: 1663` cho một em có 20 lớp chủ nhiệm. Con số đó vô nghĩa với người đọc. Dùng `absent_dates` (7 ngày phân biệt) cho phần người đọc thấy.

### `get_class_exam_summary`

Bắt buộc `class_id`; mặc định 90 ngày. Khoá theo **phòng thi**, không phải bộ đề. Trả `{exam, date, submissions, students, passed_count, average_percent, min_percent, max_percent}`, đầu trang có `average_percent` và `exam_count` mức lớp. Trần 30 dòng.

**Bẫy từ vựng — chặn cứng.** Trường `exam` chứa **tên phòng thi** (`Phòng thi 5`, `Phòng thi theo ca NAT 99`, `Đạt 100`) và những tên đó **không tồn tại** trong `list_exams`. In ra phải gọi là **"phòng thi"** hoặc **"ca thi"**. Chỉ được gọi là "bài kiểm tra" hay "đề" sau khi khớp được `exam_id` trong `list_exams` **trong cùng phiên**.

**Bẫy khoá thiếu.** Một số dòng **không có** `average_percent`/`min_percent`/`max_percent` — không phải `null`, mà là **không có khoá** (phòng tự luận chưa chấm). Kiểm bằng `hasOwnProperty`, đừng kiểm giá trị đúng-sai. Khoá thiếu in là `chưa chấm` hoặc `chưa có điểm`, **không bao giờ** là `0`, `0%`, `—`, trống, `NaN`, `undefined`. Và đếm riêng: `x phòng có điểm, y phòng chưa chấm`. Dòng thiếu khoá phải **loại khỏi mọi phép tính trung bình**, kèm câu nói đã loại bao nhiêu dòng.

**Bẫy tách theo lớp.** Nếu cùng công cụ trả về **danh sách dòng giống hệt nhau** cho hai `class_id` khác nhau, thì **không** kết luận theo lớp nào từ công cụ đó — kể cả kèm lời cảnh báo. RED gặp đúng chuyện này với 9A2 Toán, 6a2 Toán và Lớp 7A Toán.

### Phổ điểm và câu sai nhiều nhất — cái gì làm được, cái gì không

**Không có công cụ nào trả về phổ điểm.** Không khoảng, không bucket, không phân tích câu ở mức lớp.

Làm được: **theo từng phòng thi** — bao nhiêu lượt nộp, bao nhiêu em phân biệt, trung bình, cao nhất, thấp nhất, bao nhiêu em đạt.

Muốn có phổ điểm thật thì phải **quét** `get_student_exam_scores` qua từng dòng `role=="student"` của sổ lớp rồi tự chia khoảng. Quy tắc: **sổ lớp ≤ 50 em thì quét**, và ghi rõ trong báo cáo là **do skill tự tính**, kèm số em đã quét. Trên 50 em thì nói thẳng là chưa dựng được, đừng quét nửa vời.

**Phân tích câu sai nhiều nhất thì không làm được, hết.** `list_exam_answers` là một-học-sinh-một-phòng, và `room_id` **không lấy được bằng đường đọc** — không server nào có công cụ đọc phòng thi (có 11 công cụ ghi, không có công cụ đọc). Bỏ trống `room_id` thì nó trả "lượt thi gần nhất đã nộp", không phân biệt phòng. Nên bảng câu sai nhiều nhất phải **từ chối tường minh**, đừng vẽ một nửa. Đây là việc cần thêm công cụ ở server, ghi vào phần "chưa dựng được" của trang.

### `get_student_exam_scores`

Trả **từng lượt nộp thô**, không gộp theo đề: `{exam, date, score, total_score, percent, passed}`. Nộp lại nhiều lần thành nhiều dòng (`Đạt 100` xuất hiện 9 lần). Trần 50 dòng.

**Bẫy:** `total_score` có thể là 0 và khi đó **không có** khoá `percent`. Trung bình tính trên các dòng đó là rác — RED có một bản in "trung bình 17,7%" chỉ vì đếm khoá thiếu thành 0.

**Bẫy `passed`:** nó `true` ở 23,5% và 30% nhưng `false` ở 10%, vì ngưỡng đạt là thiết lập **của từng phòng thi** (`pass_score_percent`). Nên tỉ lệ đạt **không so được** giữa các phòng. Và không được in số "không đạt" trừ khi chính dòng đó có trường `passed`.

### `get_class_mission_summary` — chỉ số sạch nhất hiện có

Bắt buộc `class_id`; mặc định 30 ngày. Trả `{title, assigned_at, deadline, overdue, started, submitted, pending, average_score}` cộng `{mission_count, student_count, overdue_open}`.

Dòng thật của 6a2 Toán: `nhiệm vụ bộ đề 2`, giao 24/08, hạn 28/08, `overdue: true`, `started 22`, `submitted 1`, `pending 21`, `average_score 0`.

Đây là **chỉ số duy nhất có giá trị thật, sạch, dễ hiểu** trong môi trường hiện tại. Dựng phần chính của báo cáo tuần quanh nó. Tỉ lệ phải tự tính (`submitted / student_count`) — công cụ cho số đếm và `student_count`, không cho tỉ lệ.

### `get_student_mission_status`

Trả `{title, class_name, deadline, status, score, overdue}` cộng `{by_status, total, not_started, overdue_not_done, avg_score_of_done}`. Trạng thái thấy được: `DONE`, `INPROGRESS`.

**Bẫy:** 4 trong 10 dòng có `title` rỗng và không có `class_name`/`deadline`. Bỏ qua hoặc gắn nhãn, đừng in dòng trắng.

### `find_at_risk_students`

Mọi tham số tuỳ chọn (`class_id`, `from`, `to`, `min_absences` mặc định 3); mặc định 30 ngày. Công cụ **duy nhất** nối chuyên cần với học lực trong một lời gọi: `{student_id, full_name, class_name, absent, late, sessions, absent_rate_pct, exam_count, average_percent}`.

**Bẫy `class_name` — chặn cứng.** Trường này **sai**. Truyền `class_id` của 6a2 mà nó trả về `6a2 Âm nhạc`, `12A10`, `12A11 (Đạt test)`, `13A13`. **Không bao giờ in `class_name` từ công cụ này, cũng không in từ `search_students`.** Tên lớp chỉ lấy từ `list_teacher_classes` hoặc từ đầu phản hồi của chính công cụ tổng hợp, khoá theo `class_id`.

**Bẫy khoá thiếu:** `average_percent` và `exam_count` **không có khoá** với em chưa nộp bài nào, không phải bằng 0.

Và một luật liên đới quan trọng: **khi báo cáo đã tuyên bố một công cụ không đáng tin, thì không trường nào khác trong cùng phản hồi đó được làm nguồn duy nhất cho một câu khẳng định.**

### `list_teaching_assignments` — chỗ duy nhất lấy được TÊN GIÁO VIÊN

Gọi với `query` là tên lớp (`"6a2"`), tên giáo viên, hoặc tên môn. Mỗi dòng có `class_name`, `subject`, `teacher`, `weekday`, `period`, `room`, `term`.

Đây là công cụ trả lời câu **"ai đang dạy lớp này"**. Vòng thử thứ tư, tổ trưởng bác cả bản vì lý do này: *"Bảo tôi làm mà không cho tôi người. Có hai lớp thôi mà cũng không ghi giúp tôi ai đang dạy."* Việc-làm-tiếp nào chỉ tới một người khác thì gọi công cụ này lấy tên trước.

Ba cái bẫy:

**Một dòng là một tiết, không phải một phân công.** Hỏi `"6a2"` trả về 15 dòng cho 5 môn — Hoá học chiếm 7 dòng vì tuần có 7 tiết. Muốn đếm môn hay đếm giáo viên thì gộp theo `subject` hoặc theo `teacher` trước, đừng đếm `_count`.

**Trên `ths-giaovien`, giáo viên chỉ thấy phân công của chính mình.** Hỏi từ token giáo viên mà trả về rỗng thì nghĩa là *token này không được xem*, không phải *lớp không có ai dạy*. Tổ trưởng và hiệu trưởng phải hỏi qua `ths-school`. Đọc không ra tên thì viết việc cho **người đang đọc** làm, đừng viết một việc treo lơ lửng không ai đứng tên.

**Trường `teacher` có khi là tên tài khoản, không phải tên người.** Vòng thử thứ năm in ra *"cô truonghaiyen đứng lớp"*, trong khi lớp bên cạnh ghi đàng hoàng *"thầy Nguyễn Khang"*. Tổ trưởng: *"câu này tôi không đưa vào biên bản họp tổ được, phải sửa tay."*

Nhận ra bằng hình dạng: **viết liền không dấu cách, hoặc không có dấu tiếng Việt**. Gặp dạng đó thì **in nguyên chuỗi và bỏ chữ thầy/cô đi** — *"lớp 6a1 Toán do tài khoản `truonghaiyen` đứng lớp"* — rồi thêm một câu ngắn là hồ sơ chưa có họ tên đầy đủ. Đừng đoán giới tính, đừng bịa họ tên, và cũng đừng giấu chuỗi đó đi: người đọc mở phần mềm ra là tra được.

**Có dòng Chủ nhật và dòng Học kỳ 2.** Cùng một cái bẫy đã ghi ở `get_schedule`. Lọc theo `term` của khoảng đang báo cáo, và đừng hẹn người đọc gặp lớp vào một buổi lấy từ dòng cuối tuần.

### `get_schedule`

Mọi tham số tuỳ chọn; mặc định 7 ngày từ hôm nay. Trả từng tiết thô `{date, weekday, session, period, start, end, subject, class_name, teacher, room}` và dội lại `mode` (`teacher_self` | `class`).

Đây là công cụ "tuần này" sạch nhất — `from`/`to` định nghĩa tuần trực tiếp.

**Bẫy — trong môi trường này, thời khoá biểu CHỈ có tiết cuối tuần.** Đo 45 ngày (01/08–14/09/2026) trên 12 lớp quy được về `6a2` và `Lớp 9A2`: chỉ 3 lớp có tiết, tổng 28 dòng, và **cả 28 dòng đều mang thứ Bảy hoặc Chủ nhật**. Không một dòng nào thứ Hai đến thứ Sáu.

Nghĩa là **mọi khoảng ngày thường sẽ trả về 0 tiết**, và con số 0 đó **không phải một phát hiện** — nó là tình trạng đã biết của môi trường phát triển. Đừng dựng mục cho nó, đừng dựng bảng cho nó, đừng đi tìm nguyên nhân. Một dòng là đủ, rồi chuyển sang chỉ số còn sống.

Không giả định tuần là thứ Hai đến thứ Sáu. Và `count == 0` phải viết là `không có tiết nào trong khoảng <from>–<to>`, trích nguyên `note`. Câu `chưa được xếp thời khoá biểu` bị **cấm** trừ khi có thêm một lời gọi trên cửa sổ rộng hơn để chứng minh.

### `get_school_overview` — chỉ trên `ths-school`

**Không phải một trường.** Nó trả **danh sách 20 trường toàn nền tảng**, không có tham số lọc trường. `classes`/`students`/`teachers` là tổng của cả năm học và **không đổi theo `from`/`to`**; chỉ khối chuyên cần theo cửa sổ.

**Luật cứng:** chọn đúng một dòng khớp tên trường đích, in `school_year` của nó, và nói một câu là đã bỏ các dòng còn lại. **Không** in `_count`, **không** cộng gộp, **không** lấy trung bình qua các dòng, **không** trích số từ dòng khác. Và số chuyên cần của nó **không được** gắn nhãn `toàn trường` hay `trường mình` trừ khi đã lọc theo trường.

Bối cảnh: chỉ `THCS Giảng Võ Hà Nội` có dữ liệu thật (264 lớp, 561 học sinh, 214 giáo viên, năm học 2025–2026). 17 dòng còn lại là trường test rỗng trên năm 2026–2027. Và 264 lớp là số dòng lớp chủ nhiệm **cộng** lớp bộ môn — riêng 6a2 đã 6 dòng — nên đừng trình nó như con số hiệu trưởng đối chiếu được với sổ trường.

### `lookup_reference`

Nhận đúng 8 loại: `bank, difficulty, grade, position, program, question_category, school_year, subject`.

**Không có loại `term`.** Nghĩa là báo cáo theo học kỳ **không xác định được biên ngày từ tầng MCP**. Khi người dùng xin "báo cáo học kỳ I", phải hỏi biên ngày, hoặc dựng theo khoảng ngày tường minh và nói rõ đó là khoảng do người dùng cho, không phải mốc học kỳ của hệ thống.

`school_year` **khác nhau theo token, và không đơn định**. Token giáo viên: 2 dòng, một dòng có ghi chú `năm học hiện tại`. Token trường: **53 dòng, 27 dòng cùng mang ghi chú đó**, 26 trong số ấy tên `2026 - 2027`. Nên luật "chọn dòng có ghi chú năm học hiện tại" không chọn được một dòng — phải ghi rõ đã đọc bằng token nào, và nếu cần năm học thì hỏi người dùng.

### `list_exams`, `search_questions`, `list_exam_answers`

`list_exams` là bộ chọn để soạn đề, **không phải nguồn báo cáo**: không tham số ngày, không thống kê, không môn, không khối, không số câu. Trần 60, và 48 trong 60 là bản nháp (`draft: true`), phần lớn là dữ liệu rác (`123` sáu lần, `tétttttet`, `dfgdfg`).

`list_exam_answers` là công cụ duy nhất có mức từng câu: `{question_id, question, max_score, score, graded, is_correct}`.

**Bẫy 1 — mã HTML thô.** Trường `question` là HTML nguyên, có cả markup toán: `<p><math-inline class="math-node" data-latex="">$\lambda$</math-inline></p>`. **Phải bóc thẻ và thuộc tính `data-latex` trước khi vào trang**, cắt còn 120 ký tự. Không dán markup thô.

**Bẫy 2 — số liệu tự mâu thuẫn.** Có dòng `is_correct: true` với `score 0` và `max_score 0`, và dòng `is_correct: true` với `score 0.3` trên `max_score 1`. Nên **độ khó theo câu tính từ đây là không đáng tin**. Không dựng bảng câu khó từ nó.

---

## 6. Cửa dữ liệu bẩn — chạy trước khi gọi bất cứ số nào là hợp lý

Đây là môi trường staging và nó bẩn thật. Chạy các phép này trên mọi sổ lớp đã đọc, và **liệt kê phép nào trượt**:

- **tên trùng** trong `members[]` sau khi lọc `role=="student"`
- **số lớp chủ nhiệm trên một em** — em `Nguyễn An` nằm trong **20 lớp chủ nhiệm** cùng lúc
- **năm sinh vô lý** — cùng em đó có `date_of_birth: 2025-10-28`
- **khối lệch** — profile ghi `Lớp 12` trong khi em có mặt ở sổ lớp `Lớp 6`
- **tên có dạng dữ liệu thử** — `test`, `Test import`, `QA`, `staging`, `Học viên NN`

Tổng nào trượt một phép thì in là `chưa đối chiếu được`, **không** in là `hợp lý`. Dòng dạng dữ liệu thử **loại khỏi mọi mẫu** và đếm riêng; chúng không bao giờ được nằm trong một con số đếm "em" hay "học sinh".

**Nếu `get_student_profile` trả về nhiều hơn một lớp chủ nhiệm: dừng lại và hỏi người yêu cầu là lớp nào**, trước khi đọc theo lớp. Không tự chọn im lặng, và không trình lớp đã chọn như thể đó là lớp của em.

**Không khẳng định danh tính** từ một bản ghi có trường tự mâu thuẫn. Hỏi xác nhận ngày sinh, lớp và mã học sinh, và nói rõ là chưa khớp chắc.

---

## 7. So sánh với kỳ trước — skill phải tự tính

**Không công cụ nào trả về `delta`, `previous`, `trend`, `change` hay `last_period`.** Đã soi toàn bộ thân phản hồi của cả 12 công cụ đọc.

Mẫu đúng: gọi **hai lần** — một lần cửa sổ này, một lần cửa sổ liền trước — rồi tự trừ. `run_reads` (5 lời gọi) cho phép lấy hiện tại + trước đó cho hai chỉ số trong một lượt.

**Luật cứng:** mọi câu có `tăng`, `giảm`, `so với tuần trước`, `cải thiện`, `tụt` đều đòi **một lời gọi thứ hai đã thực thi trên đúng cửa sổ trước**, dẫn cả hai cửa sổ ngay tại chỗ. Không có lời gọi đó trong log thì **xoá câu**, không làm nhẹ đi.

Và xử đúng trường hợp cửa sổ trước rỗng: hiện `kỳ trước chưa có dữ liệu`, **không phải** `giảm 100%`.

Delta nào cũng dán nhãn **do skill tự tính**, vì nó đúng là vậy.

---

## 8. Bốn phép kiểm bắt buộc trước khi giao

Chạy hết bốn phép này trên bản nháp. Trượt phép nào thì sửa, không giao.

**1 · Truy nguồn từng số.** Mỗi số trong bản ra phải khớp với **một lời gọi đã log** cộng **một tên trường**. Số không khớp thì **xoá**, không làm nhẹ. Đây là lý do trang phải xuất kèm file JSON đồng hành (xem `06-dung-trang.md`) — để phép kiểm này chạy được bằng máy chứ không bằng mắt.

**2 · Từ chỉ lượng phải có bằng chứng đếm.** Các từ `phần lớn`, `hầu hết`, `gần như`, `đa số`, `nhiều em` phải có ngay sau nó bằng chứng dạng `x/y`. Chưa đếm thì **cấm dùng từ đó**.

**3 · Cỡ mẫu và phủ định tuyệt đối.** Câu nói về cả lớp rút từ các lần đọc theo từng em phải in cỡ mẫu (`đã tra 2/22 em`). Các từ `từng em`, `tất cả`, `không em nào` chỉ được dùng khi đã hỏi **mọi** dòng `role=="student"` trong phiên này. Và phủ định tuyệt đối từ một lần đọc có cửa sổ bị **cấm**: `không có bài nào`, `tuyệt đối trống`, `tất cả đều không` → dạng duy nhất được phép là `trong khoảng <from>–<to>, tài khoản đang truy cập không thấy bài nào`.

**4 · Không tự mâu thuẫn.** Một bộ dữ liệu không được vừa bị gắn nhãn `chạy thử`/`chưa dùng được` ở đoạn này vừa được gọi là `thật`/`chính xác`/`đáng tin` ở đoạn khác. Và một con số đã in rồi lại được sửa trong cùng tài liệu thì **chỉ bản đã sửa được xuất hiện**.

---

## 9. Nguyên nhân — chỗ RED sập nặng nhất

Cả năm bản thử đều **không** bịa con số. Chúng bịa **chẩn đoán**. Bản gửi hiệu trưởng viết `thứ Sáu 04/09 và thứ Bảy 05/09 thì trống` — hai ngày đó có 195 bản ghi, và không lời gọi nào phủ khoảng đó.

**Luật cứng:** không câu nào về nguyên nhân, cơ chế, hay bản chất dữ liệu được nói như sự thật, trừ khi có một trường trả về nói đúng điều ấy.

Các từ mở đầu câu nhân quả — `là vì`, `do`, `nghĩa là`, `bởi` — đều phải dẫn được tên lời gọi lập nên nó, hoặc viết lại thành `chưa rõ nguyên nhân`.

Dạng đúng cho một bất thường:

> Số liệu không khớp: `get_class_attendance_summary` trả present 0 / absent 880 cho cả 22 em trong khoảng 25/08–07/09. Chưa rõ nguyên nhân, phù hợp để nhờ quản trị Trường học số kiểm tra.

Dạng bị cấm — đều lấy nguyên từ RED:

> ~~Nghĩa là sổ điểm danh chưa được chốt (chưa ai điểm danh thì hệ thống mặc định tính là vắng)~~
> ~~Đây là bài do bên kỹ thuật tạo để thử hệ thống~~
> ~~Đây là dữ liệu máy sinh ra, không phải giáo viên điểm danh~~
> ~~Học sinh thật thì không bao giờ đều tăm tắp như thế~~

Phỏng đoán nguyên nhân, nếu có, đi vào **một dòng duy nhất gắn nhãn "phỏng đoán"**, không rải trong thân báo cáo.

Và câu khẳng định dữ liệu là demo/giả **đòi** ít nhất một lần đọc chứng minh được (ví dụ `get_student_profile` trên đúng những em được nêu, cộng bất thường ấy tái hiện ở một lớp khác), và phải viết thành **câu hỏi để giáo viên xác nhận**, không phải phát hiện về lớp của họ.

Các từ chắc chắn — `chắc chắn`, `hoàn toàn`, `tuyệt đối`, `rõ ràng` — bị **cấm** trên mọi suy luận từ dữ liệu thô. Thay bằng `có dấu hiệu`, `cần kiểm tra lại`.

---

## 10. Lớp có dữ liệu thật để thử

Dùng lớp bộ môn, đừng dùng lớp chủ nhiệm:

| Lớp | `class_id` | Có gì |
|---|---|---|
| `6a2 Toán` | `53182ce9-0ad8-4714-863a-4fe26c5d62fe` | 22 em, 1 nhiệm vụ (started 22 / submitted 1 / pending 21, quá hạn), 12 phòng thi trong tháng 8 |
| `Lớp 9A2 Toán` | `3e7f9528-79cc-4df8-81ea-1d8643a71ee2` | 48 em, giữ các nhiệm vụ có hạn thật |
| `6a2` (chủ nhiệm) | `50754124-b277-4799-b5c6-816ee6dda382` | 22 em, **0 nhiệm vụ, 0 tiết** — dùng để thử đúng bẫy lớp chủ nhiệm |

Lưu ý: dữ liệu bài thi truy về **đúng một em nộp** (`Nguyễn An`), nên mọi bản phổ điểm dựng ở đây sẽ trông thoái hoá cho tới khi có dữ liệu mồi tốt hơn. Đó là chuyện của dữ liệu, không phải của skill.

---

## 11. Việc cần server bổ sung — ghi vào trang, đừng lặng lẽ bỏ

Những thứ này chặn nội dung báo cáo mà ai cũng sẽ hỏi. Khi người dùng xin mà không làm được, nói thẳng là thiếu công cụ ở hệ thống:

- **không có công cụ đọc phòng thi** → chặn phổ điểm đúng cách và chặn hẳn phân tích theo câu
- **không có mốc học kỳ** (`lookup_reference` chối `term`) → báo cáo học kỳ không có biên
- **không có công cụ chia khoảng điểm** ở mức lớp
- **không có công cụ đọc** cho học liệu, bài giảng, phân công giảng dạy, buổi điểm danh — dù công cụ ghi cho cả bốn đều có
- **không có dữ liệu hạnh kiểm**, không có điểm trung bình môn / bảng điểm, không có lịch sử liên lạc phụ huynh
- **không có phân trang** trên mọi danh sách bị cắt
