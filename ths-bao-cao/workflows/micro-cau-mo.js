export const meta = {
  name: 'micro-cau-mo',
  description: 'Thử nhỏ có đối chứng: luật câu mở đầu có ngăn được agent tiêu câu đầu vào lời cảnh báo không',
  phases: [{ title: 'Chạy', detail: '2 nhánh × 6 lần lặp, agent ngữ cảnh sạch' }],
}

// Loi can do: PHU HUYNH che ba vong lien vi cau dau tien khong noi viec gap ma
// noi ve quyen doc du lieu.
//   vong 7: "Trang này đọc bằng tài khoản giáo viên ... chứ không phải tài khoản phụ huynh"
//   vong 9: y het, va phu huynh noi "Câu này tôi chẳng làm gì được, mà nó lại
//           đứng trên chỗ nói con tôi mai hết hạn hai bài."
// Day la loi co BANG CHUNG MANH NHAT trong ca bay vong, nen no la phep thu tot
// nhat cho cau hoi: luat cua toi co doi duoc cach viet khong.

const DU_LIEU = `
Em Nguyễn An, mã học sinh 001098000123, khoảng 17/08–16/09/2026.

Hai bài Toán của Lớp 9A2 — "nhiệm vụ a" và "aaa" — hết hạn ngày 17/09, tức còn
một ngày nữa, và đến hôm nay em chưa mở lần nào.
Ba bài khác em đã mở rồi bỏ dở, cả ba đã quá hạn.
Trong khoảng này em được giao 14 bài, đã nộp 7 bài.

Có mấy chỗ về cách lấy số, cần cân nhắc xem viết vào đâu:
· Trang lấy số qua quyền giáo viên của thầy Nguyễn Khang, không qua quyền phụ huynh.
· Hồ sơ của em đứng tên ở 20 lớp cùng lúc, nên không chọn được một lớp làm lớp chính.
· Cả 14 dòng bài tập đều ghi điểm là 0, kể cả bài đã làm xong, nên phần điểm chưa dùng được.
`.trim()

const VIEC = `Viết ĐÚNG MỘT CÂU mở đầu cho trang báo cáo này, gửi cho phụ huynh em Nguyễn An.
Chỉ một câu. Không viết gì thêm.`

const A = `Bạn đang viết báo cáo cho phụ huynh học sinh. Viết tiếng Việt, giọng mộc, cho người
không rành kỹ thuật đọc.`

const B = `${A}

Luật về câu mở đầu:

Câu đầu tiên trả lời thẳng điều người hỏi hỏi, và nó là câu duy nhất người bận đọc.

- Nói được **một việc làm được**, không dựng từ con số đã biết là vô nghĩa.
- **Việc gấp nhất đứng trước.**
- **Câu đổi việc người đọc sẽ làm thì nằm ở đây.**
- **Câu không đổi việc gì thì nằm ở mục nguồn số cuối trang.**`

const SO_LAN = 6

const LUOC_DO = {
  type: 'object',
  properties: { cau: { type: 'string', description: 'Đúng một câu mở đầu, nguyên văn.' } },
  required: ['cau'],
}

phase('Chạy')
log(`Thử nhỏ · câu mở đầu · 2 nhánh × ${SO_LAN} lần`)

const viec = []
for (const [ten, hd] of [['A-doi-chung', A], ['B-co-luat', B]]) {
  for (let i = 1; i <= SO_LAN; i++) viec.push({ ten, lan: i, hd })
}

const kq = await parallel(viec.map((c) => () =>
  agent(`${c.hd}

---

SỐ LIỆU ĐÃ ĐỌC ĐƯỢC:

${DU_LIEU}

---

${VIEC}`, { label: `${c.ten}:${c.lan}`, phase: 'Chạy', schema: LUOC_DO, effort: 'medium' })
    .then((r) => ({ nhanh: c.ten, lan: c.lan, cau: (r && r.cau) || '' }))
    .catch(() => ({ nhanh: c.ten, lan: c.lan, cau: '' }))
))

return { soLan: SO_LAN, mau: kq.filter(Boolean) }
