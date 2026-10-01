---
name: ths-bao-cao
description: Use when anyone asks to create, build, redo, or export a report from Trường học số (THS) school data — for a class, a subject, one student, a grade level, or a whole school. Applies to any role asking: subject teacher, homeroom teacher, department head, principal, school staff, parent, or a student viewing themselves. Triggers on: báo cáo, làm báo cáo, tạo báo cáo, dựng báo cáo, xuất báo cáo, báo cáo tuần, báo cáo tháng, báo cáo học kỳ, báo cáo điểm, báo cáo điểm số, báo cáo kỳ thi, phổ điểm, báo cáo chuyên cần, báo cáo điểm danh, báo cáo nhiệm vụ, báo cáo lớp, báo cáo học sinh, báo cáo toàn trường, tình hình học tập, kết quả học tập, học sinh cần quan tâm, so sánh lớp, gửi phụ huynh, họp phụ huynh, báo cáo gửi Phòng, report, school report, class report, student report, exam report, attendance report, weekly report, score distribution, at-risk students.
---

# Báo cáo Trường học số

**REQUIRED SUB-SKILL:** skill `humanized`. Bản gắn cứng cho báo cáo: `references/05-giong-humanized.md`.

Skill này là **kim chỉ nam cho mọi loại báo cáo, mọi vai** — không phải danh mục có sẵn. Người dùng hỏi gì cũng được: một lớp, một em, một môn, cả khối, cả trường, kho học liệu, đội ngũ, thiết bị.

<HARD-GATE>
Bốn luật, theo thứ tự. Luật trước thắng luật sau.

1. **Nói cho người đọc điều họ chưa biết về thứ họ hỏi.** Đọc xong mà họ không biết thêm gì thì bản đó trượt, dù mọi con số đều đúng.
2. **Dữ liệu hỏng là ghi chú, không phải nội dung.** Chỉ số chết thì nói một lần, ngắn, rồi tự chuyển sang chỉ số còn sống của cùng phạm vi.
3. **Nói đúng về thế giới của người đọc.** Không kể chuyện từ nguồn vừa gắn nhãn không tin được.
4. **Luôn kết thúc bằng một file HTML trong tay người hỏi.** Mọi câu về nguyên nhân truy được về một lời gọi và một tên trường.
</HARD-GATE>

## Hợp đồng trang

Trang **có** đúng sáu phần này, theo thứ tự. Mỗi phần kèm luật của chính nó.

### 1 · Một câu trả lời

Câu đầu tiên trả lời thẳng điều người hỏi hỏi, và nó là câu duy nhất người bận đọc.

- Nói được **một việc làm được**, không dựng từ con số skill đã biết là vô nghĩa.
- **Việc gấp nhất đứng trước.** Chỉ số được hỏi đã chết thì câu này có hai vế và **vế việc-làm-được đi trước**: *"Bài 'bộ đề 2' hạn 28/08 còn 21 trên 22 em chưa nộp. Phần điểm danh khoảng này chưa dùng được, nên bản này đọc nhiệm vụ và bài kiểm tra của cùng hai lớp."*
- **Câu đổi việc người đọc sẽ làm thì nằm ở đây.** Ví dụ: *"hai sổ lớp chồng nhau 11 em nên chưa xếp được lớp nào hơn"*.
- **Câu không đổi việc gì thì nằm ở phần 6.** Ví dụ: *"trang này đọc bằng quyền giáo viên chứ không phải quyền phụ huynh"*.
- Rồi đọc các chỉ số còn sống của đúng phạm vi đó và báo cáo chúng, không đợi xin phép. Cả khoảng không có gì thì nới rộng khoảng ra, và nói một câu là đã nới.

### 2 · Ba đến sáu phát hiện

Mỗi phát hiện ba nhịp: **một con số về thứ được hỏi · nghĩa của nó · một việc làm tiếp.**

- **Việc làm tiếp có tên người đứng ra làm.** Tên giáo viên lấy từ `list_teaching_assignments`. Đọc không ra tên thì viết việc cho **người đang đọc**, đừng treo lơ lửng.
- **Đối chiếu tên đó với người đang đọc, lấy từ Cửa 0.** Trùng thì viết *"thầy/cô làm…"*; khác thì viết *"đề nghị thầy Nguyễn Khang…"*. Một bản cho tổ trưởng từng viết *"thầy Nguyễn Khang — cũng là người đang đọc bản này"* trong khi người đọc là tổ trưởng.
- Việc đó phải là việc họ **làm được thật**, và hợp với trạng thái của chính dòng nó nói tới.
- **Việc gấp nhất lên trên cùng** — sắp theo mức gấp, không theo số ngày đã trôi.
- Mục nào kết thúc bằng *"chưa nói được gì"* thì nó **không phải phát hiện** — rút về phần 5, gộp thành một đoạn ngắn.

### 3 · Ba đến sáu hình

Mỗi phát hiện đáng vẽ thì có một hình. Chọn theo `references/03-kho-bieu-do.md`, màu chọn **sau** hình theo `references/04-mau-va-chu.md`.

### 4 · Danh sách cần để ý

Khi đơn vị phân tích là từng cá thể.

**Luôn in tên, kèm mã học sinh ngay cạnh. Luật này không có ngoại lệ nào theo người nhận.** Tên bài trông lạ cũng in nguyên văn — người đọc mở phần mềm ra là tìm thấy. Thiếu mã thì ghi *"chưa có mã"*, đừng bỏ tên ra khỏi bảng.

Bản sắp rời khỏi trường thì thêm **một câu ngay tại bảng** nhắc người gửi rà lại — nhắc, không cắt hộ.

### 5 · Một khối "số chưa dùng được", nếu có

Đúng một khối cho cả trang, tối đa ba câu mỗi chỉ số chết. Không bảng số thô, không biểu đồ.

Phần 5 dài hơn phần 2 là trang đã lộn ngược.

### 6 · Một mục "Nguồn số" ở chân trang

Chỗ **duy nhất** được có tên công cụ và tên trường. Các chữ *cửa sổ, dội lại, lời gọi, công cụ, tài khoản, truy vấn, đã đọc, khoảng đọc* đều thuộc về đây.

Viết cho giáo viên bằng tiếng của nghề: em, học sinh, lớp, bài, nhiệm vụ, tiết, điểm, câu, chủ đề, bài làm, chữa bài, nộp bài, hạn nộp, phòng thi.

## Luật cho mọi con số trên trang

**Con số nào trong lời văn cũng phải khai trong khối JSON** — kể cả tỉ lệ tự tính và chênh lệch giữa hai lần đọc. Không khai được thì **xoá khỏi trang**, đừng làm nhẹ đi.

**Mẫu số đi liền con số.** Mọi mục `soLieu` mang đơn vị đếm — *em, học sinh, lớp, bài, dòng, lượt, phòng thi, nhiệm vụ, tiết, câu* — **và mọi tỉ lệ phần trăm** — bắt buộc có khoá `mauSo`, và mẫu số in ngay cạnh con số:

```json
"ds-can-ho-tro": {
  "moTa": "Số em mang nhãn cần hỗ trợ", "giaTri": 1, "donVi": "em",
  "mauSo": "trong 8 dòng sổ lớp đã tra được, không phải trong 22 em"
}
```

In ra: *"1 em cần hỗ trợ **trong 8 dòng sổ lớp đã tra được, không phải trong 22 em**"*. Hàm `soVaMau(mã)` in cả hai cùng lúc.

**Nhận ra hai con số dễ lẫn thì sửa, đừng viết câu dặn.** Đổi tên một trong hai, hoặc bỏ một cái đi. Câu *"hai con số này đếm hai thứ khác nhau, đừng cộng lại"* là đẩy việc sang người đọc.

**Nhãn phải là đúng thứ con số đếm.** Che phần số đi, đọc nhãn, hỏi *chữ này hứa gì*, rồi bỏ tay ra xem có khớp không.

**Tên trang và mọi tít chỉ nói thứ thân bài giữ được** — không hứa thứ thân bài rút lại. Trang tên *"Tình hình đi học"* mà không có con số đi học nào dùng được thì đổi tên trang. Viết tít sau khi viết xong thân bài.

**Một cách đối xử với số 0 cho cả trang.** Chọn một, áp cho mọi số 0 cùng loại.

**Con số chạm trần mang chữ "sàn" ngay trong câu chứa nó**, và trong `mauSo` của nó.

**Điều đáng nói nhất viết cho rõ.** *"Cả lớp chỉ mình em nộp"*, không phải *"em là người có bài nộp"*.

**Mục lục có đủ mọi mục**, kể cả khối cảnh báo, và tên trong mục lục trùng tiêu đề mục.

## Máy chặn sẵn những gì

Không cần nhớ mấy luật này — chạy máy là ra. Chi tiết trong mã nguồn từng script.

| Mã lỗi | Bắt gì |
|---|---|
| `SO_LAC_TRONG_VAN` | con số trong lời văn không khai trong khối JSON |
| `THIEU_MAU_SO` | con số đếm hoặc tỉ lệ không khai mẫu số |
| `MOT_THU_HAI_SO` | hai mục cùng mô tả, cùng mẫu số, khác giá trị |
| `CAU_DAN_THAY_VI_SUA` | câu dặn người đọc đừng nhầm thay vì sửa |
| `SO_0_TRO` | số 0 cạnh chữ điểm mà không nói rõ là 0 của cái gì |
| `XU_HUONG_QUA_HE` | rút xu hướng tăng/giảm qua một khoảng có nghỉ hè |
| `TIENG_MAY_DOC` | `đã đọc`, `khoảng đọc`, `đọc được N` lọt ra thân bài |
| `SI_SO_SAI_NGUON` | sĩ số lấy từ `_count` / `student_count` |
| `KHOA_THIEU_HIEN_SO` | khoá thiếu mà hiện ra số thay vì `chưa chấm` |
| `TRUONG_BI_CAM` | in `class_name` của `find_missing_submissions` |

## Quy trình — bảy cửa

Tạo một việc cho từng cửa, làm đúng thứ tự.

**Cửa 0 · ĐỊNH HƯỚNG.** `get_schedule()` không tham số — trả về `mode`, tên người đang hỏi, tuần này. Rồi `list_teacher_classes()`.

**Cửa 1 · BA MẢNH, MỘT CÂU.** Phạm vi, khoảng thời gian, ai đọc — theo `references/02-hoi-lai.md`. Rồi viết ra **một câu**: bản này giúp người đọc quyết định gì? Không viết được câu đó là chưa hiểu yêu cầu — hỏi lại. Câu này là phép thử để cắt chỉ số ở cửa 3.

`references/07-usecase.md` có mười một ví dụ dựng sẵn. Trùng thì lấy luôn lời gọi và danh sách hình. Không trùng thì đi luồng chung, đừng cố nhét vào.

**Cửa 2 · ĐỌC THẬT.** `references/01-du-lieu-ths.md` là hợp đồng đọc — mọi số đến từ một lời gọi trong đó. Gộp bằng `run_reads`, tối đa 5 lời gọi. Đọc **hai** cửa sổ nếu cần so kỳ trước; không thì nói rõ là bản này không so.

**Cửa 3 · CHỌN HÌNH.** Bốn cửa lọc của `references/03-kho-bieu-do.md`. **Cắt mọi chỉ số không đổi được quyết định ở cửa 1** — bước cắt nhiều nhất và hay bị bỏ nhất.

**Cửa 4 · DỰNG.** Đọc `references/08-su-that-voi-nguoi-doc.md`. Copy `templates/bao-cao.html`, làm theo `references/06-dung-trang.md`. Ghi ra `bao-cao/<yyyy-mm-dd>-<phạm-vi>-<loại>.html`. Copy hai file trong `qc/` sang `bao-cao/qc/`.

**Cửa 5 · SOI.** Vòng lặp dưới.

**Cửa 6 · GIAO.** File, tóm tắt trong chat 5–12 dòng mở đầu bằng tiêu đề `#`, một dòng mời chỉnh. Xin chỉnh thì **ghi đè đúng đường dẫn cũ** — họ đã gửi nó cho người khác rồi.

## Cửa 5 · Vòng soi

```
a  python scripts/check_useful.py  --render <file>   → đạt cả 3 phép
   python scripts/check_thuc_te.py --render <file>   → 0 lỗi chặn
   python scripts/check_voice.py   --render <file>   → 0 lỗi chặn
   python scripts/check_sidecar.py --render <file>   → 0 lỗi chặn
b  Bốn lăng kính song song: workflows/review-iteration.js
c  Ghi vào bao-cao/qc/defects.md · đặt Status trong spec-matrix.md
d  python scripts/qc_score.py bao-cao/qc
e  exit 0 → cửa 6.  exit 1 → sửa cái nặng nhất, lặp lại từ a.
```

`check_useful` chạy **trước**: nó đo trang có nói được gì không, ba cửa kia đo trang có trung thực không. Một trang trung thực mà vô dụng vẫn qua được ba cửa kia.

`--render` **bắt buộc**. Trang sinh phần lớn nội dung lúc chạy; bỏ cờ này thì 37 con số và 109 đoạn đậm của một bản lỗi đều lọt.

Cửa mở khi độ hoàn thành **100%** và không còn P0, P1 nào mở.

| Lăng kính | Soi gì | Được biết gì |
|---|---|---|
| `agents/qa-01-du-lieu.md` | số trên trang ↔ khối JSON ↔ phản hồi MCP thật | yêu cầu gốc, log MCP, gọi lại được |
| `agents/qa-02-giong.md` | giọng, theo `humanized` | yêu cầu gốc |
| `agents/qa-03-bieu-do.md` | bốn cửa chọn hình, 25 lỗi có tên, phép in giấy | yêu cầu gốc, mở được trình duyệt |
| `agents/qa-04-nguoi-doc.md` | tôi có làm được việc tôi cần không | **chỉ file, chỉ vai** |

Lăng kính 4 **phải** bị cắt ngữ cảnh. Biết trang *định* nói gì thì nó sẽ đọc ra điều đó dù trang không nói.

## Chốt cứng dữ liệu

Chặn **trước** khi dựng. Đầy đủ ở `references/01-du-lieu-ths.md`.

- **Cửa sổ.** In cửa sổ mà phản hồi **dội lại**, theo từng loại dữ liệu. Số không có cửa sổ đứng cạnh thì xoá khỏi trang.
- **Trần danh sách.** Độ dài bằng trần (20 trường · 30 phòng thi · 40 em nợ bài · 50 lượt nộp · 60 bộ đề) thì con số đó là **sàn** — nói ra, và cấm `toàn bộ`, `tất cả`, `duy nhất` trên nó.
- **Lớp bộ môn.** Nhiệm vụ và thời khoá biểu gắn vào lớp **bộ môn**. Lớp chủ nhiệm trả về 0 và số 0 đó không có nghĩa là lớp không có.
- **Sĩ số.** Đếm `role=="student"`. Thầy cô nằm trong `members[]` và `_count` đếm cả họ.
- **Khoá thiếu.** Kiểm bằng `hasOwnProperty`, không kiểm giá trị. Khoá thiếu in `chưa chấm` và loại khỏi mọi trung bình.
- **Chuyên cần.** `present == 0` khắp sổ thì dựng **một** bảng cảnh báo kèm số thô, và **không con số chuyên cần nào ở chỗ khác**. Không đoán cơ chế.

## Chỉ đọc

Danh sách trắng 20 công cụ ở `references/01-du-lieu-ths.md` mục 1. **Không bao giờ** gọi `run_tool` hay tên bắt đầu bằng `create_ update_ delete_ add_ remove_ set_ mark_ grade_ attach_ detach_ block_ pin_ replace_ clear_ rate_`. Báo cáo là việc đọc.

Đừng dùng `find_tools` để tìm việc: hỏi nó về báo cáo tuần thì 13 trong 20 kết quả là công cụ ghi.

## Hợp đồng trạng thái

`bao-cao/qc/spec-matrix.md` và `bao-cao/qc/defects.md` là nguồn sự thật duy nhất. Phiên đứt giữa đường thì đọc hai file đó là biết đang ở đâu.

`✓` đã kiểm · `~` đã làm chưa kiểm · `✗` còn mở. **Chỉ `✓` tính vào độ hoàn thành.**

Một lỗi cùng nội dung mở qua **3 vòng** thì `qc_score.py` in `STALLED` — dừng, đưa lên người dùng kèm bằng chứng.

## Sửa skill này

**Bằng chứng cho mọi luật ở trên nằm ở `references/09-bang-chung.md`** — nguyên văn lời người đọc, số liệu bảy vòng thử, và bốn phép đo đã thử rồi bỏ. Đọc nó trước khi bỏ hay đổi một luật.

### Thử một luật thế nào

**Đừng lấy vòng sáu vai làm vòng lặp sửa.** Đó là cửa cuối. Một vai dao động tới 30 điểm giữa các vòng, trong khi thay đổi cần phát hiện chỉ khoảng 10 — nên với một mẫu mỗi vai, phép đo không tách nổi tín hiệu khỏi nhiễu. Bảy vòng đã tiêu theo cách đó và không hội tụ.

Thay vào đó, thử **chính câu chữ** trước, bằng bộ thử nhỏ. Mẫu ở `workflows/micro-tieu-de.js`:

```
một lỗi cụ thể · một việc nhỏ (chỉ viết tiêu đề, hoặc chỉ viết câu mở)
dữ liệu thật, đóng băng, hai nhánh nhận y hệt nhau
nhánh A = ĐỐI CHỨNG, không một chữ nào về luật đang thử
nhánh B = nguyên văn câu chữ đang cân nhắc
6 lần lặp mỗi nhánh · đọc tay từng kết quả, đừng chỉ đếm máy
```

**Nhánh đối chứng là bắt buộc.** Đối chứng không mắc lỗi thì không có gì để sửa — bỏ luật đó đi, đừng viết.

Rẻ hơn một vòng đầy đủ khoảng mười lần và xong trong một phút.

### Một luật đã bị gỡ vì bộ thử này

Luật *"con số trong tiêu đề phải mang mẫu số ngay tại đó"* nghe hợp lý và sinh ra từ lời chê thật của hiệu trưởng ba vòng liền. Đo ra:

| | Đối chứng | Có luật |
|---|---|---|
| Số từ mỗi tiêu đề | 10,6 | **26,0** |
| Tiêu đề dài nhất | 16 từ | **47 từ** |
| Cảnh báo phạm vi nằm ở câu mở | **6/6** | 4/6 |

Hai phân bố không chồng lấn — đối chứng cao nhất 13,0, nhánh có luật thấp nhất 20,8. Và đối chứng **vốn đã viết đúng**: cả sáu lần đều tự đặt câu cảnh báo phạm vi vào câu mở đầu.

Luật không chữa gì, mà làm tiêu đề dài gấp hai rưỡi. Đã gỡ.

Ngược lại, **luật câu mở đầu ở phần 1 đã đo và giữ**: đối chứng chôn việc gấp vào nửa sau câu 6/6 lần, nhánh có luật đưa nó lên đầu 6/6. Đừng sửa câu chữ của nó mà không đo lại. Cả hai phép đo ở `references/09-bang-chung.md`.

Hai điều đã đo được về chính skill này:

**Thêm chữ làm sàn sụp.** Từ vòng 4 sang vòng 6, `SKILL.md` phình lên 4.911 từ và 24 chỉ thị. Điểm cao nhất không đổi (80 → 82), điểm thấp nhất rơi từ 70 xuống 50. Độ phân tán là phép đo — sáu agent đọc cùng một skill mà viết ra sáu bản chênh nhau 2,5 lần độ dài thì luật chưa ràng buộc. **Siết hình dạng trước khi thêm chữ.**

**Máy không được đoán nghĩa.** Bốn lần thử, bốn lần sai. Phép đo chỉ được so từ vựng, hoặc so sự đồng hiện trong cùng một câu. Cần đọc hiểu thì giao lăng kính 4.

Sửa skill thì chạy lại **cả bảy vai** của `agents/qa-04-nguoi-doc.md` song song. Sửa mà bỏ bước này là sửa mù.

`SKILL.md`, `workflows/`, `scripts/` là vỏ cho Claude Code. `references/` và `agents/` là ruột trung tính, để bê sang trợ lý ảo THS.

**Bẫy môi trường:** `stdout` trên máy Windows này là cp1252 nên in tiếng Việt ra là crash. Mọi script phải có `sys.stdout.reconfigure(encoding="utf-8")`, heredoc Python ad-hoc cũng vậy.
