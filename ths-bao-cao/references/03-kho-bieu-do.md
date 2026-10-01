# Kho hình vẽ và luật lọc

Kho này hữu hạn và đóng. Yêu cầu của người dùng thì vô hạn — nên việc của skill là **khớp câu hỏi vào một hình trong kho**, không phải nghĩ ra hình mới.

Thứ tự bắt buộc: **chọn hình trước, chọn màu sau.** Hình dạng dữ liệu quyết định hình vẽ; hình vẽ quyết định việc của màu; việc của màu quyết định lấy bộ nào trong `04-mau-va-chu.md`. Chọn màu trước là làm ngược, và nó luôn ra biểu đồ sai.

---

## Cửa 1 · Đây có phải là biểu đồ không

Chạy cửa này trước khi nghĩ đến bất kỳ loại biểu đồ nào. Bốn dòng đầu là bốn lần *không*.

| Dữ liệu là | Dùng | Không dùng |
|---|---|---|
| Một con số hiện tại, có thể kèm xu hướng | **Ô chỉ số** — số + delta + đường nhỏ | Biểu đồ cột một cột |
| Vài con số đầu bảng | **Hàng chỉ số**, 4 đến 6 ô | Biểu đồ cột nhóm |
| Con số trang mở đầu bằng | **Số lớn**, từ 48px, đúng một cái mỗi trang | — |
| Một tỉ lệ so với một mức | **Thanh mức**, rãnh là bước nhạt của cùng dải | Vành tròn hai lát |
| Quá 7 hạng đều có nghĩa | **Bảng**, hoặc bảng cộng biểu đồ | Thêm màu |

Dòng cuối là dòng hay bị vi phạm nhất: **không bao giờ giải quyết "quá nhiều chuỗi" bằng cách sinh thêm màu.**

---

## Cửa 2 · Việc của người đọc quyết định hình

| Việc người đọc phải làm | Hình mặc định | Việc của màu |
|---|---|---|
| So độ lớn, thấp đến cao | cột ngang / cột dọc; **heatmap** nếu là lưới | đơn sắc |
| Xu hướng theo thời gian | đường; vùng nếu chỉ một chuỗi | đơn sắc, hoặc 1 màu phân loại |
| Phân biệt các chuỗi khác nhau | cột nhóm / cột xếp lớp, nhiều đường | **phân loại** |
| Một chuỗi là điểm chính, còn lại là bối cảnh | **làm nổi** — tô một cái, xám phần còn lại | 1 màu + xám |
| Trên/dưới một ngưỡng, lệch so với mục tiêu | cột hai chiều, hoặc đường so với ngưỡng | hai chiều |
| Phần trên tổng | **cột xếp lớp** — nằm ngang khi nhiều hạng hoặc tên dài | phân loại |
| Thang có thứ tự (mức độ, đồng ý ↔ không đồng ý) | **cột xếp lớp hai chiều**, giữa là mức trung tính | hai chiều |
| Trước → sau, theo từng mục | quả tạ | 1 màu, 2 độ đậm |

**Đơn sắc là mặc định an toàn.** Một màu, càng lớn càng đậm. Chỉ rời khỏi nó khi việc của dữ liệu đúng là **danh tính** hoặc **cực tính**.

**Làm nổi là hình bị dùng ít nhất**, và thường là câu trả lời đúng cho "làm biểu đồ này rõ hơn". Nếu câu chuyện là "riêng lớp này tụt", thì đó là *làm nổi*, không phải phân loại.

---

## Cửa 3 · Danh mục hay thứ tự

Đây là cửa dễ làm sai nhất với dữ liệu trường học, và làm sai thì cả biểu đồ sai.

> **Phép thử:** đảo thứ tự các hạng có làm đổi nghĩa không?

**Có đổi nghĩa → là thứ tự** → một dải đơn sắc, để người đọc thấy thứ tự trong màu.

**Không đổi nghĩa → là danh mục** → **mọi cột dùng chung một màu slot 1** `#237BD3`, và không có khung chú giải.

Áp vào dữ liệu Trường học số:

| Dữ liệu | Loại | Màu |
|---|---|---|
| Khoảng điểm `<5 · 5–6,5 · 6,5–8 · >8` | **thứ tự** | dải xanh 4 bước |
| Khối 6 → 12 | **thứ tự** | dải xanh |
| Mức nhiệm vụ: chưa mở → đang làm → đã nộp | **thứ tự** | dải xanh |
| Nhãn: đạt / cần theo dõi / cần hỗ trợ | **trạng thái** | bộ trạng thái, luôn kèm chữ |
| Tên lớp (6a1, 6a2, 6a3…) | **danh mục** | **tất cả cùng `#237BD3`** |
| Tên môn (Toán, Lý, Văn…) | **danh mục** | **tất cả cùng `#237BD3`** |
| Tên học sinh | **danh mục** | **tất cả cùng `#237BD3`** |

Nghĩa là: biểu đồ so mười lớp thì **mười cột cùng một màu xanh**, không phải mười màu. Chiều dài cột đã nói ai cao ai thấp; tô mười màu là đem kênh danh tính đi mã hoá lại thứ chiều dài đã nói rồi, và nó sập luôn phép kiểm màu vì một dải giá trị trải qua cả dải sáng.

Chỉ khi các chuỗi **đúng là chủ đề** — ví dụ ba loại tương tác trong cùng một tiết, xếp lớp lên nhau — thì mới dùng nhiều màu.

---

## Cửa 4 · Bao nhiêu chuỗi thì được

Thang này dùng số đo thật của bộ màu MobiFone, không dùng số chung.

| Số chuỗi | Xử thế nào |
|---|---|
| 1–3 | màu một mình đã đủ cho mọi người; vẫn nên nhãn trực tiếp |
| 4 | hình xếp cạnh nhau vẫn an toàn, nhưng **nhãn trực tiếp thành bắt buộc** — lục và cam giờ cùng trên một màn |
| 5 | trần mềm. Đã đo: bộ 5 màu MobiFone **đạt cả phép kề nhau và phép mọi cặp**, nhưng cặp tím↔xanh chỉ ΔE 6,4 với người mù màu lục nên **buộc phải có kênh thứ hai** — nhãn trực tiếp, khe hở, hoặc vân |
| 6 trở lên | **không thêm màu.** Đã đo: slot thứ 6 làm sập phép CVD, hồng lẫn teal ΔE 1,8 |

Quá 5 chuỗi thì chọn một trong ba, không chọn cách thứ tư:

- **làm nổi một chuỗi** — cái đang nói tô `#237BD3`, còn lại `#D0D5DD`
- **tách thành nhiều ô nhỏ** — mỗi chuỗi một khung con, cùng thang, một màu
- **gộp phần đuôi thành "Khác"**

Với hình **so mọi cặp** — tán xạ, bong bóng, bản đồ, nhiều ô nhỏ — mặc định **3 chuỗi**, tối đa 5 và chỉ khi có nhãn trực tiếp.

---

## Kho hình

Tên trong ngoặc là tên hàm trong `templates/svg-kit.js`.

### Dạng số, không phải biểu đồ

**Ô chỉ số** (`statTile`) · Một con số hiện tại. Gồm: nhãn viết thường không dấu hai chấm, giá trị bằng phông sans nửa đậm, delta có dấu và nói rõ so với kỳ nào, và đường nhỏ 12 điểm. Giá trị dùng **chữ số tỉ lệ**, không dùng chữ số đều cột.

**Hàng chỉ số** (`kpiRow`) · **4 đến 6 ô, không hơn.** Đây là hình mở đầu mọi bản báo cáo.

**Số lớn** (`heroFigure`) · Từ 48px, cùng phông sans với cả trang, **đúng một cái mỗi trang**. Không dùng phông trang trí hay phông có chân — nó đọc ra thành đồ trang trí lệch nhận diện.

**Thanh mức** (`meter`) · Một tỉ lệ so với một mức. Phần đầy mang mức độ, rãnh là **bước nhạt của cùng dải màu** để trạng thái đọc được trên cả thanh. Không phải vành tròn hai lát.

**Đồng hồ cung** (`gauge`) · Cung 270°, dùng mẹo `pathLength=100` để `strokeDasharray` thành phần trăm thẳng. Dùng khi một chỉ số cần đọc như một mặt đồng hồ; ngoài ra thanh mức gọn hơn.

### So sánh

**Cột ngang** (`bars`) · Hình chủ lực của báo cáo trường học. Dùng khi tên hạng dài — tên môn, tên nhiệm vụ, tên học sinh đều dài. Sắp theo giá trị giảm dần trừ khi thứ tự có nghĩa riêng. **Nhãn số đứng ở một cột cố định bên trái, thanh bắt đầu ở một toạ độ cố định** — để dấu tiếng Việt không bao giờ đẩy lệch cột.

**Cột dọc** (`columns`) · Khi hạng là thời gian hoặc tên ngắn. Mỗi dải có một ô bắt chuột trong suốt cao hết khung, để cột thấp vẫn bấm được.

**Làm nổi** (`barsEmphasis`) · Một cột `#237BD3`, còn lại `#D0D5DD`. Dùng khi câu chuyện là *một* mục.

**Biểu đồ điểm** (`dotPlot`) · Mỗi mục một điểm trên cùng một thang. Hình tốt nhất để so nhiều lớp — thấy ngay lớp nào tách khỏi nhóm, và nó chịu được nhiều mục hơn cột ngang.

**Quả tạ** (`dumbbell`) · Trước → sau theo từng mục. Một màu, hai độ đậm. Dùng cho "tuần này so tuần trước, theo lớp".

**Thanh mục tiêu** (`bullet`) · Giá trị so với một vạch mục tiêu. Dùng cho "trung bình lớp so với ngưỡng đạt".

### Xu hướng

**Đường** (`lineChart`) · 1 đến 3 chuỗi. Dưới 4 điểm thì đừng vẽ đường — dùng ô chỉ số. Trên 6 chuỗi là nhiễu.

**Vùng** (`areaChart`) · **Chỉ một chuỗi.** Nền là màu chuỗi ở **10% mờ**, một lớp rửa, không phải một khối đặc.

**Đường nhỏ** (`sparkline`) · 12 điểm bên trong ô chỉ số. Không có trục, không có nhãn — nó chỉ nói hình dạng.

### Phần trên tổng

**Cột xếp lớp** (`stackedBar`) · **Mặc định cho phần-trên-tổng.** Nằm ngang khi nhiều hạng hoặc tên dài — với dữ liệu trường học thì gần như luôn nằm ngang. Các đoạn cách nhau **khe 2px màu nền**.

**Vành tròn** (`donut`) · Chỉ dùng khi phần-trên-tổng cần đọc trong một cái nhìn và có **tối đa 6 lát**, và một lát rõ ràng trội. **Không dùng để so các giá trị gần nhau** — mắt người không so được góc. Có lát nào gần nhau thì đổi sang cột ngang.

**Cột xếp lớp hai chiều** (`divergingStacked`) · Thang có thứ tự, căn giữa ở mức trung tính. Dùng cho "chưa mở ← đang làm → đã nộp" khi muốn thấy cả hai phía của mức giữa.

### Lệch và phân bố

**Cột hai chiều** (`divergingBar`) · Trên/dưới một ngưỡng. Xanh một phía, đỏ phía kia, vạch không màu xám.

**Cột tần số** (`histogram`) · Phổ điểm. **Chỉ dựng khi đã quét đủ sổ lớp** — hệ thống không có công cụ trả phổ điểm. Khoảng điểm là **thứ tự**, nên dùng dải xanh, không dùng bốn màu.

**Bản đồ nhiệt** (`heatmap`) · Lưới hai chiều — lớp × tuần, khối × môn. **Dải xanh, không dải cam**: đã đo, mọi dải cam MobiFone đều trượt đầu sáng. Ô trống `#F2F4F7` cộng một dòng chú giải nói rõ là chưa có dữ liệu.

### Nền

**Bảng** (`tableView`) · Bản song sinh của **mọi biểu đồ thật**, không phải tuỳ chọn. Xem mục in giấy bên dưới.

Một ngoại lệ, và nó có lý: **họ "số, không phải biểu đồ" ở Cửa 1 không cần bảng song sinh** — `statTile`, `kpiRow`, `heroFigure`, `meter`, `gauge`, `sparkline`. Giá trị của chúng nằm ngay cạnh chúng ở dạng số, nên không có giá trị nào bị chặn sau một thẻ gập. Bắt chúng phải có bảng là đòi một bảng một dòng, và bảng đó không cho người đọc thêm gì.

`bullet` **không** nằm trong ngoại lệ này: nó mã hoá hai giá trị — giá trị và mục tiêu — nên bảng của nó có nội dung thật.

`scripts/check_sidecar.py` đã cài đúng ngoại lệ này bằng lớp CSS (`spark`, `ths-gauge`, `ths-meter`).

**Nhiều ô nhỏ** (`smallMultiples`) · Đây là **cách bố cục** trên các hình trên, không phải một hình riêng. Dùng khi quá trần chuỗi.

**Bảng cảnh báo dữ liệu** (`banner`) · Khi một chỉ số không qua được cửa chốt. Đây là một thành phần thật, có kiểu dáng riêng, thay chỗ biểu đồ và hiện số thô làm bằng.

**Ô chưa có dữ liệu** (`emptyState`) · Một dòng cho một chỉ số trống, không phải một mục. Một trang mà sáu mục đều ghi chưa có dữ liệu **không** phải một bản báo cáo — khoảng đang xem không có gì thì nới rộng ra rồi báo cáo cái tìm được.

---

## Hình không có trong kho, và vì sao

| Hình | Vì sao không |
|---|---|
| Hai trục y trên một khung | Lỗi biểu đồ số một. Việc căn hai thang là tuỳ tiện nên biểu đồ **bịa ra** một tương quan không có trong dữ liệu. Thay bằng hai biểu đồ, hoặc quy cả hai về cùng mốc 100 trên **một** trục |
| Biểu đồ tròn, biểu đồ tròn 3D | Vành tròn đã đủ và đã bị hạn chế |
| Cây khối, biểu đồ mặt trời, sankey | Dữ liệu trường học không có phân cấp đủ sâu để đáng, và cả ba đọc kém |
| Mạng liên kết | Đọc kém nhất trong mọi hình được xếp loại |
| Tán xạ 3D, mặt cong | Không được dùng làm hình chính trong bất kỳ giao diện sản phẩm nào |
| Biểu đồ nến | Chỉ dùng cho bối cảnh tài chính |
| Mây từ khoá | Đọc kém, và không có dữ liệu ngôn ngữ để dựng |
| Radar | Cần bộ thuộc tính cố định 5–8 trục và tối đa 3 tập; dữ liệu trường học hiện chưa có bộ nào như vậy. Dùng `dotPlot` |

---

## Luật lọc — quy trình chọn

Đây là cái "lọc trong kho" nói bằng mười bước. Chạy tuần tự, không nhảy bước.

```
1  Viết ra MỘT câu: bản báo cáo này giúp người đọc quyết định gì?
     Không viết được câu này thì chưa hiểu yêu cầu → hỏi lại (02-hoi-lai.md)

2  Liệt kê các chỉ số đọc được thật từ MCP cho phạm vi và cửa sổ đó
     Chỉ trong 01-du-lieu-ths.md. Không có nguồn khác.

3  Cắt mọi chỉ số không đổi được quyết định ở bước 1
     Đây là bước cắt nhiều nhất, và là bước hay bị bỏ nhất.

4  Với TỪNG chỉ số còn lại, chạy Cửa 1: đây có phải biểu đồ không?
     Phần lớn không. Một con số là một ô chỉ số.

5  Với những cái là biểu đồ, chạy Cửa 2: việc của người đọc là gì?
     Ra hình mặc định và việc của màu.

6  Chạy Cửa 3: danh mục hay thứ tự?
     Ra bộ màu cụ thể trong 04-mau-va-chu.md.

7  Chạy Cửa 4: đếm số chuỗi.
     Quá 5 → làm nổi, hoặc nhiều ô nhỏ, hoặc gộp "Khác". Không thêm màu.

8  Đối chiếu với danh sách 25 lỗi ở dưới.
     Khớp lỗi nào thì sai — sửa trước khi dựng.

9  Sắp thứ tự trong trang: hàng chỉ số → hình chính → hình phụ →
     danh sách từng em → chưa dựng được → số liệu lấy từ đâu

10 Mỗi biểu đồ kèm bảng song sinh. Không có ngoại lệ.
```

**Số hình trong một trang: 3 đến 6.** Ít hơn 3 thì hàng chỉ số đã đủ, đừng vẽ cho có. Nhiều hơn 6 thì người đọc không giữ được cả trang trong đầu, và gần như luôn là dấu hiệu bước 3 chưa cắt.

---

## Gợi ý sẵn từ chính hệ thống

Mọi phản hồi MCP đều mang trường `_widget` nói hệ thống định trình bày nó thế nào. Đây là gợi ý miễn phí — dùng nó rồi mới tự nghĩ.

| `_widget` | Hình trong kho |
|---|---|
| `roster_table` | `tableView`, sắp bằng `localeCompare(...,'vi')` |
| `attendance_table` | `bars` từng em — **hoặc `banner`** nếu chưa qua cửa chốt |
| `attendance_summary` | `kpiRow` cộng `stackedBar` |
| `score_dist` | `columns` mỗi phòng thi một cột, kèm `bullet` cho ngưỡng đạt |
| `score_list` | `lineChart` theo thời gian, cộng `tableView` |
| `mission_table` | `bars` tỉ lệ nộp, cộng `stackedBar` từng dòng |
| `at_risk_table` | `barsEmphasis`, cộng `tableView` |

---

## Kích thước dấu — cố định, không thương lượng

| Dấu | Quy cách |
|---|---|
| Cột ngang, cột dọc | **dày tối đa 24px** — chặn trần, đừng lấp hết dải, phần thừa của dải là khoảng thở; **góc bo 4px ở đầu dữ liệu, vuông ở chân**; mọc từ một đường gốc duy nhất |
| Đường | **2px**, đầu và khớp tròn |
| Điểm dấu, điểm cuối | **từ 8px** (bán kính từ 4), tô màu chuỗi |
| Nền vùng | màu chuỗi ở **khoảng 10% mờ** — một lớp rửa, không phải khối đặc |
| Lưới, trục | xám cách nền một bước, **nét mảnh 1px, liền** — không bao giờ gạch đứt |

**Hai khoảng trắng làm việc phân cách:**

- **Khe nền 2px** tách các dấu chạm nhau — mọi đoạn của cột xếp lớp, và mọi cột kề nhau, cùng một bề rộng khe.
- **Vành nền 2px** trên điểm và điểm cuối, để chúng còn đọc được ở chỗ cắt qua đường hoặc chồng nhau. Vành này là phần của vùng bắt chuột, không chỉ là khoảng cách.

**Không bao giờ vẽ viền quanh một dấu để phân cách nó.** Khe và vành là cơ chế; một nét viền thêm mực nặng bằng mực dữ liệu mà không phải dữ liệu.

Vùng bắt chuột **luôn lớn hơn dấu** — tối thiểu 24px. Một điểm tán xạ 8px là cái đầu kim không ai bấm trúng.

---

## Chú giải và nhãn

**Từ hai chuỗi trở lên thì luôn có chú giải.** Đó là kênh danh tính đáng tin; không bao giờ để người đọc chỉ dựa vào việc so màu.

**Một chuỗi thì không có khung chú giải.** Chỉ có một màu, nên tiêu đề biểu đồ đã nói cái gì đang vẽ. Một khung có đúng một ô màu là nhắc lại tiêu đề và tốn chỗ.

**Không bao giờ đặt một con số lên mọi điểm.** Nhãn ở điểm cuối, ở giá trị cực, hoặc ở đúng chuỗi mà câu chuyện đang nói. Nhãn trực tiếp có tác dụng **vì** nó thưa.

**Nhãn trực tiếp trước lưới; lưới trước trục thứ hai.**

**Nhãn không vừa thì không bị cắt — đo trước.** Chỉ đặt nhãn *trong* một cột khi chữ vừa và còn đệm hai bên. Không vừa thì đưa ra ngoài đầu cột; đoạn giữa của cột xếp lớp thì bỏ nhãn trong và để chú giải mang. **Không bao giờ dùng `overflow: hidden`** để "giải quyết" — nó cắt mất chữ đầu hoặc chữ cuối, tệ hơn là không có nhãn.

Cột ngang → giá trị ở đầu thanh. Cột dọc → giá trị trên nắp. Đường → giá trị ở cuối.

**Chữ không bao giờ mang màu dữ liệu.** Dấu mang màu chuỗi; nhãn, giá trị, chú giải, chữ trục dùng mực chữ. Màu lục và cam MobiFone không đọc được khi làm chữ trên nền trắng. Danh tính đến từ ô màu *cạnh* chữ, không đến từ việc tô màu chữ. Ngoại lệ duy nhất là nhãn đặt *trong* một vùng đã tô — khi đó chọn trắng hoặc mực theo độ sáng của vùng.

**Nhãn cuối đường chồng nhau thì đừng xếp chúng ra.** Đẩy nhãn lên xuống làm nó rời khỏi đường của nó và đọc thành nhiễu. Dùng đường dẫn mảnh, hoặc tách thành nhiều ô nhỏ. Quá bốn đường hội tụ thì nhiều ô nhỏ gần như luôn đúng.

---

## In giấy — nơi này không có chuột

Trang này in ra được, và đây là bối cảnh chính chứ không phải bối cảnh phụ. Trên giấy không có hover, nên hợp đồng tương tác đổi hẳn:

**Mọi giá trị phải nằm trên mặt giấy.** Luật "gợi ý nổi chỉ tăng thêm, không bao giờ chặn đường" trên giấy thu về thành: **nhãn trực tiếp hoặc bảng song sinh, bắt buộc.** Biểu đồ nào chỉ đọc được bằng hover thì trên giấy là một biểu đồ hỏng.

**Bảng song sinh in ra, không phải gập lại.** Trong `@media print` phải mở `details` ra, không phải ẩn nó.

**Bật vân trong bản in.** Đây là kênh danh tính khi màu thất bại — in đen trắng, `forced-colors`, mù màu nặng. Một lớp vân định hướng, dùng **45° và bản gương 135°, chỉ hai góc đó** — ngang và dọc đọc thành lưới hoặc thành cột. Tông trên tông, cùng độ ồn giữa các slot. Trên thang giá trị thì vân phải **có thứ tự** để nó không nói sai giá trị. Tắt mặc định, bật bởi bản in.

**Bỏ hết bộ lọc và chrome tương tác khỏi bản in.**

**Vẫn giữ luật nhãn thưa.** Van xả là bảng song sinh, không phải rải số khắp biểu đồ.

**Khung biểu đồ phải chừa cả dải nhãn trục.** Đây là một lỗi có tên: khung cao cố định vừa đúng phần vẽ nhưng thiếu chỗ cho nhãn trục, nên cái thẻ mọc ra một thanh cuộn dọc tí xíu bên trong. Đặt chiều cao bằng phần vẽ **cộng** dải nhãn, hoặc để khung tự nở theo nội dung.

---

## Hai mươi lăm lỗi — soi từng biểu đồ

Khớp lỗi nào thì biểu đồ đó sai. Sửa trước khi dựng, đừng ghi chú thích rồi giao.

### Màu và mã hoá

**Hai trục y trên một khung.** Việc căn hai thang là tuỳ tiện nên biểu đồ bịa ra tương quan. → Hai biểu đồ, hoặc quy về cùng mốc trên một trục.

**Đổi màu khi lọc** — cấp màu theo thứ hạng hiện tại, nên lọc bớt một chuỗi là sơn lại phần còn lại. Người đọc đã học "6a2 màu xanh" giờ bị dắt sai. → Màu theo thực thể, không theo số dòng.

**Sinh màu thứ 9.** Không phân biệt được với slot đã có khi mù màu. → Gộp "Khác", tách ô nhỏ, hoặc mã hoá kép.

**Ước lượng an toàn mù màu bằng mắt** — "trông khác nhau đủ rồi". → Chạy `scripts/validate_palette.js`.

**Dải giá trị trên hạng danh mục** — tô cột càng lớn càng đậm khi các hạng không có thứ tự tự nhiên. Nó mã hoá kép chiều dài cột thành màu, đốt kênh duy nhất còn rảnh vào thông tin biểu đồ đã nói, và sập phép kiểm theo thiết kế. → Một chuỗi một màu, slot 1, cho mọi cột.

**Cầu vồng làm thang độ lớn.** → Một màu, nhạt đến đậm.

**Một sắc màu ở điểm giữa thang hai chiều, hoặc hai cực cùng lạnh.** Điểm giữa phải đọc ra "không có gì"; hai cực phải đọc ra ngược nhau. Xanh↔teal sập; xanh↔đỏ và xanh↔cam thì được.

**Màu trạng thái dùng cho chuỗi không phải trạng thái**, hoặc ngược lại. → Màu trạng thái chỉ khi màu *có nghĩa* tốt/xấu.

### Hình

**Tám màu phân loại khi câu chuyện là một con số.** Cách phổ biến nhất để một biểu đồ trượt mất ý của nó. → Làm nổi, hoặc một ô chỉ số.

**Biểu đồ cột một cột, hoặc biểu đồ tròn hai lát.** → Một ô chỉ số. Con số chính là biểu đồ.

**Vành tròn để so các giá trị gần nhau.** → Cột ngang, hoặc chỉ cần con số.

**Quá 7 hạng màu đều mang nghĩa.** → Bảng, hoặc bảng cộng biểu đồ.

### Dấu và khung

**Khối dày rực, lưới nặng, không có khoảng thở.** Ở quy mô trang nó đọc ra ồn, thậm chí trẻ con. → Dấu mảnh, lưới và trục mảnh và lùi lại, đệm rộng.

**Lưới hoặc trục gạch đứt.** Gạch đứt thêm nhiễu và đọc thành "dự báo" hoặc "ngưỡng" trong khi nó chỉ là lưới. → Nét liền, mảnh, cách nền một bước.

**Một con số trên mọi điểm.** → Nhãn thưa, có chọn.

**Viền quanh dấu để phân cách.** → Khe nền 2px và vành nền 2px.

**Nhãn bị cắt hoặc trào ra khỏi cột quá nhỏ**, kể cả `overflow:hidden` cắt chữ đầu chữ cuối. → Đo trước; không vừa thì đưa ra ngoài đầu cột hoặc bỏ, giá trị vẫn còn trong bảng.

**Khung cao cố định thiếu dải nhãn trục** nên sinh thanh cuộn tí xíu bên trong thẻ. → Cao bằng phần vẽ cộng dải nhãn.

**Phông trang trí hoặc phông có chân trên số lớn.** Đọc ra thành trang trí lệch nhận diện. → Cùng phông sans với cả trang.

**Chữ số đều cột trên một số lớn đứng một mình.** Chữ số đều bề rộng làm `121` trông rời rạc. → Chữ số tỉ lệ cho số lớn; đều cột chỉ ở nơi số xếp thẳng hàng dọc.

**Vân bật mặc định, hoặc vân làm trang trí.** Trường vân dày là rủi ro tiền đình và đọc thành nhiễu trên thang giá trị. → Vân là tuỳ chọn, bật bởi bản in hoặc thiết lập trợ năng, chỉ 45°/135°.

### Tương tác và trợ năng

**Gợi ý nổi là đường duy nhất đọc được một giá trị.** → Nhãn trực tiếp hoặc bảng; và tiêu điểm bàn phím hiện đúng như hover.

**Vùng bấm bằng đầu kim.** → Vùng bắt lớn hơn dấu, tối thiểu 24px.

**Bộ lọc riêng cho từng biểu đồ**, hoặc bộ lọc nằm trong thẻ biểu đồ. → Một hàng lọc trên tất cả những gì nó ảnh hưởng.

**Nháy khung xương khi tải lại.** → Giữ bản vẽ cũ ở độ mờ thấp.

**Không có bảng song sinh**, hoặc mã hoá chỉ bằng màu trên một thang liên tục. → Mọi biểu đồ có bảng song sinh.

---

## Ba chỗ hai skill nói khác nhau, và chọn cái nào

`/ui-ux-pro-max` và `/dataviz` lệch nhau ba chỗ. Cả ba lần chọn `/dataviz`, vì nó có phép kiểm chạy được và ràng buộc chặt hơn.

| Chỗ lệch | `/ui-ux-pro-max` | `/dataviz` | Chọn |
|---|---|---|---|
| Phần trên tổng | tròn / vành là chính | **cột xếp lớp** là mặc định, vành bị hạ ưu tiên | dataviz |
| Chữ số đều cột | dùng cho mọi cột số, giá, đồng hồ | **chỉ** nơi xếp thẳng hàng dọc, **không** cho số lớn | dataviz |
| Khớp loại biểu đồ | "tỉ lệ → tròn/vành" | phần trên tổng → cột xếp lớp | dataviz |

Lấy từ `/ui-ux-pro-max` những thứ `/dataviz` không nói: **hàng chỉ số 4–6 ô**, cỡ số chỉ số 24–48px, thẻ rộng tối thiểu 280px, đường nhỏ cao 32px, một trang một màn, và bảng xếp loại trợ năng theo từng loại biểu đồ — trong đó **cột ngang và thanh mục tiêu là hai hình đọc được tốt nhất**, còn tròn/vành, cây khối, sankey, mặt trời, mây từ khoá đều bị xếp thấp.
