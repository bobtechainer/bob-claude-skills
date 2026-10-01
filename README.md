# Skill Claude của Bob

Ba skill Bob tự viết để làm việc với Claude Code trong dự án Trường học số. Các bộ skill cài từ bên ngoài (superpowers, academic, UI/UX, agentmemory...) không có ở đây.

Người làm: Bob (BobLe, bob@techainer.com), tháng 5–9/2026. Tình trạng: đang dùng.

## Có những skill nào

| Skill | Dùng để làm gì | Gọi khi nào |
|---|---|---|
| `humanized` | Giữ giọng viết tiếng Việt tự nhiên cho báo cáo trường học, nhận xét gửi giáo viên, bản tóm tắt cho người không làm kỹ thuật | Viết báo cáo, nhận xét, tài liệu bàn giao |
| `ths-bao-cao` | Dựng báo cáo từ dữ liệu Trường học số cho một lớp, một môn, một em, một khối hoặc cả trường. Có bộ kiểm tra số liệu, giọng văn, biểu đồ trước khi giao | "làm báo cáo lớp 6A2", "báo cáo chuyên cần tuần này" |
| `ths-materials-builder` | Dựng học liệu 3D tương tác (thí nghiệm Lý, Hóa, Sinh) thành trang web, đi qua các bước chốt phạm vi, dựng, soát và chấm điểm | Tạo mới hoặc sửa một trang học liệu 3D |

## Cài thế nào

Chép thư mục skill cần dùng vào `~/.claude/skills/` rồi mở lại Claude Code.

- `ths-bao-cao` gọi kèm `humanized`, nên chép cả hai.
- `ths-bao-cao` lấy số liệu qua hai máy chủ MCP `ths-giaovien` và `ths-school`, dựng từ repo `prj-ths-agent-platform`. Chưa nối MCP thì skill không có dữ liệu để làm.
- `ths-materials-builder` cần thêm hai bộ tham khảo của người khác, đặt trong thư mục `vendor/`. Repo này không kèm hai bộ đó, tải về bằng:

```
cd ~/.claude/skills/ths-materials-builder
git clone https://github.com/majidmanzarpour/threejs-game-skills vendor/game-skills
git clone https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills vendor/graphics-skills
```

## Không có trong repo

- Thư mục `vendor/` của `ths-materials-builder`, khoảng 183MB, là hai repo của Majid Manzarpour và scottstts.
- File tạm `__pycache__` của script Python.

## Skill liên quan nằm ở repo khác

- `mobifone-ui`: Bob viết ngày 19/06/2026 cho giao diện Content Studio, nằm trong repo `gk-content-forge`, thư mục `.claude/skills/mobifone-ui`.
- Bộ skill viết tài liệu BA (`document-suite`, `srs-writing`, `doc-coauthoring`...): nằm trong repo `ba-skills-pack`.

## Lưu ý cho người nhận

- Repo là bản chụp ngày 01/10/2026 của thư mục `~/.claude/skills` trên máy Bob. Sửa skill trên máy thì chép lại vào đây rồi commit.
- `ths-bao-cao` ghi lại cách dữ liệu THS trả về trong thực tế (lớp chủ nhiệm, tên trùng trong sổ lớp, điểm danh lệch). Ví dụ trong tài liệu lấy từ lớp thử trên môi trường staging.
