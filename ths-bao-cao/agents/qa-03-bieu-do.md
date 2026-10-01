# Lăng kính 3 · Hình vẽ và đọc được

Việc của bạn: soi từng hình trên trang qua bốn cửa chọn hình, hai mươi lăm lỗi có tên, và phép in giấy.

Bạn nhận: đường dẫn file, `references/03-kho-bieu-do.md`, `references/04-mau-va-chu.md`, và file này.

Bạn **được phép** mở trang bằng trình duyệt để chụp ảnh — hình vẽ phải xét bằng mắt. Nếu không mở được thì đọc mã SVG và nói rõ là đã xét bằng mã, không bằng ảnh.

---

## Bước 1 · Chạy phép kiểm màu

Bóc mọi màu dùng trong biểu đồ ra khỏi trang, rồi:

```bash
node scripts/validate_palette.js "<các hex, phân cách bằng dấu phẩy>" --mode light --surface "#FFFFFF"
node scripts/validate_palette.js "<các hex>" --mode light --surface "#FFFFFF" --pairs all
node scripts/validate_palette.js "<dải đơn sắc>" --mode light --surface "#FFFFFF" --ordinal
```

Chạy `--pairs all` cho hình tán xạ, bong bóng, nhiều ô nhỏ. Chạy `--ordinal` cho heatmap và các dải thứ tự.

Đọc kết quả đúng cách:
- **FAIL** → P0, chặn.
- **WARN ở phép CVD** → hợp lệ **chỉ khi** hình đó có kênh thứ hai: nhãn số trực tiếp, khe hở, hoặc vân. Không có → P0.
- **WARN ở phép tương phản** → **không được bỏ qua**. Buộc phải có nhãn trực tiếp *hoặc* bảng song sinh. Không có → P0.

Bộ màu đúng đã đo sẵn nằm ở `04-mau-va-chu.md`. Màu nào trên trang **không có** trong file đó là P0 — kể cả khi nó qua được phép kiểm. Màu tự nghĩ ra là màu không kiểm được lần sau.

Đừng chạy phép phân loại lên một dải đơn sắc. Nó sẽ trượt **theo thiết kế**, và "sửa" cho nó đạt là làm hỏng dải.

---

## Bước 2 · Bốn cửa, cho từng hình

Với **mỗi** hình trên trang, chạy tuần tự:

**Cửa 1 — đây có phải biểu đồ không.** Một con số thì phải là ô chỉ số, không phải biểu đồ một cột. Một tỉ lệ so với một mức thì phải là thanh mức, không phải vành tròn hai lát. Quá 7 hạng đều có nghĩa thì phải là bảng.

**Cửa 2 — việc của người đọc có khớp hình không.** So sánh độ lớn mà vẽ đường là sai. Xu hướng mà vẽ cột nhóm là sai.

**Cửa 3 — danh mục hay thứ tự.** Đây là cửa hay trượt nhất với dữ liệu trường học. Soi kỹ hai chỗ:
- **tên lớp, tên môn, tên học sinh là danh mục** → mọi cột phải **cùng một màu** `#237BD3`. Mỗi cột một màu là P0, tên lỗi là "dải giá trị trên hạng danh mục".
- **khoảng điểm, khối lớp, mức nhiệm vụ là thứ tự** → dải xanh 4 bước. Bốn màu khác nhau là P0.

**Cửa 4 — đếm chuỗi.** Quá 5 chuỗi phân loại là P0. Hình so mọi cặp quá 3 chuỗi mà không có nhãn trực tiếp là P0.

---

## Bước 3 · Kích thước dấu

Đo trong mã SVG, không ước lượng:

| Kiểm gì | Ngưỡng |
|---|---|
| Bề dày cột | ≤ 24px |
| Bo góc cột | 4px ở đầu dữ liệu, **vuông ở chân** |
| Nét đường | 2px, đầu và khớp tròn |
| Điểm dấu | ≥ 8px, bán kính ≥ 4 |
| Nền vùng | ~10% mờ |
| Lưới, trục | 1px, **liền** — gạch đứt là P1 |
| Khe giữa dấu chạm nhau | 2px, màu nền, cùng bề rộng khắp một cột xếp lớp |
| Vành trên điểm chồng nhau | 2px, màu nền |
| Vùng bắt chuột | ≥ 24px |
| `vector-effect` | phải có `non-scaling-stroke` trên lưới, trục, nét dữ liệu |

**Viền vẽ quanh dấu để phân cách là P0** — khe và vành là cơ chế, một nét viền thêm mực nặng bằng mực dữ liệu mà không phải dữ liệu.

Thiếu `vector-effect="non-scaling-stroke"` là P1 thật, không phải chuyện nhỏ: trang này dùng `viewBox` co giãn, nên ở 2× một nét "1px" sẽ vẽ ra 5px.

---

## Bước 4 · Chú giải và nhãn

- Từ **hai chuỗi** trở lên: chú giải phải có. Thiếu → P1.
- **Một chuỗi: không được có khung chú giải.** Có → P2, nó nhắc lại tiêu đề và tốn chỗ.
- **Một con số trên mọi điểm** → P1. Nhãn ở điểm cuối, ở giá trị cực, hoặc ở chuỗi câu chuyện đang nói.
- **Nhãn bị cắt hoặc trào ra khỏi dấu** → P0. Soi `overflow:hidden` trong CSS của đoạn cột — có là P0, nó cắt chữ đầu chữ cuối.
- **Chữ mang màu dữ liệu** → P0. Dấu mang màu chuỗi; nhãn, giá trị, chú giải, chữ trục dùng mực chữ. Lục `#12B76A` và cam `#E88616` làm chữ trên nền trắng là không đọc được. Ngoại lệ duy nhất: nhãn đặt *trong* một vùng đã tô.
- **Nhãn cuối đường bị xếp ra để tránh chồng** → P1. Dùng đường dẫn hoặc tách ô nhỏ.

Và kiểm `class="num"` đúng chỗ: **có** trên nhãn trục và cột bảng, **không có** trên số chỉ số lớn, số giữa vành tròn, số lớn mở đầu. Đặt sai chỗ là P2 nhưng đáng sửa — chữ số đều bề rộng làm `121` trông rời rạc ở cỡ 30px.

---

## Bước 5 · Bảng song sinh

**Mọi biểu đồ phải có bảng song sinh.** Không ngoại lệ, không thương lượng.

Kiểm ba chuyện:
1. Có thẻ `<details class="data-table">` dưới từng biểu đồ.
2. Bảng chứa **đủ** các giá trị của biểu đồ, không phải một phần.
3. Trong `@media print`, `details` được **mở ra**, không bị ẩn. Trên giấy không có chuột nên bảng gập là bảng mất.

Thiếu bảng → **P0**. Bảng thiếu giá trị → P1. Bảng bị ẩn khi in → **P0**.

---

## Bước 6 · Phép in giấy

Trang này in ra được là yêu cầu, không phải tính năng thêm.

| Kiểm gì | Trượt là |
|---|---|
| `@page { size: A4; margin: ... }` có mặt | P1 |
| `.reveal` và mọi hoạt ảnh bị **mở bung** khi in (`opacity:1!important; transform:none!important`) | **P0** — thẻ chưa cuộn tới sẽ in ra trắng |
| `stroke-dasharray`/`stroke-dashoffset` của hoạt ảnh vẽ đường bị vô hiệu khi in | **P0** — đường sẽ in ra một nửa |
| `break-inside: avoid` trên thẻ và mục | P1 |
| Ẩn thanh trên, mục lục, nút in, gợi ý nổi, thẻ lọc khi in | P2 |
| Bỏ đổ bóng khi in | P2 |
| Giữ khối đầu trang và bảng nguồn số liệu khi in | P1 |
| Vân bật trong bản in, chỉ 45° và 135° | P1 |

Phép P0 thứ hai là phép quan trọng nhất trong cả bước này, và nó là lỗi kinh điển: hoạt ảnh hiện dần đặt `opacity:0` cho thẻ chưa cuộn tới, nên bản in ra trắng nửa trang. Kiểm bằng cách in thử ra PDF, đừng chỉ đọc CSS.

---

## Bước 7 · Bố cục trang

- **Hàng chỉ số 4 đến 6 ô.** Ít hơn 4 thì đừng làm hàng; nhiều hơn 6 là quá tải.
- **Đúng một số lớn mỗi trang**, từ 48px, cùng phông sans.
- **3 đến 6 hình mỗi trang.** Ít hơn 3 là hàng chỉ số đã đủ; nhiều hơn 6 là dấu hiệu chưa cắt chỉ số không cần.
- Khung biểu đồ phải **chừa cả dải nhãn trục** — không thì thẻ sinh thanh cuộn dọc tí xíu bên trong. P1.
- Thứ tự mục: hàng chỉ số → hình chính → hình phụ → danh sách từng em → chưa dựng được → số liệu lấy từ đâu.
- `prefers-reduced-motion` được tôn trọng trên mọi hoạt ảnh. Thiếu → P1.
- Mọi biểu đồ có `role="img"` và `aria-label` nói ra kết luận, không chỉ nói tên biểu đồ. Thiếu → P1.

---

## Bước 8 · Soi hai mươi lăm lỗi có tên

Đối chiếu cả trang với danh sách ở `03-kho-bieu-do.md`. Khớp lỗi nào thì ghi đúng tên lỗi đó vào bằng chứng — tên lỗi làm việc sửa nhanh hơn hẳn lời mô tả.

Bốn lỗi hay gặp nhất với dữ liệu trường học, soi trước:

1. **Tám màu phân loại khi câu chuyện là một con số.** Mười lớp mười màu, trong khi ý là một lớp tụt. → làm nổi.
2. **Dải giá trị trên hạng danh mục.** Cột càng lớn càng đậm khi hạng là tên lớp.
3. **Vành tròn để so các giá trị gần nhau.** Ba môn 34%, 33%, 33% trên một vành là không đọc được.
4. **Hai trục y trên một khung.** Tỉ lệ nộp nhiệm vụ và điểm trung bình trên cùng một khung là bịa ra tương quan.

---

## Cách báo về

Chỉ báo phát hiện. **Không sửa biểu đồ, không dựng lại trang, không đề xuất hình mới.**

```
| Mức | Hình nào | Phát hiện | Tên lỗi | Bằng chứng (ảnh chụp, hoặc số đo trong mã) |
```

**P0** — màu trượt phép kiểm · màu không có trong file màu · sai cửa 3 · quá trần chuỗi · thiếu bảng song sinh · bảng bị ẩn khi in · hoạt ảnh không mở bung khi in · nhãn bị cắt · chữ mang màu dữ liệu · viền quanh dấu.

**P1** — sai kích thước dấu · thiếu `vector-effect` · thiếu chú giải khi từ hai chuỗi · số trên mọi điểm · khung thiếu dải trục · thiếu `@page` · thiếu `aria-label` · thiếu `prefers-reduced-motion`.

**P2** — chú giải thừa khi một chuỗi · `class="num"` đặt sai chỗ · thứ tự mục chưa thuận · chưa ẩn chrome khi in.

Bằng chứng cho P0 và P1 phải là **một ảnh chụp hoặc một số đo trong mã**. "Biểu đồ này trông chưa ổn" không phải bằng chứng.

Trùng lỗi đã mở → cộng vào cột `seen`.
