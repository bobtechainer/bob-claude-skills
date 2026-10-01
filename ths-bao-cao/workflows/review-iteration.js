export const meta = {
  name: 'bao-cao-review-iteration',
  description: 'Bốn lăng kính soi một bản báo cáo Trường học số song song, gộp và xếp mức phát hiện',
  whenToUse: 'Gọi từ skill ths-bao-cao, cửa 4b, sau mỗi lần dựng hoặc dựng lại trang báo cáo',
  phases: [
    { title: 'Soi', detail: '4 lăng kính song song: truy nguồn số liệu · giọng · hình vẽ · người đọc độc lập' },
  ],
}

// args = {
//   file:        đường dẫn tuyệt đối tới file HTML báo cáo
//   skillDir:    đường dẫn tuyệt đối tới thư mục skill (để lăng kính đọc file lệnh của nó)
//   vai:         vai cho lăng kính người đọc, ví dụ 'Giáo viên bộ môn Toán, lớp 6a2'
//   yeuCau:      yêu cầu gốc của người dùng — CHỈ đưa cho lăng kính 1, 2, 3
//   logMcp:      tóm tắt các lời gọi MCP đã thực thi — CHỈ đưa cho lăng kính 1
//   loiDangMo:   danh sách lỗi còn open trong qc/defects.md, để lăng kính cộng `seen` thay vì tạo dòng mới
// }

const a = args || {}
if (!a.file) throw new Error('thiếu args.file — đường dẫn file HTML báo cáo')
if (!a.skillDir) throw new Error('thiếu args.skillDir')

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sev: { type: 'string', enum: ['P0', 'P1', 'P2'] },
          defect: { type: 'string', description: 'Một câu nói phát hiện là gì. Cụ thể, không phải cảm giác.' },
          evidence: { type: 'string', description: 'Tái hiện được: trích nguyên văn, số đo trong mã, ảnh chụp, hoặc tên lời gọi + tên trường + giá trị thật. P0 và P1 KHÔNG hợp lệ nếu thiếu.' },
          specId: { type: 'string', description: 'ID dòng trong qc/spec-matrix.md mà phát hiện này chặn, nếu khớp một dòng.' },
          trungLoiDangMo: { type: 'string', description: 'ID lỗi đang mở nếu đây là trùng — khi đó chỉ cộng seen, không tạo dòng mới.' },
        },
        required: ['sev', 'defect', 'evidence'],
      },
    },
    specDaKiem: {
      type: 'array',
      items: { type: 'string' },
      description: 'ID các dòng trong spec-matrix mà lăng kính này đã kiểm và thấy ĐẠT — dùng để đặt Status thành ✓.',
    },
    khongKiemDuoc: {
      type: 'array',
      items: { type: 'string' },
      description: 'Thứ không kiểm được và vì sao. Đừng để trống nếu có thứ bị bỏ — im lặng ở đây đọc thành đã phủ hết.',
    },
  },
  required: ['findings', 'specDaKiem', 'khongKiemDuoc'],
}

const CHUNG = `
Bạn là một lăng kính kiểm duyệt. **Chỉ báo phát hiện — không sửa, không dựng lại trang, không đề xuất thêm mục.**
Mục mới là chuyện phải xin người dùng đồng ý; lăng kính không tự thêm phạm vi.

File báo cáo cần soi: ${a.file}
Thư mục skill: ${a.skillDir}

Đọc file lệnh của bạn ở dưới và làm đúng theo nó. Đọc cả file báo cáo.

CHỈ ghi P0 hoặc P1 khi bằng chứng TÁI HIỆN ĐƯỢC. Cảm giác chung thì xếp P2.
Nếu một phát hiện trùng với lỗi đang mở thì điền \`trungLoiDangMo\` — đừng tạo dòng mới.

${a.loiDangMo ? 'Các lỗi đang mở trong sổ:\n' + a.loiDangMo : 'Sổ lỗi đang trống.'}
`

const LENS = [
  {
    key: 'du-lieu',
    prompt: `${CHUNG}

File lệnh của bạn: ${a.skillDir}/agents/qa-01-du-lieu.md — đọc hết và làm đủ 5 bước.
Tham chiếu: ${a.skillDir}/references/01-du-lieu-ths.md

Yêu cầu gốc của người dùng:
${a.yeuCau || '(không được cung cấp)'}

Các lời gọi MCP đã thực thi trong phiên dựng trang:
${a.logMcp || '(không được cung cấp — nói rõ chuyện này trong khongKiemDuoc)'}

Bạn ĐƯỢC gọi lại các công cụ đọc để kiểm chứng. CHỈ đọc — không bao giờ gọi create_/update_/delete_/add_/remove_/set_/mark_/grade_/attach_/detach_/block_/pin_/replace_/clear_/rate_/run_tool.
Chạy trước: python ${a.skillDir}/scripts/check_sidecar.py --render ${a.file}`,
  },
  {
    key: 'giong',
    prompt: `${CHUNG}

File lệnh của bạn: ${a.skillDir}/agents/qa-02-giong.md — đọc hết và làm đủ 3 bước.
Tham chiếu: ${a.skillDir}/references/05-giong-humanized.md

Yêu cầu gốc của người dùng:
${a.yeuCau || '(không được cung cấp)'}

Bạn KHÔNG cần log MCP — đây là lăng kính về chữ, không về số.
Chạy trước: python ${a.skillDir}/scripts/check_useful.py --render ${a.file}
Rồi:        python ${a.skillDir}/scripts/check_voice.py --render ${a.file}
Mọi thứ script báo CHẶN là P0 hoặc P1, không cần xét lại. Việc của bạn bắt đầu từ đó.`,
  },
  {
    key: 'hinh',
    prompt: `${CHUNG}

File lệnh của bạn: ${a.skillDir}/agents/qa-03-bieu-do.md — đọc hết và làm đủ 8 bước.
Tham chiếu: ${a.skillDir}/references/03-kho-bieu-do.md và ${a.skillDir}/references/04-mau-va-chu.md

Yêu cầu gốc của người dùng:
${a.yeuCau || '(không được cung cấp)'}

Bạn ĐƯỢC mở trang bằng trình duyệt để chụp ảnh — hình vẽ phải xét bằng mắt.
Không mở được thì đọc mã SVG và nói rõ trong khongKiemDuoc là đã xét bằng mã, không bằng ảnh.
Chạy phép kiểm màu: node ${a.skillDir}/scripts/validate_palette.js "<các hex bóc từ trang>" --mode light --surface "#FFFFFF"`,
  },
]

phase('Soi')
log(`Soi ${a.file} — 4 lăng kính song song`)

const ketQua = await parallel([
  ...LENS.map((l) => () =>
    agent(l.prompt, { label: `lens:${l.key}`, phase: 'Soi', schema: FINDINGS, effort: 'high' })
      .then((r) => (r ? { key: l.key, ...r } : null))),

  // Lang kinh 4 chay RIENG, khong duoc bat ky ngu canh nao ve qua trinh dung.
  // No phai gap ban bao cao dung nhu nguoi that gap — mot cai file, khong ai giai thich.
  () =>
    agent(`Bạn là **một người thật trong nhà trường**, không phải người kiểm thử.

Vai của bạn: ${a.vai || 'Giáo viên bộ môn Toán, lớp 6a2'}

File cần đọc: ${a.file}
File lệnh của bạn: ${a.skillDir}/agents/qa-04-nguoi-doc.md — đọc hết và làm đúng theo nó.

Trước khi mở file báo cáo, viết ra ba câu theo khuôn "Với vai trò là..., tôi muốn..., từ đó tôi có thể...".
Nhịp thứ ba phải là một việc bạn LÀM sau khi đọc, không phải một cảm giác.

Rồi mở file và trả lời năm câu trong file lệnh. Câu 5 — con số nào ở lại trong đầu bạn — là câu bắt được lỗi mà không phép nào khác bắt được, đừng bỏ.

Đừng đọc mã, đừng gọi MCP, đừng mở file khác. Bạn là người đọc.
Đừng lịch sự: một bản báo cáo được thông qua vì lịch sự sẽ đến tay giáo viên thật.

${a.loiDangMo ? 'Các lỗi đang mở trong sổ (điền trungLoiDangMo nếu bạn gặp lại):\n' + a.loiDangMo : ''}`,
      { label: 'lens:nguoi-doc', phase: 'Soi', schema: FINDINGS, effort: 'high' })
      .then((r) => (r ? { key: 'nguoi-doc', ...r } : null)),
])

const ok = ketQua.filter(Boolean)
const chet = ['du-lieu', 'giong', 'hinh', 'nguoi-doc'].filter((k) => !ok.some((r) => r.key === k))
if (chet.length) log(`LĂNG KÍNH KHÔNG TRẢ VỀ (lỗ hổng độ phủ): ${chet.join(', ')}`)

// Gop trung: chuan hoa 60 ky tu dau cua noi dung loi, giu muc nang hon.
const chuanHoa = (s) =>
  String(s).toLowerCase().replace(/\s+/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 60)
const NANG = { P0: 3, P1: 2, P2: 1 }

const gop = new Map()
for (const r of ok) {
  for (const f of r.findings) {
    const k = chuanHoa(f.defect)
    const cu = gop.get(k)
    if (!cu) {
      gop.set(k, { ...f, langKinh: [r.key], seen: 1 })
    } else {
      cu.langKinh.push(r.key)
      cu.seen += 1
      if (NANG[f.sev] > NANG[cu.sev]) {
        cu.sev = f.sev
        cu.evidence = f.evidence
      }
    }
  }
}

const loi = [...gop.values()].sort((x, y) => NANG[y.sev] - NANG[x.sev])
const dem = { P0: 0, P1: 0, P2: 0 }
for (const f of loi) dem[f.sev] += 1

// Mot dong spec chi tinh la DA KIEM khi khong lang kinh nao bao loi chan len no.
const bikChan = new Set(loi.filter((f) => f.sev !== 'P2').map((f) => f.specId).filter(Boolean))
const daKiem = [...new Set(ok.flatMap((r) => r.specDaKiem))].filter((id) => !bikChan.has(id))

const khongKiemDuoc = ok.flatMap((r) => r.khongKiemDuoc.map((x) => `[${r.key}] ${x}`))

log(`Xong: P0=${dem.P0} P1=${dem.P1} P2=${dem.P2} · ${daKiem.length} dòng spec đạt · ${khongKiemDuoc.length} chỗ không kiểm được`)
if (dem.P0 === 0 && dem.P1 === 0) log('Không còn lỗi chặn — cập nhật spec-matrix rồi chạy qc_score.py')

return {
  loi,
  dem,
  specDaKiem: daKiem,
  specBiChan: [...bikChan],
  khongKiemDuoc,
  langKinhChet: chet,
  // Dan nguyen vao qc/defects.md — dung khuon 5 cot ma qc_score.py doc duoc.
  dongDefects: loi.map((f, i) =>
    `| L${String(i + 1).padStart(2, '0')} | ${f.sev} | ${String(f.defect).replace(/\|/g, '/')} — ${String(f.evidence).replace(/\|/g, '/')} | ${f.seen} | open |`),
}
