# Màu, chữ, khoảng cách — hệ MobiFone cho trang báo cáo

Mọi giá trị dưới đây đã đo bằng `scripts/validate_palette.js` (bản gốc của skill `dataviz`, đã copy vào skill này). Không đổi màu bằng mắt. Muốn thêm màu thì chạy lại script trước.

Nền để đo là **`#FFFFFF`** — vì biểu đồ luôn nằm trong thẻ trắng, không nằm trên nền trang `#F2F2F2`.

Trang báo cáo **chỉ có chế độ sáng**. Đây là quyết định, không phải thiếu sót: cả bốn bản báo cáo đã phát hành của Trường học số đều sáng, và bản in giấy cũng sáng. Nhưng vẫn phải sơn màu nền và màu chữ tường minh cho `body`, không để trống.

---

## 1. Khối `:root` — dán nguyên vào đầu mỗi trang

Đây là hệ đã dùng trong `ths-smart-class-bao-cao-demo/bao-cao-giao-vien.html`. Dùng đúng bộ này, đừng trộn với `fig-tokens.css` — xem mục 6 để hiểu vì sao.

```css
:root{
  /* --- Thương hiệu MobiFone (khớp tuyệt đối brand.css) --- */
  --brand-25:#F6FAFE;  --brand-50:#EEF5FC;  --brand-100:#DDEBFA; --brand-200:#BED9F6;
  --brand-300:#96C6F0; --brand-400:#70B0EA; --brand-500:#4A97E0; --brand-600:#237BD3;
  --brand-700:#0060A6; --brand-800:#053A6B; --brand-900:#041F4A; --brand-950:#02122E;

  /* --- Đỏ MobiFone: CHỈ dùng cho cờ "cần hỗ trợ" / dưới ngưỡng. Không trang trí. --- */
  --accent-red:#E30613;

  /* --- Xám (dải Untitled UI cổ điển — xem mục 6) --- */
  --gray-25:#FCFCFD;  --gray-50:#F9FAFB;  --gray-100:#F2F4F7; --gray-200:#EAECF0;
  --gray-300:#D0D5DD; --gray-400:#98A2B3; --gray-500:#667085; --gray-600:#475467;
  --gray-700:#344054; --gray-800:#182230; --gray-900:#101828;

  /* --- Trạng thái --- */
  --success-50:#ECFDF3;  --success-100:#D1FADF; --success-500:#12B76A;
  --success-600:#039855; --success-700:#027A48;
  --warning-50:#FFF5E7;  --warning-100:#FFE9CC; --warning-500:#FFA23A;
  --warning-600:#E88616; --warning-700:#BA670C;
  --error-50:#FEF3F2;    --error-400:#F97066;   --error-500:#F04438;
  --error-600:#D92D20;   --error-700:#B42318;

  /* --- Mực và mặt phẳng --- */
  --text-primary:#101828; --text-secondary:#475467; --text-tertiary:#667085;
  --page:#F2F2F2;         /* nền trang MobiFone */
  --card:#FFFFFF;         /* mặt thẻ — cũng là nền đo màu biểu đồ */

  /* --- Đổ bóng --- */
  --shadow-xs:0 1px 2px 0 rgba(10,13,18,.05);
  --shadow-sm:0 1px 3px 0 rgba(10,13,18,.10),0 1px 2px -1px rgba(10,13,18,.10);
  --shadow-lg:0 12px 16px -4px rgba(10,13,18,.08),0 4px 6px -2px rgba(10,13,18,.03);
  --ring:0 0 0 4px rgba(35,123,211,.20);

  /* --- Chữ --- */
  --font:'SFUIText','Be Vietnam Pro','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  --font-display:'UTM-Mobifone-KT','Be Vietnam Pro',var(--font);

  --move:cubic-bezier(.2,.7,.2,1);
  --pop:cubic-bezier(.34,1.56,.64,1);
}
body{background:var(--page);color:var(--text-primary);font-family:var(--font);
     font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
svg{display:block}
.num{font-variant-numeric:tabular-nums}
```

`SFUIText` và `UTM-Mobifone-KT` là phông riêng của MobiFone, chỉ giải qua `local()`. Máy nào không có thì rơi xuống **Be Vietnam Pro** — phông do người Việt thiết kế, phủ đủ dấu. Đó là lý do nó đứng thứ hai chứ không phải Inter.

---

## 2. Màu biểu đồ — năm việc, năm bộ riêng

`dataviz` chia màu theo **việc nó làm**, không theo thẩm mỹ. Chọn sai việc là sai, dù màu đẹp.

### 2.1 Chuỗi phân loại (khi bản thân các chuỗi là chủ đề)

Thứ tự cố định, cấp phát tuần tự từ slot 1. **Không đảo, không nhảy slot, không tự thêm màu thứ 6.**

| Slot | Hex | Tên | Tương phản trên trắng |
|---|---|---|---|
| 1 | `#237BD3` | xanh MobiFone | 3.98:1 |
| 2 | `#12B76A` | lục | **2.62:1 — cần cứu** |
| 3 | `#E88616` | cam | **2.67:1 — cần cứu** |
| 4 | `#7839EE` | tím | 5.86:1 |
| 5 | `#DD2590` | hồng | 4.44:1 |

Đo được, cả hai chế độ:

```
kề nhau  : mọi phép ĐẠT — cặp xấu nhất #E88616↔#12B76A ΔE 8.8 (protan)
mọi cặp  : mọi phép ĐẠT — cặp xấu nhất #7839EE↔#237BD3 ΔE 6.4 (deutan) / 16.5 (mắt thường)
```

Cặp `#7839EE↔#237BD3` nằm trong dải sàn 6–8, nên **chỉ hợp lệ khi có kênh mã hoá thứ hai**: nhãn số trực tiếp, khe hở giữa các dấu, hoặc vân. Với biểu đồ tán xạ / bong bóng / nhiều ô nhỏ, hoặc dùng đủ 5 slot kèm nhãn trực tiếp bắt buộc, hoặc rút về **4 slot** cho nhẹ đầu.

**Teal `#0E9384` đã bị loại khỏi bộ.** Nó trượt phép mọi-cặp khi đứng cùng lục: ΔE mắt thường 12,6 < sàn 15. Bản `bao-cao-giao-vien.html` có dùng teal ở biểu đồ vành, nhưng ở đó nó là màu duy nhất không-xanh nên không lộ. Đừng đem vào bộ dùng chung.

**Luật cứng cho slot 2 và 3:** lục và cam đều dưới 3:1. `dataviz` nói cảnh báo tương phản **không được bỏ qua** — nó bắt buộc phải có kênh cứu. Nghĩa là mọi biểu đồ dùng lục hoặc cam phải có **nhãn số hiện ngay trên/cạnh dấu** *và* thẻ `<details>` bảng số liệu. Không có hai thứ đó thì đổi hình khác.

### 2.2 Quá năm chuỗi thì đổi hình, đừng thêm màu

Đây là chỗ dễ sai nhất. Đo rồi: thêm slot thứ 6 (`#DD2590` + `#0E9384`) làm sập phép CVD — hồng lẫn teal ΔE 1,8 với người mù màu lục. Thêm slot 7 cũng vậy.

Nên khi có 6 chuỗi trở lên, chọn một trong ba đường:

- **Làm nổi một chuỗi** — tô `#237BD3` cho chuỗi đang nói, còn lại `#D0D5DD`. `dataviz` gọi đây là hình bị dùng ít nhất và thường là câu trả lời đúng cho "làm biểu đồ này rõ hơn".
- **Tách thành nhiều ô nhỏ** — mỗi chuỗi một khung con, cùng thang, một màu duy nhất.
- **Đổi sang thang đơn sắc** nếu các chuỗi thật ra là thứ tự (khối 6→12, mức điểm) chứ không phải danh mục.

### 2.3 Thang đơn sắc / thứ tự (độ lớn, thứ bậc, heatmap)

**Chỉ một dải sống được. Bốn bước, dải xanh MobiFone:**

```
#70B0EA  →  #4A97E0  →  #237BD3  →  #053A6B
brand-400   brand-500   brand-600   brand-800
```

```
ĐẠT  sáng→tối đơn điệu · khoảng ΔL đều ≥0.06 · đầu sáng 2.31:1 · lệch sắc 6°
```

Mọi dải khác đã thử đều trượt, ghi lại để không thử lại:

| Dải đã thử | Trượt vì |
|---|---|
| brand 100→700 (7 bước) | ΔL giữa `#DDEBFA`/`#BED9F6` chỉ 0,059; đầu sáng 1,21:1 |
| brand 200→700 (5 bước) | đầu sáng `#BED9F6` 1,45:1 |
| brand 300→700 (5 bước) | đầu sáng `#96C6F0` 1,81:1 — sát mà vẫn dưới sàn 2:1 |
| warning 300→700 | ΔL `#FFC270`/`#FFB14B` chỉ 0,035; đầu sáng 1,59:1 |
| warning 200→700 | đầu sáng `#FFD69E` 1,37:1 |

**Kết luận đáng nhớ: heatmap dùng dải xanh, không dùng dải cam.** Mọi dải cam đều trượt đầu sáng vì cam MobiFone quá sáng ở các bước nhạt. `ths-course-builder` đang vẽ heatmap bằng dải cam `#FDEAD7→#EF6820` — đừng bắt chước chỗ đó.

Ô trống trong heatmap: `#F2F4F7`, và phải có nhãn "chưa có dữ liệu" trong chú giải, không để người đọc tự đoán.

### 2.4 Thang hai chiều (trên/dưới một ngưỡng)

Hai sắc nóng–lạnh, **giữa là xám trung tính**, số bước hai bên bằng nhau.

```
dưới ngưỡng            ngưỡng           trên ngưỡng
#B42318 · #D92D20  ·  #EAECF0  ·  #4A97E0 · #237BD3
```

Không dùng xanh↔lục (cùng lạnh, điểm giữa không đọc ra "không có gì"). Không đặt một sắc màu ở điểm giữa.

### 2.5 Trạng thái

Bộ này **cố định**, không nằm trong thang chuỗi, và **không bao giờ được là kênh duy nhất**. Luôn kèm một chữ và một hình.

| Trạng thái | Hex | Nền nhạt | Kèm bắt buộc |
|---|---|---|---|
| Đạt / tốt | `#039855` | `#ECFDF3` | chữ "đạt" |
| Cần theo dõi | `#E88616` | `#FFF5E7` | chữ "cần theo dõi" |
| Cần hỗ trợ | `#E30613` | `#FEEBEB` | chữ "cần hỗ trợ" |
| Chưa có dữ liệu | `#98A2B3` | `#F9FAFB` | chữ "chưa có dữ liệu" |

`#E30613` là đỏ thương hiệu MobiFone, và tài liệu thiết kế gốc quy định nó **chỉ** dùng cho cờ "cần hỗ trợ"/dưới ngưỡng, không trang trí. Chỗ này đúng là dùng đúng chỗ duy nhất của nó.

Đo được: cam↔lục lệch ΔE 5,9 với người mù màu đỏ, và `#98A2B3` bị coi là vô sắc. Cả hai đều **không sửa được bằng cách chọn màu khác** trong hệ MobiFone. Nên yêu cầu "luôn kèm chữ" không phải lời khuyên — nó là thứ duy nhất giữ cho bộ này đọc được.

Thêm một luật ngữ nghĩa: học sinh điểm thấp gắn nhãn **"cần theo dõi" / "cần hỗ trợ"**, không gắn "yếu"/"kém" — trừ khi đang trích đúng tên một khoảng điểm của nhà trường. Xem `05-giong-humanized.md`.

### 2.6 Khung và mực của biểu đồ

```
lưới mảnh        #EAECF0     (nét liền, không gạch đứt)
trục / đường gốc #D0D5DD
nhãn trục        #98A2B3     11px
nhãn giai đoạn   #667085     11px, 600
dải xen kẽ       #F9FAFB     (và trong suốt cho dải chẵn)
nhãn số trên dấu #101828     13px, 700
delta tăng-tốt   #027A48
delta giảm-xấu   #B42318
```

---

## 3. Chữ

Thang gốc (`typography.css`), MobiFone dùng 400 và 500 là chính:

```
display 2xl/xl/lg/md/sm/xs : 72 / 60 / 48 / 36 / 30 / 24 px
xl / lg / md / sm / xs      : 20 / 18 / 16 / 14 / 13 px
line-height tương ứng md→  : 24 / 20 / 18 px cho md/sm/xs
tracking display (md trở lên) : -0.02em
```

Vai trò đã dùng thật trong trang báo cáo — bám theo bảng này, đừng tự nghĩ:

| Vai trò | Cỡ / dòng / đậm / khoảng chữ |
|---|---|
| Tiêu đề trang | 32px / 1.25 / 800 / -.02em, `text-wrap:balance`. ≤1000px → 25px. In → 22px |
| Nhãn nhỏ trên tiêu đề | 12.5px / 600 / .08em, in hoa |
| Tiêu đề mục | 22px / 700 / -.01em, `text-wrap:balance` |
| Câu dẫn của mục | 14.5px, `--text-secondary` |
| Tiêu đề thẻ | 15px / 600 |
| Phụ đề thẻ | 13px, `--text-tertiary` |
| **Số chỉ số lớn** | 30px / 1.15 / 800 / -.02em; đơn vị `<small>` 16px / 600 / `--gray-400` |
| Nhãn chỉ số | 13px / 500, `--text-tertiary` |
| Ghi chú chỉ số | 13px, `--text-secondary` |
| Đầu bảng | 12px / 600 / in hoa / .04em, `--text-tertiary` |
| Ô bảng | 13.5px, `--text-secondary` |
| Thẻ tròn / nhãn dán | 12px / 500, bán kính 999px |
| Chú thích | 12.5px, `--text-tertiary` |
| Số giữa vành tròn | SVG 30px / 800 / `#101828` |
| Nhãn trục trong SVG | SVG 11px / `#98A2B3` |

**Chữ số đều cột chỉ dùng ở nơi số phải thẳng hàng dọc.** Đây là chỗ dễ làm quá tay:

| Chỗ | Dùng gì |
|---|---|
| Cột số trong bảng, nhãn trục | `font-variant-numeric: tabular-nums` — số phải thẳng hàng để so được |
| Số chỉ số lớn đứng một mình, số giữa vành tròn | **Chữ số tỉ lệ mặc định của phông** — không `tabular-nums` |

Lý do: chữ số đều bề rộng cho mọi chữ số bề rộng của số `0`, nên ở cỡ 30px một số như `121` trông rời rạc, có khoảng trống giả giữa các chữ số. Trong bảng thì đó là điều ta muốn; trên một con số lớn thì đó là lỗi.

Trang báo cáo cũ có một lỗ riêng: **thẻ `<text>` trong SVG không được gắn `tabular-nums` ở đâu cả** — kể cả nhãn trục, nơi cần nó. Trang mới gắn `class="num"` cho `<text>` **nhãn trục và cột bảng**, và để trống cho số lớn.

Đừng dùng `font-weight:800` cho phông tải qua `@fontsource` — bộ đó chỉ có 400–700, máy sẽ tự làm đậm giả. Trang HTML tải Be Vietnam Pro từ Google Fonts thì xin luôn `wght@400;500;600;700;800`.

---

## 4. Khoảng cách, bán kính, khung

```
spacing (lưới 4px): 2 4 6 8 12 16 20 24 32 40 48 64 80 96 128 160
radius            : 2 4 6 8 10 12 16 20 24 9999
container max     : 1120px, đệm ngang 24px
khe lưới          : 16px (desktop), 12px (mobile)
```

**Bán kính thẻ là 16px.** Chú thích trong file token ghi 8px, `ths-course-builder` dùng 12px, nhưng mọi thẻ đã render thật đều 16px. Theo trang đã render.

Điểm ngắt: `≤1200px` ẩn thanh mục lục · `≤1000px` chỉ số về 2 cột, mọi lưới về 1 cột, tiêu đề 25px, ẩn nút in · `≤760px` ẩn nhãn trạng thái.

Mẹo viền khớp Figma — dùng khi cần chiều cao khớp thiết kế, vì Figma vẽ viền vào trong khung còn CSS `border` thì làm phình khung:

```css
box-shadow: 0 1px 2px 0 rgba(10,13,18,.05), inset 0 0 0 1px #EAECF0;
```

---

## 5. Số và ngày theo lối Việt

Đây là quy ước đã dùng xuyên suốt: **dấu phẩy cho phần thập phân, dấu chấm cho hàng nghìn, gạch dài `—` cho chỗ thiếu dữ liệu.** Không dùng `Intl`, viết tay:

```js
function soVN(n, le = 2){
  if (n == null || Number.isNaN(n)) return "—";
  const am = n < 0, tuyet = Math.abs(n);
  const lam = le == null ? tuyet : Number(tuyet.toFixed(le));
  const [nguyen, thapPhan] = String(lam).split(".");
  const nhom = nguyen.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (am ? "-" : "") + nhom + (thapPhan ? "," + thapPhan : "");
}
const diem   = (n, le = 2) => soVN(n, le);              // 7.86 → "7,86"
const tiLe   = (r, le = 1) => r == null ? "—" : soVN(r * 100, le) + "%";
const nguyen = (n)         => soVN(n, 0);               // 1234 → "1.234"
```

Ngày: hiện cho người đọc là `dd/MM/yyyy`; đặt tên file là `yyyy-MM-dd`; tháng là `Tháng 8/2026`. Khoảng thời gian dùng **gạch ngang en `–`**, không dùng gạch nối: `01/09 – 07/09`, `5–6,5 điểm`.

Thứ trong tuần — có hai quy ước lệch nhau trong codebase, chọn một và ghi rõ:

```js
// Chủ nhật trước, đánh theo getDay() thô
const THU = ['CN','T2','T3','T4','T5','T6','T7'];
// dùng: THU[d.getDay()]
```

Sắp tên người **phải** truyền locale: `a.localeCompare(b, 'vi')`. Thiếu `'vi'` là tên Việt sắp sai — lỗi này đang có thật trong `RosterTable.tsx`.

Xuất CSV **phải** có BOM: `new Blob(['﻿' + noiDung], {type:'text/csv;charset=utf-8;'})`. Không có BOM thì Excel trên Windows mở ra chữ Việt lỗi hết.

---

## 6. Vì sao dùng dải xám này mà không dùng dải trong file token

Trong mã nguồn Trường học số có **bốn hệ màu**, hai hệ đều tự nhận là Untitled UI:

| Nơi | Dải xám | Ghi chú |
|---|---|---|
| Trang báo cáo đã render | `#101828 #475467 #667085 #98A2B3 #D0D5DD #EAECF0 #F2F4F7 #F9FAFB` | Untitled UI cổ điển, hơi ngả xanh |
| `fig-tokens.css` | `#181D27 #414651 #535862 #A4A7AE #D5D7DA #E9EAEB #F5F5F5 #FAFAFA` | Dải `gray-light-mode` mới |
| `ths-course-builder` | khớp `fig-tokens.css`, nhưng brand là `#0D67F7`/`#20447E` | **Brand khác hẳn MobiFone** |
| `ReportDocument.tsx` (bản in A4) | `#0A0A0A #6B7280 #E5E7EB` | Xám mặc định Tailwind |

**Chọn dải của trang đã render.** Ba lý do: dải thương hiệu ở hai hệ **giống hệt nhau** nên không mất gì về nhận diện; toàn bộ thư viện thành phần đang copy sang đều bám dải này; và khung biểu đồ (lưới `#EAECF0`, nhãn `#98A2B3`) đã căn theo nó.

Lệch còn lại giữa hai hệ, ghi ra để không ai tưởng là nhầm: `--success-500` là `#12B76A` ở đây và `#17B26A` trong file token; `600` là `#039855` / `#079455`; `700` là `#027A48` / `#067647`. Khác biệt nhỏ, không đổi kết luận nào ở trên — bộ 5 màu chuỗi đã đo với `#12B76A` và đạt.

Nếu sau này cần khớp app React, đổi một khối `:root` là xong; nhưng phải **chạy lại `validate_palette.js`** vì `#17B26A` sáng hơn, có thể lệch phép tương phản.

---

## 7. Chạy lại phép kiểm khi nào

Bắt buộc chạy `scripts/validate_palette.js` lại khi: thêm/đổi bất kỳ màu chuỗi nào, thêm bước vào dải đơn sắc, hoặc đổi nền thẻ khỏi `#FFFFFF`.

```bash
# thang phân loại, hình xếp cạnh nhau (cột, đường, vành, xếp lớp)
node scripts/validate_palette.js "#237BD3,#12B76A,#E88616,#7839EE,#DD2590" --mode light --surface "#FFFFFF"

# hình so mọi cặp (tán xạ, bong bóng, nhiều ô nhỏ)
node scripts/validate_palette.js "#237BD3,#12B76A,#E88616,#7839EE,#DD2590" --mode light --surface "#FFFFFF" --pairs all

# dải đơn sắc / heatmap
node scripts/validate_palette.js "#70B0EA,#4A97E0,#237BD3,#053A6B" --mode light --surface "#FFFFFF" --ordinal
```

Đọc kết quả: `FAIL` là chặn, sửa rồi mới đi tiếp. `WARN` ở phép CVD hợp lệ **chỉ khi** có kênh mã hoá thứ hai. `WARN` ở phép tương phản **không được bỏ qua** — buộc phải có nhãn trực tiếp hoặc bảng số liệu.

Đừng chạy phép phân loại lên dải đơn sắc: nó sẽ trượt **theo thiết kế**, và "sửa" cho nó đạt là làm hỏng dải.
