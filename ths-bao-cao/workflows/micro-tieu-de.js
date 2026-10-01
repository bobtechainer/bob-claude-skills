export const meta = {
  name: 'micro-tieu-de',
  description: 'Thử nhỏ có đối chứng: luật mẫu số trong tiêu đề có thật sự đổi được cách agent viết tiêu đề không',
  phases: [{ title: 'Chạy', detail: '2 nhánh × 6 lần lặp, mỗi lần một agent ngữ cảnh sạch' }],
}

// ============================================================================
// VI SAO CO FILE NAY
//
// Bay vong thu truoc deu chay CUA CUOI lam vong lap sua: 6 vai x (dung + cham),
// 1,3-2,7 trieu token, va tra ve dung MOT mau moi vai. Dao dong cua mot vai qua
// cac vong len toi 30 diem, trong khi thay doi can phat hien la ~10 diem. Nen
// khong the tach tin hieu ra khoi nhieu, va viec sua thanh danh trong toi.
//
// /writing-skills noi thang ba dieu ma toi da vi pham:
//   · "5+ reps per variant. Single samples lie."
//   · "Always include a no-guidance control."
//   · "Verify the wording itself first with micro-tests."
//
// File nay lam dung the. Mot loi cu the, mot viec nho, hai nhanh, sau lan lap.
// ============================================================================

// Du lieu THAT, doc tu MCP truong hoc so ngay 15-16/09/2026. Dong bang o day de
// moi lan lap nhan y het nhau — khac biet giua hai nhanh chi con la CACH VIET.
const DU_LIEU = `
Toàn trường THCS Giảng Võ Hà Nội, khoảng 01/09–15/09/2026.

Đã tra 13 lớp bộ môn. Đây là các lớp có học sinh ở khối 6 đến khối 9, cộng thêm
ba lớp giữ dữ liệu dày nhất — tức là một mẫu chọn tay, không phải mọi lớp bộ môn
của trường. Công cụ liệt kê lớp trả về đúng 60 dòng, bằng trần của nó.

Trong 13 lớp đó, chỉ Lớp 9A2 Toán có bài giao trên hệ thống: 7 bài.
Sổ Lớp 9A2 Toán có 48 dòng học sinh, trong đó 4 dòng mang tên dạng chạy thử
("Học viên 03", "Học viên 04", "Test import PMT5", "Test import PMT7").
Bảy bài đó cộng lại là 336 lượt giao, và tổng số lượt đã nộp là 4.
Hai bài hết hạn ngày 16/09, bốn bài hết hạn 17/09, một bài đã hết hạn từ 12/09.
Lớp 6a2 Toán có 22 em, một bài quá hạn từ 28/08 với 21 em chưa nộp.
`.trim()

const VIEC = `Viết phần ĐẦU của một bản báo cáo tháng gửi Hiệu trưởng, chỉ gồm đúng ba thứ:

1. Một dòng tên trang
2. Đúng năm tiêu đề mục, mỗi tiêu đề bọc trong thẻ <h2>...</h2>
3. Một câu mở đầu

Không viết gì thêm. Không dựng bảng, không dựng biểu đồ, không giải thích.
Trả về đúng khối HTML đó.`

// NHANH A · doi chung. Khong mot chu nao ve mau so.
// /writing-skills: "If the control does not exhibit the failure, there is
// nothing to fix — stop, don't author the guidance."
const A = `Bạn đang viết báo cáo cho nhà trường. Viết tiếng Việt, giọng mộc, cho người
không rành kỹ thuật đọc.`

// NHANH B · nguyen van doan luat dang nam trong SKILL.md.
const B = `${A}

Luật về con số:

**Con số trong tiêu đề mục và trong mục lục phải mang mẫu số ngay tại đó** — người
bận chỉ đọc hai chỗ này. Mục lục ghi trơ "Bốn lượt nộp trên 336 lượt giao" trong một
bản đề "toàn trường" thì hiệu trưởng đọc thành số của cả trường, trong khi đó là số
của một lớp.

Và khi mẫu số là **mẫu chọn tay** hoặc **sàn**, nói ngay trong tiêu đề: "Một trong 13
lớp đã rà — mẫu chọn tay, chưa phải cả trường", không để lời đính chính xuống chân
biểu đồ.`

const SO_LAN = 6

const LUOC_DO = {
  type: 'object',
  properties: {
    khoiHtml: { type: 'string', description: 'Nguyên văn khối HTML bạn viết ra: tên trang, năm thẻ h2, và câu mở đầu.' },
  },
  required: ['khoiHtml'],
}

phase('Chạy')
log(`Thử nhỏ · 2 nhánh × ${SO_LAN} lần · lỗi cần đo: tiêu đề mang con số mà không có mẫu số`)

const congViec = []
for (const [ten, huongDan] of [['A-doi-chung', A], ['B-co-luat', B]]) {
  for (let i = 1; i <= SO_LAN; i++) {
    congViec.push({ ten, lan: i, huongDan })
  }
}

const ketQua = await parallel(congViec.map((c) => () =>
  agent(`${c.huongDan}

---

SỐ LIỆU ĐÃ ĐỌC ĐƯỢC:

${DU_LIEU}

---

${VIEC}`, { label: `${c.ten}:${c.lan}`, phase: 'Chạy', schema: LUOC_DO, effort: 'medium' })
    .then((r) => ({ ...c, html: (r && r.khoiHtml) || '' }))
    .catch(() => ({ ...c, html: '' }))
))

return {
  soLan: SO_LAN,
  mau: ketQua.filter(Boolean).map((r) => ({ nhanh: r.ten, lan: r.lan, html: r.html })),
}
