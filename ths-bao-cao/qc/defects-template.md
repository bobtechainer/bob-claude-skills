# Sổ lỗi — copy sang `<thư-mục-báo-cáo>/qc/defects.md`

`scripts/qc_score.py` đọc file này. Giữ đúng năm cột, đúng thứ tự.

**`Sev`:** `P0` · `P1` · `P2`. Trọng số khi tính điểm lỗi: P0 = 10, P1 = 4, P2 = 1.

**`Seen`:** số vòng lỗi này còn mở. **Trùng lỗi thì cộng vào cột này, đừng tạo dòng mới.** Đạt 3 là `qc_score.py` in `STALLED` và việc đúng là dừng, đưa lên người dùng kèm bằng chứng.

**`Status`:** `open` hoặc `closed`. Chỉ dòng bắt đầu bằng `open` được tính.

**Chỉ ghi P0 hoặc P1 khi tái hiện được** — trích nguyên văn, một số đo trong mã, một ảnh chụp, hoặc tên lời gọi kèm trường và giá trị thật. Cảm giác chung xếp P2.

Cửa mở khi: độ hoàn thành 100% **và** không còn P0, P1 nào `open`.

---

| ID | Sev | Defect | Seen | Status |
|---|---|---|---|---|
| — | — | *(chưa có lỗi nào — thêm dòng khi lăng kính báo về)* | 0 | closed |

---

## Ví dụ ba dòng viết đúng

Giữ lại làm mẫu, đừng xoá. Cả ba lấy từ bộ thử RED.

| ID | Sev | Defect | Seen | Status |
|---|---|---|---|---|
| X01 | P0 | Trang viết "thứ Sáu 04/09 và thứ Bảy 05/09 thì trống"; gọi lại `get_school_overview(from=2026-09-04,to=2026-09-05)` trả `attendance_records: 195`. Không lời gọi nào trong log phủ khoảng đó | 1 | closed |
| X02 | P0 | Trang in "Lớp 9A2 Toán — 48 học sinh" rồi ba dòng sau ghi trong đó có 3 giáo viên. `get_class_roster` lọc `role=="student"` cho 45 | 1 | closed |
| X03 | P1 | Trang in "30 bài kiểm tra" như tổng; `get_class_exam_summary` trả `note: "Chỉ hiển thị 30 bài gần nhất; hãy thu hẹp khoảng ngày."` — 30 là trần, không phải tổng | 1 | closed |

Ba dòng trên nói được vì sao chúng là P0 hay P1: mỗi dòng có **một lời gọi, một tên trường, và giá trị thật** để đối chiếu. Dòng nào không có ba thứ đó thì không phải P0.
