/*!
 * THSViz — kho hình vẽ SVG cho trang báo cáo Trường học số.
 *
 * Không phụ thuộc thư viện nào, không module, không bước dựng. Nạp bằng một thẻ
 * script là dùng được, và dán thẳng vào trang một-file cũng được.
 *
 * Sáu luật của cả file — vi phạm luật nào là hình đó sai:
 *
 *  1. Mọi mã màu ở đây đã đo bằng scripts/validate_palette.js. Không thêm màu.
 *
 *  2. Danh mục hay thứ tự. Đảo thứ tự các hạng mà KHÔNG đổi nghĩa (tên lớp, tên
 *     môn, tên học sinh) thì là DANH MỤC: mọi cột cùng một màu #237BD3, không có
 *     khung chú giải. Đảo mà ĐỔI nghĩa (khoảng điểm, khối 6→12, mức nhiệm vụ)
 *     thì là THỨ TỰ: dải xanh 4 bước. Tô cột càng lớn càng đậm trên hạng danh
 *     mục là mã hoá kép chiều dài đã nói rồi — nên bars/columns mặc định MỘT màu.
 *
 *  3. Chữ số đều cột chỉ ở nơi số xếp thẳng hàng DỌC: cột số trong bảng, nhãn
 *     trục, cột giá trị của cột ngang. KHÔNG gắn cho số lớn đứng một mình, số
 *     giữa vành tròn, số của đồng hồ cung — ở cỡ 30px thì "121" trông rời rạc.
 *
 *  4. Chữ không bao giờ mang màu dữ liệu. Dấu mang màu chuỗi; nhãn, giá trị,
 *     chú giải, chữ trục dùng mực chữ. Ngoại lệ duy nhất: nhãn nằm TRONG một
 *     vùng đã tô, khi đó chọn trắng hay mực theo độ sáng của vùng.
 *
 *  5. In giấy là bối cảnh CHÍNH. Trên giấy không có chuột, nên mọi giá trị phải
 *     nằm trên mặt giấy: nhãn trực tiếp hoặc bảng song sinh, bắt buộc. Bảng song
 *     sinh in ra (mở details), không gập lại. Vân bật trong bản in.
 *
 *  6. Không có new Date() / Date.now() trong file này. Mốc thời gian do người
 *     gọi truyền vào — trang báo cáo là bản đóng băng, thời gian phải là số
 *     liệu, không phải giờ của cái máy đang mở trang.
 *
 * Viết theo ES5: không arrow, không template literal, không let/const, không
 * Object.assign — để chạy được cả trên WebView cũ của bảng tương tác trong lớp.
 */
(function (global) {
  "use strict";

  /* =========================================================================
   * 0 · MÀU — chép nguyên từ references/04-mau-va-chu.md
   * ========================================================================= */

  var MAU = {
    /* Thương hiệu MobiFone */
    brand25: '#F6FAFE', brand50: '#EEF5FC', brand100: '#DDEBFA', brand200: '#BED9F6',
    brand300: '#96C6F0', brand400: '#70B0EA', brand500: '#4A97E0', brand600: '#237BD3',
    brand700: '#0060A6', brand800: '#053A6B', brand900: '#041F4A', brand950: '#02122E',

    /* Đỏ thương hiệu — CHỈ cho cờ "cần hỗ trợ" / dưới ngưỡng. Không trang trí. */
    doThuongHieu: '#E30613', doThuongHieuNhat: '#FEEBEB',

    /* Xám (dải Untitled UI cổ điển — mục 6 của tài liệu màu nói vì sao dải này) */
    gray25: '#FCFCFD', gray50: '#F9FAFB', gray100: '#F2F4F7', gray200: '#EAECF0',
    gray300: '#D0D5DD', gray400: '#98A2B3', gray500: '#667085', gray600: '#475467',
    gray700: '#344054', gray800: '#182230', gray900: '#101828',

    /* Trạng thái */
    luc50: '#ECFDF3', luc100: '#D1FADF', luc500: '#12B76A', luc600: '#039855', luc700: '#027A48',
    cam50: '#FFF5E7', cam100: '#FFE9CC', cam500: '#FFA23A', cam600: '#E88616', cam700: '#BA670C',
    loi50: '#FEF3F2', loi400: '#F97066', loi500: '#F04438', loi600: '#D92D20', loi700: '#B42318',

    /* Hai slot cuối của thang phân loại */
    tim600: '#7839EE', hong600: '#DD2590',

    /* Mực và mặt phẳng */
    trang: '#FFFFFF', nenTrang: '#F2F2F2',
    mucChinh: '#101828', mucPhu: '#475467', mucNhat: '#667085',

    /* Khung và mực của biểu đồ (mục 2.6) */
    luoi: '#EAECF0',         /* lưới mảnh, NÉT LIỀN — không bao giờ gạch đứt */
    truc: '#D0D5DD',         /* trục và đường gốc */
    nhanTruc: '#98A2B3',     /* nhãn trục, 11px */
    nhanGiaiDoan: '#667085', /* nhãn giai đoạn, 11px/600 */
    daiXen: '#F9FAFB',       /* dải xen kẽ */
    soTrenDau: '#101828',    /* nhãn số trên dấu, 13px/700 */
    tang: '#027A48',         /* delta tăng-tốt — chỉ dùng cho ô chỉ số, không cho nhãn trong hình */
    giam: '#B42318',         /* delta giảm-xấu — cùng luật trên */
    oTrong: '#F2F4F7',       /* ô heatmap chưa có dữ liệu */
    boiCanh: '#D0D5DD'       /* phần bị đẩy về bối cảnh khi làm nổi */
  };

  /* Thang phân loại — thứ tự CỐ ĐỊNH, cấp phát tuần tự từ slot 1.
   * Chỉ dùng khi các chuỗi ĐÚNG LÀ chủ đề (ba loại tương tác trong một tiết).
   * Không đảo, không nhảy slot, không thêm slot thứ 6: đã đo, slot 6 làm sập
   * phép mù màu (hồng lẫn teal ΔE 1,8). */
  var CHUOI = [MAU.brand600, MAU.luc500, MAU.cam600, MAU.tim600, MAU.hong600];

  /* Thang đơn sắc / thứ tự — bốn bước, dải xanh. Đây là dải DUY NHẤT đạt phép.
   * Mọi dải cam đều trượt đầu sáng, nên heatmap và phổ điểm dùng dải này. */
  var THANG = [MAU.brand400, MAU.brand500, MAU.brand600, MAU.brand800];

  /* Thang hai chiều — nóng/lạnh, GIỮA LÀ XÁM trung tính, hai bên bằng số bước.
   * Không xanh↔lục: cùng lạnh, điểm giữa không đọc ra "không có gì". */
  var HAI_CHIEU = { duoi: [MAU.loi700, MAU.loi600], giua: MAU.gray200, tren: [MAU.brand500, MAU.brand600] };

  /* Bộ trạng thái — cố định, và KHÔNG BAO GIỜ được là kênh duy nhất.
   * Đã đo: cam↔lục lệch ΔE 5,9 với người mù màu đỏ, và #98A2B3 bị coi là vô sắc.
   * Cả hai không sửa được bằng cách chọn màu khác, nên "luôn kèm chữ" không phải
   * lời khuyên — nó là thứ duy nhất giữ cho bộ này đọc được. */
  var TRANG_THAI = {
    dat:     { mau: MAU.luc600,        nen: MAU.luc50,            chu: 'đạt' },
    theoDoi: { mau: MAU.cam600,        nen: MAU.cam50,            chu: 'cần theo dõi' },
    hoTro:   { mau: MAU.doThuongHieu,  nen: MAU.doThuongHieuNhat, chu: 'cần hỗ trợ' },
    chuaCo:  { mau: MAU.gray400,       nen: MAU.gray50,           chu: 'chưa có dữ liệu' }
  };

  /* =========================================================================
   * 1 · HÌNH HỌC — cổng nguyên từ ths-course-builder/src/lib/svg.ts
   * Cổng đủ cả những hàm bên đó chưa dùng, vì trang báo cáo dùng tới.
   * ========================================================================= */

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function range(n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(i);
    return out;
  }

  function sum(xs) {
    var t = 0;
    for (var i = 0; i < xs.length; i++) t += xs[i];
    return t;
  }

  /* Làm tròn 2 chữ số — giữ chuỗi path ngắn, đỡ phình file. */
  function round(n) { return Math.round(n * 100) / 100; }

  /* Đưa một giá trị từ miền dữ liệu sang miền pixel. */
  function scaleLinear(d0, d1, r0, r1) {
    var dd = (d1 - d0) || 1;
    return function (v) { return r0 + ((v - d0) / dd) * (r1 - r0); };
  }

  function rad(deg) { return (deg * Math.PI) / 180; }

  /* Điểm trên đường tròn. 0° là 3 giờ, góc tăng theo chiều kim đồng hồ (SVG y xuống). */
  function polar(cx, cy, r, deg) {
    return { x: cx + r * Math.cos(rad(deg)), y: cy + r * Math.sin(rad(deg)) };
  }

  /* Đường cung giữa hai góc (độ). */
  function arcPath(cx, cy, r, startDeg, endDeg) {
    var s = polar(cx, cy, r, startDeg);
    var e = polar(cx, cy, r, endDeg);
    var large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    var sweep = endDeg > startDeg ? 1 : 0;
    return 'M ' + round(s.x) + ' ' + round(s.y) + ' A ' + r + ' ' + r + ' 0 ' + large + ' ' + sweep + ' ' + round(e.x) + ' ' + round(e.y);
  }

  function linePath(pts) {
    var d = '';
    for (var i = 0; i < pts.length; i++) d += (i ? ' L ' : 'M ') + round(pts[i].x) + ' ' + round(pts[i].y);
    return d;
  }

  /* Catmull-Rom → bezier bậc ba, cho đường xu hướng mềm mắt. */
  function smoothPath(pts) {
    if (pts.length < 3) return linePath(pts);
    var d = 'M ' + round(pts[0].x) + ' ' + round(pts[0].y);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C ' + round(c1x) + ' ' + round(c1y) + ' ' + round(c2x) + ' ' + round(c2y) + ' ' + round(p2.x) + ' ' + round(p2.y);
    }
    return d;
  }

  function areaPath(pts, baseY, smooth) {
    if (!pts.length) return '';
    var top = (smooth === false) ? linePath(pts) : smoothPath(pts);
    var first = pts[0], last = pts[pts.length - 1];
    return top + ' L ' + round(last.x) + ' ' + round(baseY) + ' L ' + round(first.x) + ' ' + round(baseY) + ' Z';
  }

  /* Kéo một max thô lên mốc trục dễ đọc. */
  function niceMax(v) {
    if (v <= 0) return 1;
    var exp = Math.floor(Math.log(v) / Math.LN10);
    var base = Math.pow(10, exp);
    var n = v / base;
    var nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return nice * base;
  }

  function ticks(max, count) {
    if (count == null) count = 4;
    var out = [];
    for (var i = 0; i <= count; i++) out.push(round((max / count) * i));
    return out;
  }

  function polygonPoints(pts) {
    var out = [];
    for (var i = 0; i < pts.length; i++) out.push(round(pts[i].x) + ',' + round(pts[i].y));
    return out.join(' ');
  }

  /* =========================================================================
   * 2 · SỐ VÀ CHỮ THEO LỐI VIỆT
   * Dấu phẩy cho thập phân, dấu chấm cho hàng nghìn, gạch dài — cho chỗ thiếu.
   * Viết tay, không Intl: WebView cũ có bản Intl không đủ locale vi.
   * ========================================================================= */

  function soVN(n, le) {
    if (arguments.length < 2) le = 2;
    if (n === null || n === undefined || n !== n) return '—';
    var am = n < 0, tuyet = Math.abs(n);
    var lam = (le === null) ? tuyet : Number(tuyet.toFixed(le));
    var phan = String(lam).split('.');
    var nhom = phan[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (am ? '-' : '') + nhom + (phan[1] ? ',' + phan[1] : '');
  }

  function diem(n, le) { return soVN(n, arguments.length < 2 ? 2 : le); }   /* 7.86 → "7,86" */
  function nguyen(n) { return soVN(n, 0); }                                 /* 1234 → "1.234" */

  function tiLe(r, le) {                                                    /* tỉ lệ 0–1 → "%" */
    if (r === null || r === undefined || r !== r) return '—';
    return soVN(r * 100, arguments.length < 2 ? 1 : le) + '%';
  }

  /* Nhiều trường của Trường học số đã ở dạng phần trăm sẵn (tỉ lệ vắng,
   * average_percent, attendance_rate_percent). Đừng nhân 100 lần nữa. */
  function tiLePhan(p, le) {
    if (p === null || p === undefined || p !== p) return '—';
    return soVN(p, arguments.length < 2 ? 1 : le) + '%';
  }

  /* Sắp tên người PHẢI truyền locale. Thiếu 'vi' là tên Việt sắp sai —
   * lỗi này đang có thật trong RosterTable.tsx. */
  function soSanhVN(a, b) {
    var x = (a === null || a === undefined) ? '' : String(a);
    var y = (b === null || b === undefined) ? '' : String(b);
    return x.localeCompare(y, 'vi');
  }
  function sapTheoTen(ds, khoa, chieu) {
    var k = khoa || 'name', d = (chieu === -1) ? -1 : 1;
    return ds.slice().sort(function (a, b) { return soSanhVN(a[k], b[k]) * d; });
  }

  /* Định dạng mặc định cho nhãn trục: số nguyên thì bỏ phần thập phân. */
  function fmtTruc(v) { return soVN(v, (v % 1 === 0) ? 0 : 1); }

  /* =========================================================================
   * 3 · VỤN DÙNG CHUNG
   * ========================================================================= */

  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Bộ đếm cục bộ cho id (clipPath...). Không dùng Date.now(). */
  var demId = 0;
  function idMoi(tien) { demId += 1; return (tien || 'ths') + '-' + demId; }

  function gop(mac, them) {
    var out = {}, k;
    for (k in mac) if (mac.hasOwnProperty(k)) out[k] = mac[k];
    if (them) for (k in them) if (them.hasOwnProperty(k) && them[k] !== undefined) out[k] = them[k];
    return out;
  }

  /* Nét mảnh: 1px ở khổ 2× phải vẫn là 1px. Codebase cũ không có chỗ nào dùng
   * vector-effect, nên biểu đồ co giãn ra là nét "1px" dày lên 5px.
   * KHÔNG gắn cho nét mà BỀ DÀY CHÍNH LÀ SỐ LIỆU — vành tròn, đồng hồ cung,
   * thanh xếp lớp: khoá bề dày theo pixel màn hình là làm méo hình. */
  var NET = ' vector-effect="non-scaling-stroke"';

  /* Vành nền 2px trên điểm và điểm cuối. Đây là cơ chế phân cách được phép;
   * "vẽ viền quanh một dấu để phân cách" thì không. */
  var VANH = ' stroke="' + MAU.trang + '" stroke-width="2"';

  /**
   * Vân in — kênh danh tính khi màu thất bại (in đen trắng, forced-colors, mù
   * màu nặng). Chỉ hai góc: 45° và bản gương 135°. Ngang và dọc bị cấm vì đọc
   * thành lưới hoặc thành cột.
   *
   * Vân ghim theo SLOT chứ không theo phần tử: slot 1 (xanh) để trơn, slot 2
   * (lục) 45°, slot 3 (cam) 135° — đúng cặp mà phép đo chỉ ra là lẫn nhau khi
   * chuyển sang xám (lục 0,36 / cam 0,35). Tông trên tông, cùng độ ồn.
   * Từ 4 chuỗi trở lên vân hết chỗ phân biệt, và đó là một lý do nữa để tách
   * thành nhiều ô nhỏ thay vì thêm chuỗi.
   * Không gắn vân cho thang thứ tự: dải xanh 4 bước in ra đã thành 4 mức xám.
   * Gọi vanDefs() ĐÚNG MỘT LẦN trong trang; CSS bản in trỏ vào hai id này.
   */
  function vanDefs() {
    function mot(id, goc, nen) {
      return '<pattern id="' + id + '" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(' + goc + ')">' +
        '<rect width="8" height="8" fill="' + nen + '"/>' +
        '<line x1="0" y1="0" x2="0" y2="8" stroke="' + MAU.trang + '" stroke-width="2.6" stroke-opacity=".55"/>' +
        '</pattern>';
    }
    return '<svg class="ths-van-defs" aria-hidden="true" focusable="false" width="0" height="0" ' +
      'style="position:absolute;width:0;height:0;overflow:hidden"><defs>' +
      mot('ths-van-a', 45, CHUOI[1]) + mot('ths-van-b', 135, CHUOI[2]) +
      '</defs></svg>';
  }

  /* Lớp vân theo slot, chỉ gắn cho hình NHIỀU CHUỖI. Hình một chuỗi không cần. */
  function lopVan(slot, nhieuChuoi) {
    if (!nhieuChuoi) return '';
    if (slot === 1) return ' ths-van-1';
    if (slot === 2) return ' ths-van-2';
    return '';
  }

  /* Khung <svg> chuẩn: viewBox + co giãn theo bề rộng thẻ + role/aria-label.
   * Mọi biểu đồ đi qua đây, nên không có hình nào lọt lưới thiếu aria.
   * Chiều cao của viewBox luôn gồm CẢ dải nhãn trục — khung cao cố định vừa
   * đúng phần vẽ là lỗi có tên: cái thẻ mọc ra thanh cuộn tí xíu bên trong. */
  function khungSvg(o, w, h, trong, lopThem, capBeRong) {
    var style = 'width:100%;height:auto' + (capBeRong ? (';max-width:' + capBeRong + 'px') : '');
    return '<svg class="ths-chart' + (lopThem ? ' ' + lopThem : '') + '" viewBox="0 0 ' + round(w) + ' ' + round(h) + '"' +
      ' style="' + style + '" role="img" aria-label="' + esc(o.ariaLabel || o.title || 'Biểu đồ') + '"' +
      (o.id ? ' id="' + esc(o.id) + '"' : '') + '>' + trong + '</svg>';
  }

  /* Bảng số liệu — bản song sinh của MỌI biểu đồ, không phải tuỳ chọn.
   * Lục #12B76A và cam #E88616 đều dưới 3:1 trên nền trắng; cảnh báo tương phản
   * không được bỏ qua, nên bảng này là kênh đọc thứ hai bắt buộc. Trên giấy nó
   * còn là chỗ duy nhất đọc được giá trị mà nhãn trực tiếp không mang. */
  function bang(o) {
    var cols = o.cols || [], rows = o.rows || [], i, j, s;
    s = '<table>';
    if (o.caption) s += '<caption class="sr">' + esc(o.caption) + '</caption>';
    s += '<thead><tr>';
    for (i = 0; i < cols.length; i++) s += '<th scope="col">' + esc(cols[i].label) + '</th>';
    s += '</tr></thead><tbody>';
    for (i = 0; i < rows.length; i++) {
      s += '<tr>';
      for (j = 0; j < cols.length; j++) {
        var v = rows[i][cols[j].key];
        if (v === null || v === undefined || v === '') v = '—';
        /* class="num" ở đây là đúng chỗ: cột số trong bảng xếp thẳng hàng dọc. */
        s += '<td' + (cols[j].num ? ' class="num"' : '') + '>' + esc(v) + '</td>';
      }
      s += '</tr>';
    }
    return s + '</tbody></table>';
  }

  function boBang(o) {
    return '<details class="data-table"><summary>' + esc(o.summary || 'Xem dạng bảng số liệu') + '</summary>' +
      bang(o) + '</details>';
  }

  /** tableView — bảng đứng riêng (không gập), có khung cuộn ngang cho bảng rộng. */
  function tableView(o) {
    var s = '<div class="tbl-scroll">' + bang(o) + '</div>';
    if (o.note) s += '<p class="tbl-note">' + esc(o.note) + '</p>';
    return s;
  }

  /* Gắn bảng song sinh vào sau biểu đồ, trừ khi người gọi tự dựng bảng riêng. */
  function kemBang(svg, o, cfg) {
    if (o.bang === false) return svg;
    return svg + boBang({ cols: cfg.cols, rows: cfg.rows, caption: o.ariaLabel || o.title || '', summary: o.summaryBang });
  }

  /* Chú giải: từ HAI chuỗi trở lên thì luôn có. MỘT chuỗi thì không — một khung
   * có đúng một ô màu là nhắc lại tiêu đề và tốn chỗ. Chữ trong chú giải dùng
   * mực chữ, danh tính đến từ ô màu CẠNH chữ. */
  function chuGiai(items, nhieuChuoi) {
    if (!items || items.length < 2 || nhieuChuoi === false) return '';
    var s = '<div class="legend">', i;
    for (i = 0; i < items.length; i++) {
      s += '<span><span class="sw' + lopVan(i, true) + '" style="background:' + items[i].mau + '"></span>' +
        esc(items[i].label) + (items[i].value !== undefined ? ' <b>' + esc(items[i].value) + '</b>' : '') + '</span>';
    }
    return s + '</div>';
  }

  /* Thanh ngang: bo 4px ở ĐẦU SỐ LIỆU, vuông ở chân. Bo cả hai đầu là mắt đọc
   * ra "viên thuốc" và mất cảm giác đo từ gốc. */
  function thanhNgang(x, y, w, h, r) {
    if (w <= 0.5) return '';
    r = Math.min(r === undefined ? 4 : r, w, h / 2);
    if (w <= r) return 'M' + round(x) + ' ' + round(y) + 'H' + round(x + w) + 'V' + round(y + h) + 'H' + round(x) + 'Z';
    return 'M' + round(x) + ' ' + round(y) +
      'H' + round(x + w - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + round(x + w) + ' ' + round(y + r) +
      'V' + round(y + h - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + round(x + w - r) + ' ' + round(y + h) +
      'H' + round(x) + 'Z';
  }

  /* Cột dọc mọc LÊN: bo ở nắp (đầu dữ liệu), vuông ở chân trục. */
  function cotDoc(x, y, w, h, r) {
    if (h <= 0.5) return '';
    r = Math.min(r === undefined ? 4 : r, w / 2, h);
    return 'M' + round(x) + ' ' + round(y + h) +
      'V' + round(y + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + round(x + r) + ' ' + round(y) +
      'H' + round(x + w - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + round(x + w) + ' ' + round(y + r) +
      'V' + round(y + h) + 'Z';
  }

  /* Cột mọc XUỐNG (nhánh âm của cột hai chiều): bo ở đáy, vuông ở đường 0. */
  function cotDocXuong(x, y, w, h, r) {
    if (h <= 0.5) return '';
    r = Math.min(r === undefined ? 4 : r, w / 2, h);
    return 'M' + round(x) + ' ' + round(y) +
      'V' + round(y + h - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + round(x + r) + ' ' + round(y + h) +
      'H' + round(x + w - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + round(x + w) + ' ' + round(y + h - r) +
      'V' + round(y) + 'Z';
  }

  /* Trần bề dày dấu — chặn cứng ở 24px, phần thừa của dải là khoảng thở. */
  var DAY_TOI_DA = 24;
  function beDay(dai, tiLeDai, tran) {
    return Math.min(tran === undefined ? DAY_TOI_DA : tran, dai * (tiLeDai === undefined ? 0.62 : tiLeDai));
  }

  /* Ước lượng bề rộng chữ ở một cỡ phông — dùng để ĐO TRƯỚC khi đặt nhãn vào
   * trong một vùng. Nhãn không vừa thì đưa ra ngoài, không bao giờ cắt. */
  function rongChu(s, cx) { return String(s).length * (cx || 11) * 0.56; }

  /* =========================================================================
   * 4 · TRỤC
   * ========================================================================= */

  /* Thang dọc: giá trị → toạ độ y trong khung vẽ (y của khung là mép TRÊN). */
  function thangDoc(rect, max) {
    return function (v) { return rect.y + rect.h * (1 - (v / (max || 1))); };
  }

  /* Thang ngang: chỉ số → toạ độ x. kieu 'band' căn giữa dải, 'point' đúng mốc. */
  function thangNgang(rect, n, kieu) {
    var step = (kieu === 'band') ? rect.w / (n || 1) : (n > 1 ? rect.w / (n - 1) : rect.w);
    return function (i) { return rect.x + step * ((kieu === 'band') ? (i + 0.5) : i); };
  }

  /**
   * axisY — trục dọc dùng chung: lưới + nhãn mốc.
   * Trước đây mỗi biểu đồ tự suy mốc trong thân hàm, và có một hình ghim cứng
   * max = 10 nên cột nào vượt 10 là tràn khỏi khung. Chốt ở đây một lần.
   *
   * o = { rect:{x,y,w,h}, max | maxRaw, count=4, fmt, grid, labels, dai }
   * Trả về chuỗi markup. Thang tương ứng: THSViz.thangDoc(rect, max).
   */
  function axisY(o) {
    var r = o.rect, n = o.count || 4;
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(o.maxRaw || 0);
    var fmt = o.fmt || fmtTruc;
    var y = thangDoc(r, max), mocs = ticks(max, n), s = '', i;

    /* Dải xen kẽ vẽ trước để nằm dưới lưới. */
    if (o.dai) {
      for (i = 0; i < n; i++) {
        if (i % 2) continue;
        var yA = y(mocs[i]), yB = y(mocs[i + 1]);
        s += '<rect x="' + round(r.x) + '" y="' + round(Math.min(yA, yB)) + '" width="' + round(r.w) +
          '" height="' + round(Math.abs(yA - yB)) + '" fill="' + MAU.daiXen + '"/>';
      }
    }
    for (i = 0; i < mocs.length; i++) {
      var yy = round(y(mocs[i]));
      if (o.grid !== false) {
        s += '<line x1="' + round(r.x) + '" x2="' + round(r.x + r.w) + '" y1="' + yy + '" y2="' + yy +
          '" stroke="' + (i === 0 ? MAU.truc : MAU.luoi) + '"' + NET + '/>';
      }
      if (o.labels !== false) {
        /* Nhãn trục xếp thẳng hàng dọc → đúng chỗ dùng chữ số đều cột. */
        s += '<text class="num" x="' + round(r.x - 8) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="' +
          MAU.nhanTruc + '">' + esc(fmt(mocs[i])) + '</text>';
      }
    }
    return '<g class="ths-axis-y">' + s + '</g>';
  }

  /**
   * Cắt nhãn theo ba tầng, thay vì để nó bị che mất đuôi:
   *   tầng 1 — nguyên nhãn
   *   tầng 2 — cắt ở biên từ, thêm dấu …
   *   tầng 3 — tối giản: chữ đầu của các từ ("Lớp 9A2 Toán" → "L9T")
   * Nhãn đầy đủ luôn nằm trong <title>, và luôn còn nguyên trong bảng song sinh.
   */
  function catNhan(nhan, quy) {
    var s = (nhan === null || nhan === undefined) ? '' : String(nhan);
    if (s.length <= quy) return { text: s, tang: 1 };
    if (quy >= 6) {
      var cut = s.slice(0, quy - 1);
      var khe = cut.lastIndexOf(' ');
      if (khe >= Math.floor(quy * 0.5)) cut = cut.slice(0, khe);
      return { text: cut.replace(/[\s,.;:-]+$/, '') + '…', tang: 2 };
    }
    var tu = s.split(/\s+/), gon = '';
    if (tu.length > 1) {
      for (var i = 0; i < tu.length; i++) if (tu[i]) gon += tu[i].charAt(0);
    } else {
      gon = s;
    }
    if (gon.length > quy) gon = gon.slice(0, Math.max(1, quy));
    return { text: gon, tang: 3 };
  }

  function veNhanCat(x, y, nhan, quy, anchor, cx, mau, dam) {
    var c = catNhan(nhan, quy);
    return '<text x="' + round(x) + '" y="' + round(y) + '"' +
      (anchor ? ' text-anchor="' + anchor + '"' : '') +
      ' font-size="' + (cx || 11) + '"' + (dam ? ' font-weight="600"' : '') +
      ' fill="' + (mau || MAU.nhanGiaiDoan) + '">' + esc(c.text) +
      (c.tang > 1 ? '<title>' + esc(nhan) + '</title>' : '') + '</text>';
  }

  /**
   * axisX — trục ngang dạng dải (band) hoặc dạng điểm (point), có ba tầng cắt nhãn.
   * o = { rect, labels, kind:'band'|'point', dy, baseline, mauChu, dam }
   */
  function axisX(o) {
    var r = o.rect, nhan = o.labels || [], kieu = o.kind || 'band';
    var n = nhan.length || 1;
    var step = (kieu === 'band') ? r.w / n : (n > 1 ? r.w / (n - 1) : r.w);
    var x = thangNgang(r, n, kieu);
    var quy = Math.max(2, Math.floor((step - 8) / 6.2));   /* 11px ≈ 6,2px mỗi chữ */
    var yy = r.y + r.h + (o.dy === undefined ? 18 : o.dy);
    var s = '', i;

    if (o.baseline !== false) {
      s += '<line x1="' + round(r.x) + '" x2="' + round(r.x + r.w) + '" y1="' + round(r.y + r.h) +
        '" y2="' + round(r.y + r.h) + '" stroke="' + MAU.truc + '"' + NET + '/>';
    }
    for (i = 0; i < nhan.length; i++) {
      s += veNhanCat(x(i), yy, nhan[i], quy, 'middle', 11, o.mauChu || MAU.nhanGiaiDoan, o.dam);
    }
    return '<g class="ths-axis-x">' + s + '</g>';
  }

  function nhanCua(d) {
    var L = [];
    for (var i = 0; i < d.length; i++) L.push(d[i].label);
    return L;
  }

  /* Màu cho một dấu.
   *  - mặc định: MỘT màu cho cả hình (danh mục — chiều dài đã nói ai cao ai thấp)
   *  - o.ordinal: dải xanh 4 bước theo thứ tự hạng (khoảng điểm, khối, mức)
   *  - o.series : thang phân loại, chỉ khi các chuỗi đúng là chủ đề
   * Màu ghim theo THỰC THỂ, không theo số dòng: lọc bớt một chuỗi không được
   * sơn lại phần còn lại. Nên khi cần màu riêng thì đặt vào chính dòng dữ liệu. */
  function mauDau(o, it, i, n) {
    if (it && it.mau) return it.mau;
    if (o.ordinal) return THANG[Math.min(THANG.length - 1, Math.floor(i * THANG.length / Math.max(1, n)))];
    if (o.series) return CHUOI[i % CHUOI.length];
    return o.mauChung || MAU.brand600;
  }

  /* =========================================================================
   * 5 · DẠNG SỐ — không phải biểu đồ
   * Một con số là một ô chỉ số, không phải biểu đồ cột một cột.
   * ========================================================================= */

  /**
   * statTile — ô chỉ số. Nhãn viết thường, giá trị bằng phông sans nửa đậm,
   * delta có dấu và NÓI RÕ so với kỳ nào, kèm đường nhỏ.
   * o.spark PHẢI là đúng chuỗi số của hình lớn nói về cùng chỉ số đó ở bên
   * dưới. Vòng 4: một ô vẽ vệt đi lên trong khi hình sáu tuần ngay dưới là
   * 0 · 10 · 0 · 2 · 0 · 1 — người đọc thấy hai hình đá nhau. Không có đúng
   * chuỗi đó thì BỎ HẲN o.spark, đừng vẽ một vệt khác.
   * Giá trị dùng CHỮ SỐ TỈ LỆ mặc định của phông — không tabular-nums.
   * o = { label, value, unit, fig, delta:{text,huong}, note, spark:{values,mau},
   *       icon, iconBg, delay }
   */
  function statTile(o) {
    var s = '<div class="kpi reveal"' + (o.delay ? ' style="transition-delay:' + o.delay + 's"' : '') + '>';
    s += '<div class="top">';
    s += '<div class="icon" style="background:' + (o.iconBg || MAU.brand50) + '">' + (o.icon || '') + '</div>';
    if (o.spark && o.spark.values) {
      s += sparkline({ values: o.spark.values, mau: o.spark.mau, ariaLabel: o.spark.ariaLabel || ('Xu hướng của ' + (o.label || '')) });
    }
    s += '</div>';
    s += '<h3>' + esc(o.label || '') + '</h3>';
    /* KHÔNG class="num" ở đây — số lớn đứng một mình dùng chữ số tỉ lệ.
     * valueHtml nhận HTML thô, để chỗ gọi tự bọc một thẻ span mang thuộc tính
     * data-fig — nhờ vậy mã số liệu nằm NGUYÊN VĂN trong file và
     * scripts/check_sidecar.py đọc được bằng cách đọc file, không cần chạy trang. */
    s += '<div class="big"' + (o.fig ? ' data-fig="' + esc(o.fig) + '"' : '') + '>' +
      (o.valueHtml || esc(o.value)) + (o.unit ? '<small>' + esc(o.unit) + '</small>' : '') + '</div>';
    if (o.delta) {
      /* MAU NGU NGHIA DA BO. Vong thu 4: hai nguoi doc doc lap deu doc o delta
       * to xanh thanh tin vui, trong khi than bai ngay duoi tu noi hai cua so
       * khong so thang duoc — mot ben roi vao nghi he, mot ben chi co 1 luot nop.
       * O chi so khong du cho de noi dieu kien, nen no KHONG duoc phat tin hieu
       * tot-xau. Huong phai noi bang CHU trong o.delta.text.
       * o.delta.huong giu lai cho tuong thich va bi bo qua. */
      s += '<div class="delta flat"' + (o.delta.fig ? ' data-fig="' + esc(o.delta.fig) + '"' : '') +
        '>' + esc(o.delta.text) + '</div>';
    }
    if (o.note) s += '<div class="note">' + o.note + '</div>';
    return s + '</div>';
  }

  /** kpiRow — hàng chỉ số. 4 đến 6 ô, không hơn: đây là hình mở đầu mọi báo cáo. */
  function kpiRow(o) {
    var t = (o.tiles || []).slice(0, 6), s = '<div class="kpis">', i;
    for (i = 0; i < t.length; i++) s += statTile(gop(t[i], { delay: round(i * 0.07) }));
    return s + '</div>';
  }

  /** heroFigure — số lớn, từ 48px, ĐÚNG MỘT CÁI mỗi trang. Cùng phông sans với
   * cả trang: phông trang trí hay phông có chân đọc ra thành đồ trang trí. */
  function heroFigure(o) {
    return '<div class="hero-figure">' +
      '<div class="hf-num"' + (o.fig ? ' data-fig="' + esc(o.fig) + '"' : '') + '>' +
      (o.valueHtml || esc(o.value)) + (o.unit ? '<small>' + esc(o.unit) + '</small>' : '') + '</div>' +
      '<div class="hf-lbl">' + esc(o.label || '') + '</div>' +
      (o.note ? '<div class="hf-note">' + esc(o.note) + '</div>' : '') + '</div>';
  }

  /** meter — thanh mức: một tỉ lệ so với một mức.
   * Rãnh là BƯỚC NHẠT CỦA CÙNG DẢI (#DDEBFA), không phải xám, để trạng thái đọc
   * được trên cả thanh. Đây là hình thay cho "vành tròn hai lát". */
  function meter(o) {
    var max = (o.max === undefined || o.max === null) ? 100 : o.max;
    var v = clamp(o.value || 0, 0, max);
    var w = o.w || 480, h = o.h || 14;
    var bw = max ? (v / max) * w : 0;
    var fmt = o.fmt || function (x) { return tiLePhan(x, 1); };
    var s = '<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + (o.rang || MAU.brand100) + '"/>';
    s += '<path class="ths-grow-x" d="' + thanhNgang(0, 0, bw, h, 4) + '" fill="' + (o.mau || MAU.brand600) + '"><title>' +
      esc(o.label || 'Mức') + ': ' + esc(fmt(v)) + '</title></path>';
    return kemBang(khungSvg(o, w, h, s, 'ths-meter'), o, {
      cols: [{ key: 'label', label: 'Chỉ số' }, { key: 'value', label: 'Đang có', num: true }, { key: 'max', label: 'Mức tối đa', num: true }],
      rows: [{ label: o.label || o.title || 'Chỉ số', value: fmt(v), max: fmt(max) }]
    });
  }

  /* =========================================================================
   * 6 · SO SÁNH
   * ========================================================================= */

  /**
   * bars — cột ngang. Hình chủ lực của báo cáo trường học: tên môn, tên nhiệm
   * vụ, tên học sinh đều dài, mà cột ngang chứa được tên dài.
   *
   * Bố cục cố định: [tên][số ở một cột cố định][thanh khởi hành từ một x duy
   * nhất]. Nhờ vậy dấu tiếng Việt dài ngắn thế nào cũng không đẩy lệch cột số.
   * Mặc định MỘT màu cho mọi thanh — xem luật 2 ở đầu file.
   */
  function bars(o) {
    var d = o.data || [];
    var w = o.w || 640;
    var nameW = o.nameW || 168, valueW = o.valueW || 62;
    var rowH = o.rowH || 34;
    var pt = (o.padTop === undefined) ? 8 : o.padTop;
    var pb = (o.padBottom === undefined) ? 8 : o.padBottom;
    var pl = o.padLeft || 0, pr = (o.padRight === undefined) ? 16 : o.padRight;
    var barX = pl + nameW + valueW;      /* mọi thanh cùng một mốc khởi hành */
    var h = pt + rowH * Math.max(1, d.length) + pb;
    var i, tho = 0;
    for (i = 0; i < d.length; i++) if ((d[i].value || 0) > tho) tho = d[i].value || 0;
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(tho);
    var plotW = Math.max(20, w - barX - pr);
    var x = scaleLinear(0, max, 0, plotW);
    var fmt = o.fmt || nguyen;
    var nhieu = !!o.series;
    var s = '', hang = [];

    for (i = 0; i < d.length; i++) {
      var it = d[i];
      var day = Math.min(DAY_TOI_DA, rowH - 10);
      var yTop = pt + rowH * i;
      var yBar = yTop + (rowH - day) / 2;
      var bw = Math.max(0, x(it.value || 0));
      var mau = mauDau(o, it, i, d.length);

      s += veNhanCat(pl, yBar + day / 2 + 4, it.label, Math.floor(nameW / 6.6), null, 13, MAU.gray700);
      /* Số dẫn đầu, neo phải vào đúng một cột. Các số này xếp thẳng hàng DỌC
       * nên đây là chỗ đúng để dùng chữ số đều cột. */
      s += '<text class="num" x="' + round(barX - 12) + '" y="' + round(yBar + day / 2 + 4) +
        '" text-anchor="end" font-size="13" font-weight="700" fill="' + MAU.soTrenDau + '">' + esc(fmt(it.value)) + '</text>';
      /* Khe nền 2px giữa thanh và mặt trục. */
      var p = thanhNgang(barX + 2, yBar, bw, day, 4);
      if (p) {
        s += '<path class="ths-grow-x' + lopVan(i, nhieu) + '" d="' + p + '" fill="' + mau +
          '" style="transition-delay:' + round(i * 0.05) + 's"/>';
      }
      /* Vùng bắt chuột cao hết dòng: thanh 3px thì không ai trỏ trúng. */
      s += '<rect class="ths-hit" data-i="' + i + '" x="' + round(pl) + '" y="' + round(yTop) + '" width="' + round(w - pl) +
        '" height="' + round(rowH) + '" fill="transparent"' + (o.clickable ? ' style="cursor:pointer"' : '') + '><title>' +
        esc(it.label) + ': ' + esc(fmt(it.value)) + (o.unit ? ' ' + esc(o.unit) : '') + '</title></rect>';
      hang.push({ label: it.label, value: fmt(it.value), ghi: it.ghi || '' });
    }
    /* Đường gốc duy nhất, dựng sau để nằm trên nền dải. */
    s += '<line x1="' + round(barX) + '" x2="' + round(barX) + '" y1="' + round(pt) + '" y2="' + round(h - pb) +
      '" stroke="' + MAU.truc + '"' + NET + '/>';

    var svg = khungSvg(o, w, h, s, 'ths-bars');
    if (nhieu) {
      var lg = [];
      for (i = 0; i < d.length; i++) lg.push({ label: d[i].label, mau: mauDau(o, d[i], i, d.length) });
      svg += chuGiai(lg, true);
    }
    return kemBang(svg, o, {
      cols: [{ key: 'label', label: o.colLabel || 'Mục' }, { key: 'value', label: o.colValue || 'Giá trị', num: true }, { key: 'ghi', label: 'Ghi chú' }],
      rows: hang
    });
  }

  /**
   * barsEmphasis — làm nổi. Một thanh #237BD3, phần còn lại #D0D5DD.
   * Đây là hình bị dùng ít nhất, và thường là câu trả lời đúng cho "làm biểu đồ
   * này rõ hơn". Nếu câu chuyện là "riêng lớp này tụt" thì đây là hình, không
   * phải thang phân loại.
   */
  function barsEmphasis(o) {
    var d = (o.data || []).slice(), i;
    var noi = (o.emphasis === undefined) ? 0 : o.emphasis;
    for (i = 0; i < d.length; i++) {
      d[i] = gop(d[i], { mau: (i === noi || d[i].label === noi) ? MAU.brand600 : MAU.boiCanh });
    }
    return bars(gop(o, { data: d, series: false }));
  }

  /**
   * columns — cột dọc. Dùng khi hạng là thời gian hoặc tên ngắn.
   * Mỗi dải có một ô bắt chuột trong suốt CAO HẾT KHUNG, để cột thấp một em vẫn
   * bấm được chứ không phải nhắm vào dải 6px.
   */
  function columns(o) {
    var d = o.data || [];
    var w = o.w || 640, h = o.h || 300;
    var pad = gop({ t: 34, r: 16, b: 40, l: 46 }, o.pad);
    var rect = { x: pad.l, y: pad.t, w: w - pad.l - pad.r, h: h - pad.t - pad.b };
    var i, tho = 0;
    for (i = 0; i < d.length; i++) if ((d[i].value || 0) > tho) tho = d[i].value || 0;
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(tho);
    var y = thangDoc(rect, max), x = thangNgang(rect, d.length, 'band');
    var band = rect.w / Math.max(1, d.length);
    var bw = beDay(band, 0.62, o.barW);
    var fmt = o.fmt || nguyen;
    var nhieu = !!o.series;
    var s = axisY({ rect: rect, max: max, count: o.count || 4, fmt: o.fmtTruc || fmt, dai: o.dai });
    var hang = [];

    for (i = 0; i < d.length; i++) {
      var v = d[i].value || 0;
      var top = y(v), ch = rect.y + rect.h - top;
      var cx = x(i), bx = cx - bw / 2;
      var mau = mauDau(o, d[i], i, d.length);

      s += '<path class="ths-grow' + lopVan(i, nhieu) + '" d="' + cotDoc(bx, top, bw, ch, 4) + '" fill="' + mau +
        '" style="transition-delay:' + round(i * 0.06) + 's"/>';
      /* Cột dọc → giá trị trên nắp. Hàng nhãn này nằm NGANG nên không tabular. */
      s += '<text x="' + round(cx) + '" y="' + round(top - 9) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' +
        MAU.soTrenDau + '">' + esc(fmt(v)) + '</text>';
      s += '<rect class="ths-hit" data-i="' + i + '" x="' + round(cx - band / 2) + '" y="' + round(rect.y) +
        '" width="' + round(band) + '" height="' + round(rect.h) + '" fill="transparent"' +
        (o.clickable ? ' style="cursor:pointer"' : '') + '><title>' + esc(d[i].label) + ': ' + esc(fmt(v)) +
        (o.unit ? ' ' + esc(o.unit) : '') + '</title></rect>';
      hang.push({ label: d[i].label, value: fmt(v), ghi: d[i].ghi || '' });
    }
    s += axisX({ rect: rect, labels: nhanCua(d), kind: 'band', baseline: false });

    var svg = khungSvg(o, w, h, s, 'ths-columns');
    if (nhieu) {
      var lg = [];
      for (i = 0; i < d.length; i++) lg.push({ label: d[i].label, mau: mauDau(o, d[i], i, d.length) });
      svg += chuGiai(lg, true);
    }
    return kemBang(svg, o, {
      cols: [{ key: 'label', label: o.colLabel || 'Mục' }, { key: 'value', label: o.colValue || 'Giá trị', num: true }, { key: 'ghi', label: 'Ghi chú' }],
      rows: hang
    });
  }

  /**
   * histogram — cột tần số cho phổ điểm.
   * Khoảng điểm là THỨ TỰ (đảo `<5` với `>8` là đổi nghĩa), nên dùng dải xanh
   * 4 bước, không dùng bốn màu phân loại.
   * Chỉ dựng khi đã quét đủ sổ lớp — hệ thống không có công cụ trả phổ điểm, và
   * con số này là tự tính từ hai lần đọc. Nói rõ điều đó trong phụ đề của thẻ.
   */
  function histogram(o) {
    return columns(gop(o, { ordinal: true, series: false, colLabel: o.colLabel || 'Khoảng điểm', colValue: o.colValue || 'Số em' }));
  }

  /**
   * dotPlot — mỗi mục một điểm trên CÙNG một thang.
   * Hình tốt nhất để so nhiều lớp: thấy ngay lớp nào tách khỏi nhóm, và nó chịu
   * được nhiều mục hơn cột ngang. Cũng là hình thay cho radar.
   */
  function dotPlot(o) {
    var d = o.data || [];
    var w = o.w || 660, nameW = o.nameW || 150, rowH = o.rowH || 30;
    var pt = 30, pb = 12, pr = 58;
    var h = pt + rowH * Math.max(1, d.length) + pb;
    var i, tho = 0;
    for (i = 0; i < d.length; i++) if ((d[i].value || 0) > tho) tho = d[i].value || 0;
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(tho);
    var plotW = Math.max(30, w - nameW - pr);
    var x = scaleLinear(0, max, nameW, nameW + plotW);
    var fmt = o.fmt || function (v) { return soVN(v, 1); };
    var s = '', hang = [], k;

    for (k = 0; k <= 4; k++) {
      var gv = max * k / 4, gx = round(x(gv));
      s += '<line x1="' + gx + '" x2="' + gx + '" y1="' + pt + '" y2="' + round(h - pb) + '" stroke="' + MAU.luoi + '"' + NET + '/>';
      s += '<text class="num" x="' + gx + '" y="' + (pt - 12) + '" text-anchor="middle" font-size="11" fill="' + MAU.nhanTruc + '">' +
        esc(fmt(gv)) + '</text>';
    }
    for (i = 0; i < d.length; i++) {
      var it = d[i], yy = pt + rowH * i + rowH / 2, cx = round(x(it.value || 0));
      var mau = mauDau(o, it, i, d.length);
      s += veNhanCat(0, yy + 4, it.label, Math.floor(nameW / 6.6), null, 13, MAU.gray700);
      s += '<line x1="' + round(nameW) + '" x2="' + cx + '" y1="' + round(yy) + '" y2="' + round(yy) + '" stroke="' + MAU.gray200 + '"' + NET + '/>';
      /* Điểm dấu từ 8px (r ≥ 4), tô màu chuỗi, vành nền 2px để đọc được ở chỗ chồng nhau. */
      s += '<circle cx="' + cx + '" cy="' + round(yy) + '" r="6" fill="' + mau + '"' + VANH + '/>';
      s += '<text class="num" x="' + round(w - 6) + '" y="' + round(yy + 4) + '" text-anchor="end" font-size="12.5" font-weight="700" fill="' +
        MAU.soTrenDau + '">' + esc(fmt(it.value)) + '</text>';
      s += '<rect class="ths-hit" data-i="' + i + '" x="0" y="' + round(pt + rowH * i) + '" width="' + w + '" height="' + rowH +
        '" fill="transparent"><title>' + esc(it.label) + ': ' + esc(fmt(it.value)) + (o.unit ? ' ' + esc(o.unit) : '') + '</title></rect>';
      hang.push({ label: it.label, value: fmt(it.value), ghi: it.ghi || '' });
    }
    return kemBang(khungSvg(o, w, h, s, 'ths-dotplot'), o, {
      cols: [{ key: 'label', label: o.colLabel || 'Mục' }, { key: 'value', label: o.colValue || 'Giá trị', num: true }, { key: 'ghi', label: 'Ghi chú' }],
      rows: hang
    });
  }

  /**
   * dumbbell — trước → sau theo từng mục. MỘT màu, HAI độ đậm (không phải hai
   * màu phân loại: trước và sau là cùng một đại lượng ở hai thời điểm).
   */
  function dumbbell(o) {
    var d = o.data || [];
    var w = o.w || 660, nameW = o.nameW || 150, rowH = o.rowH || 36;
    var pt = 30, pb = 12, pr = 58;
    var h = pt + rowH * Math.max(1, d.length) + pb;
    var i, tho = 0;
    for (i = 0; i < d.length; i++) tho = Math.max(tho, d[i].truoc || 0, d[i].sau || 0);
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(tho);
    var min = (o.min === undefined) ? 0 : o.min;
    var plotW = Math.max(30, w - nameW - pr);
    var x = scaleLinear(min, max, nameW, nameW + plotW);
    var fmt = o.fmt || function (v) { return soVN(v, 1); };
    var mauTruoc = o.mauTruoc || MAU.brand300;   /* cùng dải, nhạt hơn */
    var mauSau = o.mauSau || MAU.brand600;
    var s = '', hang = [], k;

    for (k = 0; k <= 4; k++) {
      var gv = min + (max - min) * k / 4, gx = round(x(gv));
      s += '<line x1="' + gx + '" x2="' + gx + '" y1="' + pt + '" y2="' + round(h - pb) + '" stroke="' + MAU.luoi + '"' + NET + '/>';
      s += '<text class="num" x="' + gx + '" y="' + (pt - 12) + '" text-anchor="middle" font-size="11" fill="' + MAU.nhanTruc + '">' +
        esc(fmt(gv)) + '</text>';
    }
    for (i = 0; i < d.length; i++) {
      var it = d[i], yy = pt + rowH * i + rowH / 2;
      var xa = round(x(it.truoc || 0)), xb = round(x(it.sau || 0));
      var chenh = (it.sau || 0) - (it.truoc || 0);
      s += veNhanCat(0, yy + 4, it.label, Math.floor(nameW / 6.6), null, 13, MAU.gray700);
      s += '<line x1="' + xa + '" x2="' + xb + '" y1="' + round(yy) + '" y2="' + round(yy) + '" stroke="' + MAU.gray200 +
        '" stroke-width="3" stroke-linecap="round"' + NET + '/>';
      s += '<circle cx="' + xa + '" cy="' + round(yy) + '" r="5.5" fill="' + mauTruoc + '"' + VANH + '/>';
      s += '<circle cx="' + xb + '" cy="' + round(yy) + '" r="5.5" fill="' + mauSau + '"' + VANH + '/>';
      /* Chữ dùng mực chữ, không mang màu dữ liệu — dấu cộng/trừ đã nói chiều. */
      s += '<text class="num" x="' + round(w - 6) + '" y="' + round(yy + 4) + '" text-anchor="end" font-size="12.5" font-weight="700" fill="' +
        MAU.soTrenDau + '">' + esc((chenh >= 0 ? '+' : '') + soVN(chenh, 1)) + '</text>';
      s += '<rect class="ths-hit" data-i="' + i + '" x="0" y="' + round(pt + rowH * i) + '" width="' + w + '" height="' + rowH +
        '" fill="transparent"><title>' + esc(it.label) + ' · ' + esc(o.nhanTruoc || 'trước') + ' ' + esc(fmt(it.truoc)) +
        ' → ' + esc(o.nhanSau || 'sau') + ' ' + esc(fmt(it.sau)) + '</title></rect>';
      hang.push({ label: it.label, truoc: fmt(it.truoc), sau: fmt(it.sau), delta: (chenh >= 0 ? '+' : '') + soVN(chenh, 1) });
    }
    var svg = khungSvg(o, w, h, s, 'ths-dumbbell');
    svg += chuGiai([{ label: o.nhanTruoc || 'Trước', mau: mauTruoc }, { label: o.nhanSau || 'Sau', mau: mauSau }], true);
    return kemBang(svg, o, {
      cols: [{ key: 'label', label: o.colLabel || 'Mục' }, { key: 'truoc', label: o.nhanTruoc || 'Trước', num: true },
        { key: 'sau', label: o.nhanSau || 'Sau', num: true }, { key: 'delta', label: 'Chênh lệch', num: true }],
      rows: hang
    });
  }

  /** bullet — thanh mục tiêu: giá trị so với một vạch mục tiêu.
   * Cùng với cột ngang, đây là một trong hai hình đọc được tốt nhất. */
  function bullet(o) {
    var w = o.w || 460, h = o.h || 30;
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(Math.max(o.value || 0, o.target || 0));
    var x = scaleLinear(0, max, 0, w);
    var fmt = o.fmt || function (v) { return soVN(v, 1); };
    var bw = Math.max(0, x(clamp(o.value || 0, 0, max)));
    var tx = round(x(clamp(o.target || 0, 0, max)));
    var yb = h / 2 - 7;
    var s = '<rect x="0" y="' + round(yb) + '" width="' + w + '" height="14" rx="7" fill="' + (o.rang || MAU.brand100) + '"/>';
    s += '<path class="ths-grow-x" d="' + thanhNgang(0, yb, bw, 14, 4) + '" fill="' + (o.mau || MAU.brand600) + '"/>';
    /* Mốc mục tiêu là một VẠCH, không phải một màu — màu một mình không nói được "mục tiêu". */
    s += '<line x1="' + tx + '" x2="' + tx + '" y1="' + round(h / 2 - 13) + '" y2="' + round(h / 2 + 13) + '" stroke="' + MAU.gray900 +
      '" stroke-width="3" stroke-linecap="round"' + NET + '/>';
    s += '<rect class="ths-hit" x="0" y="0" width="' + w + '" height="' + h + '" fill="transparent"><title>' +
      esc(o.label || 'Giá trị') + ': ' + esc(fmt(o.value)) + ' · ' + esc(o.targetLabel || 'mục tiêu') + ' ' + esc(fmt(o.target)) +
      '</title></rect>';
    return kemBang(khungSvg(o, w, h, s, 'ths-bullet'), o, {
      cols: [{ key: 'label', label: 'Chỉ số' }, { key: 'value', label: 'Đang có', num: true }, { key: 'target', label: o.targetLabel || 'Mục tiêu', num: true }],
      rows: [{ label: o.label || o.title || 'Chỉ số', value: fmt(o.value), target: fmt(o.target) }]
    });
  }

  /* =========================================================================
   * 7 · XU HƯỚNG
   * ========================================================================= */

  /* Thân dùng chung của lineChart và areaChart. */
  function _duong(o, wash) {
    var series = (o.series || []).slice(0, wash ? 1 : 3);   /* vùng: CHỈ một chuỗi */
    var nhan = o.labels || [];
    var w = o.w || 680, h = o.h || 300;
    var pad = gop({ t: 34, r: 24, b: 38, l: 46 }, o.pad);
    var rect = { x: pad.l, y: pad.t, w: w - pad.l - pad.r, h: h - pad.t - pad.b };
    var i, j, tho = 0;
    for (i = 0; i < series.length; i++) {
      for (j = 0; j < series[i].values.length; j++) {
        var vv = series[i].values[j];
        if (vv !== null && vv !== undefined && vv > tho) tho = vv;
      }
    }
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(tho);
    var n = nhan.length || (series[0] ? series[0].values.length : 1);
    var y = thangDoc(rect, max), x = thangNgang(rect, n, 'point');
    var fmt = o.fmt || nguyen;
    var nhieu = series.length > 1;
    var s = axisY({ rect: rect, max: max, count: o.count || 4, fmt: o.fmtTruc || fmt, dai: o.dai });
    var cols = [{ key: 'label', label: o.colLabel || 'Mốc' }], hang = [], lg = [], k;

    for (i = 0; i < series.length; i++) {
      var se = series[i], mau = se.mau || CHUOI[i % CHUOI.length], pts = [], cao = -Infinity, thap = Infinity, iCao = 0, iThap = 0;
      for (j = 0; j < se.values.length; j++) {
        if (se.values[j] === null || se.values[j] === undefined) continue;
        pts.push({ x: x(j), y: y(se.values[j]), i: j, v: se.values[j] });
        if (se.values[j] > cao) { cao = se.values[j]; iCao = pts.length - 1; }
        if (se.values[j] < thap) { thap = se.values[j]; iThap = pts.length - 1; }
      }
      if (!pts.length) continue;
      if (wash) {
        /* Nền vùng: màu chuỗi ở ~10% mờ — một lớp rửa, không phải khối đặc. */
        s += '<path d="' + areaPath(pts, rect.y + rect.h, o.smooth !== false) + '" fill="' + mau + '" opacity=".10"/>';
      }
      s += '<path class="ths-draw" d="' + ((o.smooth !== false) ? smoothPath(pts) : linePath(pts)) +
        '" fill="none" stroke="' + mau + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"' + NET +
        ' style="transition-delay:' + round(i * 0.2) + 's"/>';

      for (j = 0; j < pts.length; j++) {
        var cuoi = (j === pts.length - 1);
        /* Điểm dấu từ 8px (r ≥ 4), tô màu chuỗi, vành nền 2px. */
        s += '<circle cx="' + round(pts[j].x) + '" cy="' + round(pts[j].y) + '" r="' + (cuoi ? 5.5 : 4) +
          '" fill="' + mau + '"' + VANH + '/>';
        /* KHÔNG đặt số lên mọi điểm — nhãn trực tiếp có tác dụng VÌ nó thưa.
         * Chỉ nhãn ở điểm cuối và hai giá trị cực. */
        var dangNhan = cuoi || (o.labelPoints === 'all') || (o.labelPoints !== false && (j === iCao || j === iThap));
        if (dangNhan) {
          /* Chuỗi 1 nhãn lên trên dấu, chuỗi 2 xuống dưới — hai đường cắt nhau
           * thì hai nhãn vẫn không chồng, mà không phải đẩy nhãn rời khỏi đường. */
          s += '<text x="' + round(pts[j].x) + '" y="' + round(pts[j].y + (i === 0 ? -13 : 20)) +
            '" text-anchor="middle" font-size="' + (cuoi ? 13 : 12) +
            '" font-weight="' + (cuoi ? 700 : 600) + '" fill="' + (cuoi ? MAU.soTrenDau : MAU.mucNhat) + '">' +
            esc(fmt(pts[j].v)) + '</text>';
        }
        /* Vùng bắt chuột r=22 (44px): dấu 8px là cái đầu kim không ai bấm trúng. */
        s += '<circle class="ths-hit" data-i="' + pts[j].i + '" data-s="' + i + '" cx="' + round(pts[j].x) + '" cy="' + round(pts[j].y) +
          '" r="22" fill="transparent"><title>' + esc(nhan[pts[j].i] || ('#' + (pts[j].i + 1))) +
          (se.name ? ' · ' + esc(se.name) : '') + ': ' + esc(fmt(pts[j].v)) + (o.unit ? ' ' + esc(o.unit) : '') + '</title></circle>';
      }
      cols.push({ key: 's' + i, label: se.name || ('Chuỗi ' + (i + 1)), num: true });
      lg.push({ label: se.name || ('Chuỗi ' + (i + 1)), mau: mau });
    }
    s += axisX({ rect: rect, labels: nhan, kind: 'point', baseline: true });

    for (k = 0; k < n; k++) {
      var r0 = { label: nhan[k] || ('#' + (k + 1)) };
      for (i = 0; i < series.length; i++) {
        var val = series[i].values[k];
        r0['s' + i] = (val === null || val === undefined) ? '—' : fmt(val);
      }
      hang.push(r0);
    }
    var svg = khungSvg(o, w, h, s, wash ? 'ths-area' : 'ths-line');
    if (nhieu) svg += chuGiai(lg, true);   /* một chuỗi thì KHÔNG có khung chú giải */
    return kemBang(svg, o, { cols: cols, rows: hang });
  }

  /** lineChart — 1 đến 3 chuỗi, nét 2px, vẽ dần khi cuộn tới.
   * Dưới 4 điểm thì đừng vẽ đường — dùng ô chỉ số. */
  function lineChart(o) { return _duong(o, false); }

  /** areaChart — CHỈ một chuỗi, thêm lớp rửa 10% xuống đường gốc.
   * Truyền nhiều chuỗi thì chỉ chuỗi đầu được vẽ: vùng xếp lớp đọc sai độ lớn. */
  function areaChart(o) { return _duong(o, true); }

  /** sparkline — đường nhỏ 12 điểm bên trong ô chỉ số.
   * Không trục, không nhãn — nó chỉ nói hình dạng. */
  function sparkline(o) {
    var v = o.values || [], w = o.w || 64, h = o.h || 26;
    var mau = o.mau || MAU.gray400, i;
    if (!v.length) return khungSvg(gop({ ariaLabel: 'Chưa có dữ liệu xu hướng' }, o), w, h, '', 'spark', w);
    var mn = Math.min.apply(null, v), mx = Math.max.apply(null, v);
    var rng = (mx - mn) || 1, pts = [];
    for (i = 0; i < v.length; i++) {
      pts.push({ x: 4 + (w - 8) * (v.length > 1 ? i / (v.length - 1) : 0), y: (h - 4) - (h - 8) * (v[i] - mn) / rng });
    }
    var s = '<path d="' + linePath(pts) + '" fill="none" stroke="' + mau +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".6"' + NET + '/>' +
      '<circle cx="' + round(pts[pts.length - 1].x) + '" cy="' + round(pts[pts.length - 1].y) + '" r="2.6" fill="' + mau + '"/>';
    return khungSvg(gop({ ariaLabel: 'Vệt xu hướng' }, o), w, h, s, 'spark', w);
  }

  /* =========================================================================
   * 8 · PHẦN TRÊN TỔNG
   * ========================================================================= */

  /**
   * stackedBar — cột xếp lớp. MẶC ĐỊNH cho phần-trên-tổng.
   * Nằm ngang khi nhiều hạng hoặc tên dài — với dữ liệu trường học thì gần như
   * luôn nằm ngang. Các đoạn cách nhau khe nền 2px.
   * Không đặt nhãn vào đoạn giữa: đo trước, không vừa thì để chú giải mang.
   * Bề dày đoạn chính là số liệu, nên không gắn vector-effect ở đây.
   */
  function stackedBar(o) {
    var d = o.data || [];
    var w = o.w || 640, h = Math.min(DAY_TOI_DA, o.thickness || DAY_TOI_DA);
    var rx = (o.radius === undefined) ? 8 : o.radius;
    var i, tongTho = 0;
    for (i = 0; i < d.length; i++) tongTho += (d[i].value || 0);
    var tong = (o.total !== undefined && o.total !== null) ? o.total : tongTho;
    var chia = tong || 1;
    var fmt = o.fmt || nguyen;
    var ordinal = (o.ordinal !== false);   /* mức nhiệm vụ, khoảng điểm… đều là thứ tự */
    var cid = idMoi('clip');
    var s = '<defs><clipPath id="' + cid + '"><rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + rx + '"/></clipPath></defs>';
    s += '<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + MAU.gray100 + '"/>';
    s += '<g clip-path="url(#' + cid + ')">';
    var cur = 0, hang = [], lg = [];
    for (i = 0; i < d.length; i++) {
      var frac = (d[i].value || 0) / chia;
      var segW = frac * w;
      var ve = Math.max(0, segW - 2);      /* khe nền 2px giữa các đoạn */
      var mau = d[i].mau || (ordinal ? THANG[Math.min(THANG.length - 1, i)] : CHUOI[i % CHUOI.length]);
      if (ve > 0) {
        s += '<rect class="ths-grow-x' + lopVan(i, !ordinal) + '" x="' + round(cur) + '" y="0" width="' + round(ve) + '" height="' + h +
          '" fill="' + mau + '" style="transform-origin:left;transition-delay:' + round(i * 0.07) + 's">' +
          '<title>' + esc(d[i].label) + ': ' + esc(fmt(d[i].value)) + ' · ' + esc(tiLe(frac)) + '</title></rect>';
      }
      cur += segW;
      hang.push({ label: d[i].label, value: fmt(d[i].value), pct: tiLe(frac) });
      lg.push({ label: d[i].label, mau: mau, value: fmt(d[i].value) });
    }
    s += '</g>';
    var svg = khungSvg(o, w, h, s, 'ths-stack') + chuGiai(lg, true);
    return kemBang(svg, o, {
      cols: [{ key: 'label', label: o.colLabel || 'Nhóm' }, { key: 'value', label: o.colValue || 'Số lượng', num: true }, { key: 'pct', label: 'Tỉ lệ', num: true }],
      rows: hang
    });
  }

  /**
   * donut — chỉ dùng khi phần-trên-tổng cần đọc trong một cái nhìn, tối đa 6
   * lát, và một lát rõ ràng trội. KHÔNG dùng để so các giá trị gần nhau: mắt
   * người không so được góc. Có lát nào gần nhau thì đổi sang cột ngang.
   *
   * Một <circle> cho mỗi lát, cùng bán kính, quay -90° để bắt đầu từ 12 giờ.
   * Khe hở co theo lát (gap = min(2, độ dài cung)) nên lát bé xíu không ra cung
   * âm — đó là chỗ vành tròn hay vỡ nhất.
   * Mỗi lát có <title> con: chú giải in được, không cần JavaScript.
   */
  function donut(o) {
    var d = (o.data || []).slice(0, 6);
    var size = o.size || 190, r = o.r || 70, sw = o.thickness || 26;
    var cx = size / 2, cy = size / 2, CIRC = 2 * Math.PI * r;
    var i, tongTho = 0;
    for (i = 0; i < d.length; i++) tongTho += (d[i].value || 0);
    var tong = (o.total !== undefined && o.total !== null) ? o.total : tongTho;
    var chia = tong || 1;
    var fmt = o.fmt || nguyen;
    var ordinal = !!o.ordinal;
    var acc = 0, s = '', hang = [], lg = [];

    for (i = 0; i < d.length; i++) {
      var frac = (d[i].value || 0) / chia;
      var len = frac * CIRC;
      var khe = Math.min(2, len);            /* lát nhỏ hơn khe thì khe co lại */
      var cung = Math.max(0, len - khe);
      var mau = d[i].mau || (ordinal ? THANG[Math.min(THANG.length - 1, i)] : CHUOI[i % CHUOI.length]);
      s += '<circle class="ths-arc' + lopVan(i, !ordinal) + '" r="' + r + '" cx="' + cx + '" cy="' + cy + '" fill="none" stroke="' + mau +
        '" stroke-width="' + sw + '" stroke-dasharray="0 ' + round(CIRC) + '"' +
        ' data-arc="' + round(cung) + '" data-rest="' + round(CIRC - cung) + '" data-off="' + round(-(acc * CIRC) - khe / 2) + '"' +
        ' data-i="' + i + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"' +
        (o.clickable ? ' style="cursor:pointer"' : '') + '>' +
        '<title>' + esc(d[i].label) + ': ' + esc(fmt(d[i].value)) + (o.unit ? ' ' + esc(o.unit) : '') +
        ' · ' + esc(tiLe(frac)) + '</title></circle>';
      acc += frac;
      hang.push({ label: d[i].label, value: fmt(d[i].value), pct: tiLe(frac) });
      lg.push({ label: d[i].label, mau: mau, value: fmt(d[i].value) });
    }
    /* Số giữa vành: KHÔNG class="num". Ở cỡ 30px chữ số đều cột làm "121" trông
     * rời rạc, có khoảng trống giả giữa các chữ số. */
    s += '<text x="' + cx + '" y="' + (cy - 3) + '" text-anchor="middle" font-size="30" font-weight="800" fill="' +
      MAU.soTrenDau + '" data-count="' + (tong || 0) + '" data-dec="' + (o.dec || 0) + '">' + esc(fmt(tong)) + '</text>';
    s += '<text x="' + cx + '" y="' + (cy + 19) + '" text-anchor="middle" font-size="12" fill="' + MAU.mucNhat + '">' +
      esc(o.centerLabel || o.unit || '') + '</text>';

    var svg = khungSvg(o, size, size, s, 'ths-donut', o.maxWidth || 220) + chuGiai(lg, true);
    return kemBang(svg, o, {
      cols: [{ key: 'label', label: o.colLabel || 'Nhóm' }, { key: 'value', label: o.colValue || 'Số lượng', num: true }, { key: 'pct', label: 'Tỉ lệ', num: true }],
      rows: hang
    });
  }

  /**
   * divergingStacked — cột xếp lớp hai chiều: thang có THỨ TỰ, căn giữa ở mức
   * trung tính. Dùng cho "chưa mở ← đang làm → đã nộp" khi muốn thấy cả hai phía
   * của mức giữa.
   * o = { rows:[{label, values:[]}], cats:[{label}], middle, w, rowH }
   */
  function divergingStacked(o) {
    var rows = o.rows || [], cats = o.cats || [];
    var giua = (o.middle === undefined) ? Math.floor(cats.length / 2) : o.middle;
    var w = o.w || 660, nameW = o.nameW || 150, rowH = o.rowH || 34;
    var pt = 12, pb = 26;
    var h = pt + rowH * Math.max(1, rows.length) + pb;
    var plotW = Math.max(40, w - nameW - 16);
    var x0 = nameW + plotW / 2;
    var i, j, thoAm = 0, thoDuong = 0, tongHang = [];

    function tong(v) { var t = 0, k; for (k = 0; k < v.length; k++) t += (v[k] || 0); return t; }
    for (i = 0; i < rows.length; i++) {
      var T = tong(rows[i].values) || 1;
      tongHang.push(T);
      var am = 0, duong = 0;
      for (j = 0; j < cats.length; j++) {
        var f = (rows[i].values[j] || 0) / T;
        if (j < giua) am += f; else if (j > giua) duong += f; else { am += f / 2; duong += f / 2; }
      }
      if (am > thoAm) thoAm = am;
      if (duong > thoDuong) thoDuong = duong;
    }
    var nua = plotW / 2;
    var thang = Math.max(thoAm, thoDuong) || 1;
    var s = '', hangBang = [], lg = [];
    var mauCat = [];
    for (j = 0; j < cats.length; j++) {
      if (cats[j].mau) mauCat.push(cats[j].mau);
      else if (j < giua) mauCat.push(HAI_CHIEU.duoi[Math.min(HAI_CHIEU.duoi.length - 1, giua - 1 - j)]);
      else if (j > giua) mauCat.push(HAI_CHIEU.tren[Math.min(HAI_CHIEU.tren.length - 1, j - giua - 1)]);
      else mauCat.push(HAI_CHIEU.giua);
      lg.push({ label: cats[j].label, mau: mauCat[j] });
    }
    for (i = 0; i < rows.length; i++) {
      var yTop = pt + rowH * i, day = Math.min(DAY_TOI_DA, rowH - 10);
      var yBar = yTop + (rowH - day) / 2, T2 = tongHang[i];
      s += veNhanCat(0, yBar + day / 2 + 4, rows[i].label, Math.floor(nameW / 6.6), null, 13, MAU.gray700);
      /* Trái của mức giữa: xếp từ tâm ra ngoài. */
      var cur = x0;
      for (j = giua; j >= 0; j--) {
        var fa = (rows[i].values[j] || 0) / T2 * (j === giua ? 0.5 : 1) * (nua / thang);
        if (fa <= 0) continue;
        s += '<rect x="' + round(cur - fa) + '" y="' + round(yBar) + '" width="' + round(Math.max(0, fa - 2)) + '" height="' + round(day) +
          '" fill="' + mauCat[j] + '"><title>' + esc(rows[i].label) + ' · ' + esc(cats[j].label) + ': ' + esc(nguyen(rows[i].values[j])) + '</title></rect>';
        cur -= fa;
      }
      cur = x0;
      for (j = giua; j < cats.length; j++) {
        var fb = (rows[i].values[j] || 0) / T2 * (j === giua ? 0.5 : 1) * (nua / thang);
        if (fb <= 0) continue;
        s += '<rect x="' + round(cur + 2) + '" y="' + round(yBar) + '" width="' + round(Math.max(0, fb - 2)) + '" height="' + round(day) +
          '" fill="' + mauCat[j] + '"><title>' + esc(rows[i].label) + ' · ' + esc(cats[j].label) + ': ' + esc(nguyen(rows[i].values[j])) + '</title></rect>';
        cur += fb;
      }
      var rb = { label: rows[i].label };
      for (j = 0; j < cats.length; j++) rb['c' + j] = nguyen(rows[i].values[j]);
      hangBang.push(rb);
    }
    /* Vạch mức giữa — xám trung tính, đọc ra "không có gì". */
    s += '<line x1="' + round(x0) + '" x2="' + round(x0) + '" y1="' + pt + '" y2="' + round(h - pb) + '" stroke="' + MAU.truc +
      '" stroke-width="1.5"' + NET + '/>';
    s += '<text x="' + round(x0) + '" y="' + round(h - 8) + '" text-anchor="middle" font-size="11" fill="' + MAU.nhanTruc + '">' +
      esc(cats[giua] ? cats[giua].label : 'mức giữa') + '</text>';

    var colsBang = [{ key: 'label', label: o.colLabel || 'Dòng' }];
    for (j = 0; j < cats.length; j++) colsBang.push({ key: 'c' + j, label: cats[j].label, num: true });
    return kemBang(khungSvg(o, w, h, s, 'ths-divstack') + chuGiai(lg, true), o, { cols: colsBang, rows: hangBang });
  }

  /* =========================================================================
   * 9 · LỆCH VÀ PHÂN BỐ
   * ========================================================================= */

  /**
   * divergingBar — trên/dưới một ngưỡng. Xanh một phía, đỏ phía kia, vạch không
   * màu xám. Không xanh↔lục: cùng lạnh, điểm giữa không đọc ra "không có gì".
   */
  function divergingBar(o) {
    var d = o.data || [];
    var w = o.w || 660, h = o.h || 290;
    var pad = gop({ t: 26, r: 16, b: 42, l: 52 }, o.pad);
    var rect = { x: pad.l, y: pad.t, w: w - pad.l - pad.r, h: h - pad.t - pad.b };
    var i, tho = 0;
    for (i = 0; i < d.length; i++) if (Math.abs(d[i].value || 0) > tho) tho = Math.abs(d[i].value || 0);
    var max = (o.max !== undefined && o.max !== null) ? o.max : niceMax(tho);
    var y0 = rect.y + rect.h / 2, nua = rect.h / 2;
    var x = thangNgang(rect, d.length, 'band');
    var band = rect.w / Math.max(1, d.length);
    var bw = beDay(band, 0.58, o.barW);
    var fmt = o.fmt || function (v) { return (v > 0 ? '+' : '') + soVN(v, 1); };
    var s = '', hang = [], k;

    for (k = -2; k <= 2; k++) {
      if (k === 0) continue;
      var yy = round(y0 - nua * (k / 2));
      s += '<line x1="' + round(rect.x) + '" x2="' + round(rect.x + rect.w) + '" y1="' + yy + '" y2="' + yy +
        '" stroke="' + MAU.luoi + '"' + NET + '/>';
      s += '<text class="num" x="' + round(rect.x - 8) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="' +
        MAU.nhanTruc + '">' + esc(fmt(max * k / 2)) + '</text>';
    }
    for (i = 0; i < d.length; i++) {
      var v = d[i].value || 0;
      var ch = Math.abs(v) / (max || 1) * nua;
      var top = v >= 0 ? y0 - ch : y0;
      var mau = v >= 0 ? (o.mauTren || MAU.brand600) : (o.mauDuoi || MAU.loi600);
      var cx = x(i), bx = cx - bw / 2;
      s += '<path class="ths-grow" d="' + (v >= 0 ? cotDoc(bx, top, bw, ch, 4) : cotDocXuong(bx, top, bw, ch, 4)) +
        '" fill="' + mau + '" style="transform-origin:' + (v >= 0 ? 'bottom' : 'top') + ';transition-delay:' + round(i * 0.05) + 's"/>';
      /* Chữ dùng mực chữ, không mang màu dữ liệu; dấu +/− đã nói chiều. */
      s += '<text x="' + round(cx) + '" y="' + round(v >= 0 ? (top - 8) : (top + ch + 16)) +
        '" text-anchor="middle" font-size="12.5" font-weight="700" fill="' + MAU.soTrenDau + '">' + esc(fmt(v)) + '</text>';
      s += '<rect class="ths-hit" data-i="' + i + '" x="' + round(cx - band / 2) + '" y="' + round(rect.y) + '" width="' + round(band) +
        '" height="' + round(rect.h) + '" fill="transparent"><title>' + esc(d[i].label) + ': ' + esc(fmt(v)) + '</title></rect>';
      hang.push({ label: d[i].label, value: fmt(v), ghi: d[i].ghi || '' });
    }
    /* Vạch không vẽ sau các cột để luôn đọc được. */
    s += '<line x1="' + round(rect.x) + '" x2="' + round(rect.x + rect.w) + '" y1="' + round(y0) + '" y2="' + round(y0) +
      '" stroke="' + MAU.truc + '" stroke-width="1.5"' + NET + '/>';
    s += axisX({ rect: rect, labels: nhanCua(d), kind: 'band', baseline: false });

    return kemBang(khungSvg(o, w, h, s, 'ths-diverging'), o, {
      cols: [{ key: 'label', label: o.colLabel || 'Mục' }, { key: 'value', label: o.colValue || 'Chênh lệch', num: true }, { key: 'ghi', label: 'Ghi chú' }],
      rows: hang
    });
  }

  /* Chia nhóm theo phân vi — để một ô lệch hẳn không nuốt cả thang màu. */
  function nhomPhanVi(vals, k) {
    var xs = [], i;
    for (i = 0; i < vals.length; i++) if (vals[i] !== null && vals[i] !== undefined && vals[i] === vals[i]) xs.push(vals[i]);
    xs.sort(function (a, b) { return a - b; });
    var moc = [];
    for (i = 1; i < k; i++) {
      if (!xs.length) { moc.push(0); continue; }
      moc.push(xs[Math.min(xs.length - 1, Math.floor(xs.length * i / k))]);
    }
    return moc;
  }
  function nhomCua(v, moc) {
    for (var i = 0; i < moc.length; i++) if (v < moc[i]) return i;
    return moc.length;
  }

  /**
   * heatmap — lưới hai chiều (lớp × tuần, khối × môn), chia nhóm theo phân vi.
   * CHỈ dùng dải xanh. Mọi dải cam đã đo đều trượt phép đầu sáng, nên
   * ths-course-builder vẽ heatmap bằng dải cam là chỗ không nên bắt chước.
   * Ô trống tô #F2F4F7 VÀ có hẳn một mục "chưa có dữ liệu" trong chú giải —
   * không để người đọc tự đoán ô nhạt nghĩa là ít hay là thiếu.
   * Không gắn vân in cho hình này: thang thứ tự in ra đã thành các mức xám khác nhau.
   */
  function heatmap(o) {
    var rows = o.rows || [], cols = o.cols || [];
    var cell = o.cell || 40, khe = (o.gap === undefined) ? 2 : o.gap;   /* khe nền 2px */
    var nameW = o.nameW || 120, topH = o.topH || 26;
    var w = nameW + cols.length * cell;
    var h = topH + rows.length * cell + 6;
    var i, j, tat = [];
    for (i = 0; i < rows.length; i++) for (j = 0; j < cols.length; j++) tat.push(rows[i].values[j]);
    var moc = nhomPhanVi(tat, 4);
    var fmt = o.fmt || nguyen;
    var s = '', hangBang = [], colsBang = [{ key: 'label', label: o.colLabel || 'Dòng' }];

    for (j = 0; j < cols.length; j++) {
      s += veNhanCat(nameW + cell * j + cell / 2, topH - 10, cols[j], Math.floor((cell - 4) / 6.2), 'middle', 11, MAU.nhanTruc);
      colsBang.push({ key: 'c' + j, label: cols[j], num: true });
    }
    for (i = 0; i < rows.length; i++) {
      s += veNhanCat(0, topH + cell * i + cell / 2 + 4, rows[i].label, Math.floor(nameW / 6.6), null, 12, MAU.gray700);
      var d0 = { label: rows[i].label };
      for (j = 0; j < cols.length; j++) {
        var v = rows[i].values[j];
        var trong = (v === null || v === undefined || v !== v);
        var nh = trong ? -1 : nhomCua(v, moc);
        var mau = trong ? MAU.oTrong : THANG[nh];
        var x0 = nameW + cell * j + khe / 2, y0 = topH + cell * i + khe / 2, sz = cell - khe;
        s += '<rect x="' + round(x0) + '" y="' + round(y0) + '" width="' + round(sz) + '" height="' + round(sz) +
          '" rx="4" fill="' + mau + '"><title>' + esc(rows[i].label) + ' · ' + esc(cols[j]) + ': ' +
          (trong ? 'chưa có dữ liệu' : esc(fmt(v)) + (o.unit ? ' ' + esc(o.unit) : '')) + '</title></rect>';
        /* Nhãn nằm TRONG một vùng đã tô — ngoại lệ duy nhất được chọn màu theo
         * độ sáng của vùng. Đo trước: chữ không vừa ô thì bỏ, giá trị vẫn còn
         * trong bảng song sinh. */
        if (o.showValues !== false && !trong && sz >= 26 && rongChu(fmt(v), 11) <= sz - 8) {
          s += '<text class="num" x="' + round(x0 + sz / 2) + '" y="' + round(y0 + sz / 2 + 4) +
            '" text-anchor="middle" font-size="11" font-weight="700" fill="' + (nh === 3 ? MAU.trang : MAU.soTrenDau) + '">' +
            esc(fmt(v)) + '</text>';
        }
        d0['c' + j] = trong ? 'chưa có dữ liệu' : fmt(v);
      }
      hangBang.push(d0);
    }

    var svg = khungSvg(o, w, h, s, 'ths-heatmap');
    if (o.legend !== false) {
      var lg = '<div class="legend"><span class="lg-title">' + esc(o.legendTitle || 'Ít → nhiều') + '</span>';
      for (i = 0; i < THANG.length; i++) {
        var tu;
        if (!moc.length) tu = '—';
        else if (i === 0) tu = 'dưới ' + fmt(moc[0]);
        else if (i === THANG.length - 1) tu = 'từ ' + fmt(moc[moc.length - 1]);
        else tu = fmt(moc[i - 1]) + '–' + fmt(moc[i]);
        lg += '<span><span class="sw" style="background:' + THANG[i] + '"></span>' + esc(tu) + '</span>';
      }
      lg += '<span><span class="sw" style="background:' + MAU.oTrong + '"></span>chưa có dữ liệu</span></div>';
      svg += lg;
    }
    return kemBang(svg, o, { cols: colsBang, rows: hangBang });
  }

  /* =========================================================================
   * 10 · NỀN — bố cục, cảnh báo, trạng thái rỗng
   * ========================================================================= */

  /** smallMultiples — CÁCH BỐ CỤC, không phải một hình riêng.
   * Dùng khi quá trần chuỗi: mỗi chuỗi một khung con, CÙNG một thang, một màu. */
  function smallMultiples(o) {
    var it = o.items || [], i;
    var s = '<div class="small-multiples" style="grid-template-columns:repeat(' + (o.cols || 2) + ',minmax(0,1fr))">';
    for (i = 0; i < it.length; i++) {
      s += '<div class="sm-cell"><div class="chart-title">' + esc(it[i].title || '') + '</div>' +
        (it[i].sub ? '<div class="chart-sub">' + esc(it[i].sub) + '</div>' : '') + it[i].svg + '</div>';
    }
    return s + '</div>';
  }

  /**
   * banner — bảng cảnh báo dữ liệu. Khi một chỉ số không qua được cửa chốt thì
   * thành phần này THAY CHỖ biểu đồ và hiện số thô làm bằng.
   * Không đoán cơ chế: chỉ được viết cái mà một trường trả về nói đúng như vậy.
   * o = { muc:'chan'|'canh'|'tin', title, body, evidence:[{label,value}],
   *       tool, window, note, hoi }
   */
  function banner(o) {
    var muc = o.muc || 'canh';
    var s = '<div class="dq-banner dq-' + esc(muc) + '" role="note">';
    s += '<div class="dq-head"><span class="dq-tag">' + esc(o.tag || (muc === 'chan' ? 'Số liệu chưa dùng được' : 'Cần đối chiếu')) + '</span>' +
      '<h3>' + esc(o.title || '') + '</h3></div>';
    if (o.body) s += '<p class="dq-body">' + o.body + '</p>';
    if (o.evidence && o.evidence.length) {
      s += '<div class="dq-raw"><div class="dq-raw-t">Số thô làm bằng</div><dl>';
      for (var i = 0; i < o.evidence.length; i++) {
        s += '<div><dt>' + esc(o.evidence[i].label) + '</dt><dd class="num"' +
          (o.evidence[i].fig ? ' data-fig="' + esc(o.evidence[i].fig) + '"' : '') + '>' +
          (o.evidence[i].valueHtml || esc(o.evidence[i].value)) + '</dd></div>';
      }
      s += '</dl></div>';
    }
    if (o.tool || o.window) {
      s += '<div class="dq-src">Nguồn: <code>' + esc(o.tool || '—') + '</code>' +
        (o.window ? ' · khoảng số liệu: <b>' + esc(o.window) + '</b>' : '') + '</div>';
    }
    if (o.note) s += '<div class="dq-note">' + esc(o.note) + '</div>';
    if (o.hoi) s += '<div class="dq-ask">' + esc(o.hoi) + '</div>';
    return s + '</div>';
  }

  /**
   * emptyState — ô "chưa có dữ liệu". TRẠNG THÁI HẠNG NHẤT, không phải thông
   * báo lỗi. Một trang mà sáu mục đều ghi chưa có dữ liệu là một bản báo cáo
   * hợp lệ — nên ô này phải trông như một câu trả lời, không như một cái hỏng.
   * Luôn kèm: khoảng đã hỏi, công cụ đã gọi, và số thô nếu có.
   */
  function emptyState(o) {
    var s = '<div class="nodata" role="note"><div class="nd-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="' + MAU.gray400 + '" stroke-width="1.6" stroke-linecap="round">' +
      '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 14h8"/></svg></div>';
    s += '<div class="nd-body"><div class="nd-title">' + esc(o.title || 'Chưa có dữ liệu') + '</div>';
    if (o.reason) s += '<p class="nd-reason">' + o.reason + '</p>';
    if (o.raw && o.raw.length) {
      s += '<ul class="nd-raw">';
      for (var i = 0; i < o.raw.length; i++) {
        s += '<li>' + esc(o.raw[i].label) + ': <b class="num"' + (o.raw[i].fig ? ' data-fig="' + esc(o.raw[i].fig) + '"' : '') + '>' +
          (o.raw[i].valueHtml || esc(o.raw[i].value)) + '</b></li>';
      }
      s += '</ul>';
    }
    if (o.tool || o.window) {
      s += '<div class="nd-src">Đã gọi <code>' + esc(o.tool || '—') + '</code>' +
        (o.window ? ' · khoảng số liệu: <b>' + esc(o.window) + '</b>' : '') + '</div>';
    }
    if (o.note) s += '<div class="nd-note">' + esc(o.note) + '</div>';
    return s + '</div></div>';
  }

  /* =========================================================================
   * 11 · HOẠT HOÁ
   * Trạng thái cuối của mọi hình phải đạt được KHÔNG CẦN hoạt ảnh: máy tắt
   * chuyển động, WebView không hiểu transform-box, hoặc lệnh in — cả ba đi qua
   * hienHet(). Thẻ chưa cuộn tới mà in ra là trắng thì đó là lỗi nặng nhất.
   * ========================================================================= */

  var GIAM_CHUYEN_DONG = (function () {
    return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  })();

  /* WebView cũ không có transform-box:fill-box — scaleY(0) khi đó lấy gốc là cả
   * viewport nên cột bay đi mất. Không đỡ nổi thì thôi không hoạt hoá. */
  var CO_FILL_BOX = (function () {
    try { return !!(global.CSS && global.CSS.supports && global.CSS.supports('transform-box', 'fill-box')); }
    catch (e) { return false; }
  })();

  function moiPhanTu(root, chon, fn) {
    var ds = (root || global.document).querySelectorAll(chon);
    for (var i = 0; i < ds.length; i++) fn(ds[i], i);
  }

  /** hienHet — đưa mọi hình về trạng thái cuối, không chuyển động. */
  function hienHet(root) {
    moiPhanTu(root, '.ths-grow', function (el) { el.style.transition = 'none'; el.style.transform = 'scaleY(1)'; });
    moiPhanTu(root, '.ths-grow-x', function (el) { el.style.transition = 'none'; el.style.transform = 'scaleX(1)'; });
    moiPhanTu(root, '.ths-draw', function (el) { el.style.transition = 'none'; el.style.strokeDasharray = 'none'; el.style.strokeDashoffset = '0'; });
    moiPhanTu(root, '.ths-arc', function (el) {
      el.style.transition = 'none';
      el.setAttribute('stroke-dashoffset', el.getAttribute('data-off') || '0');
      el.setAttribute('stroke-dasharray', (el.getAttribute('data-arc') || '0') + ' ' + (el.getAttribute('data-rest') || '0'));
    });
    moiPhanTu(root, '[data-count]', function (el) {
      el.textContent = soVN(parseFloat(el.getAttribute('data-count')), parseInt(el.getAttribute('data-dec') || '0', 10));
    });
  }

  function noiSuy(p) { return 1 - Math.pow(1 - p, 3); }

  /** demLen — đếm số lên. Chỉ dùng cho số lớn (chữ số tỉ lệ), và chỉ khi máy
   * không yêu cầu giảm chuyển động. */
  function demLen(el, end, dur, dec) {
    if (GIAM_CHUYEN_DONG || !global.requestAnimationFrame) { el.textContent = soVN(end, dec || 0); return; }
    var t0 = null;
    global.requestAnimationFrame(function buoc(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / (dur || 900), 1);
      el.textContent = soVN(end * noiSuy(p), dec || 0);
      if (p < 1) global.requestAnimationFrame(buoc);
      else el.textContent = soVN(end, dec || 0);
    });
  }

  function batMotHinh(svg) {
    moiPhanTu(svg, '.ths-grow', function (el) { el.style.transform = 'scaleY(1)'; });
    moiPhanTu(svg, '.ths-grow-x', function (el) { el.style.transform = 'scaleX(1)'; });
    moiPhanTu(svg, '.ths-draw', function (el) {
      var len = 0;
      try { len = el.getTotalLength(); } catch (e) { len = 0; }
      if (!len) { el.style.strokeDasharray = 'none'; return; }
      var tre = el.style.transitionDelay || '0s';
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      global.requestAnimationFrame(function () {
        el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1) ' + tre;
        el.style.strokeDashoffset = '0';
      });
    });
    moiPhanTu(svg, '.ths-arc', function (el, i) {
      el.style.transition = 'stroke-dasharray .9s cubic-bezier(.2,.7,.2,1) ' + round(i * 0.1) + 's';
      el.setAttribute('stroke-dashoffset', el.getAttribute('data-off') || '0');
      global.requestAnimationFrame(function () {
        el.setAttribute('stroke-dasharray', (el.getAttribute('data-arc') || '0') + ' ' + (el.getAttribute('data-rest') || '0'));
      });
    });
    moiPhanTu(svg, '[data-count]', function (el) {
      demLen(el, parseFloat(el.getAttribute('data-count')), 950, parseInt(el.getAttribute('data-dec') || '0', 10));
    });
  }

  /** hoatHoa — nối hoạt ảnh cho mọi biểu đồ trong root khi cuộn tới. */
  function hoatHoa(root) {
    var doc = root || global.document;
    if (GIAM_CHUYEN_DONG || !CO_FILL_BOX || !global.IntersectionObserver) { hienHet(doc); return; }
    var io = new global.IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) {
        if (es[i].isIntersecting) { batMotHinh(es[i].target); io.unobserve(es[i].target); }
      }
    }, { threshold: 0.3 });
    moiPhanTu(doc, '.ths-chart', function (el) { io.observe(el); });
  }

  /** moBang — mở hết bảng song sinh. Trên giấy bảng phải IN RA, không gập lại;
   * CSS một mình không mở được <details>, nên phải gọi hàm này trước khi in. */
  function moBang(root) {
    moiPhanTu(root, 'details.data-table', function (el) { el.setAttribute('open', 'open'); });
  }

  /** chuanBiIn — một cửa duy nhất cho bản in: hiện hết, mở hết bảng. */
  function chuanBiIn(root) {
    var doc = root || global.document;
    hienHet(doc);
    moBang(doc);
  }

  /* =========================================================================
   * 12 · XUẤT CSV
   * BOM là bắt buộc. Không có ﻿ thì Excel trên Windows mở ra chữ Việt lỗi hết.
   * Tên file do người gọi truyền vào — trong này không có new Date().
   * ========================================================================= */

  function oCSV(v) {
    var s = (v === null || v === undefined) ? '' : String(v);
    return /[",;\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function chuoiCSV(hang) {
    var out = [], i, j;
    for (i = 0; i < hang.length; i++) {
      var d = [];
      for (j = 0; j < hang[i].length; j++) d.push(oCSV(hang[i][j]));
      out.push(d.join(','));
    }
    return out.join('\r\n');
  }

  function taiCSV(tenFile, hang) {
    var noiDung = '﻿' + chuoiCSV(hang);       /* BOM trước mọi thứ */
    var blob = new global.Blob([noiDung], { type: 'text/csv;charset=utf-8;' });
    var a = global.document.createElement('a');
    var url = global.URL.createObjectURL(blob);
    a.href = url;
    a.download = tenFile || 'so-lieu.csv';
    global.document.body.appendChild(a);
    a.click();
    global.document.body.removeChild(a);
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 1000);
  }

  /* =========================================================================
   * 13 · XUẤT RA NGOÀI
   * ========================================================================= */

  function veVao(host, markup) {
    var el = (typeof host === 'string') ? global.document.querySelector(host) : host;
    if (el) el.innerHTML = markup;
    return el;
  }

  global.THSViz = {
    /* màu */
    MAU: MAU, CHUOI: CHUOI, THANG: THANG, HAI_CHIEU: HAI_CHIEU, TRANG_THAI: TRANG_THAI,
    /* hình học (cổng từ svg.ts) */
    clamp: clamp, range: range, sum: sum, scaleLinear: scaleLinear, polar: polar,
    arcPath: arcPath, linePath: linePath, smoothPath: smoothPath, areaPath: areaPath,
    niceMax: niceMax, ticks: ticks, round: round, polygonPoints: polygonPoints,
    /* thang, trục, nhãn */
    thangDoc: thangDoc, thangNgang: thangNgang, axisY: axisY, axisX: axisX,
    catNhan: catNhan, rongChu: rongChu, chuGiai: chuGiai,
    /* số, chữ, sắp xếp */
    soVN: soVN, diem: diem, tiLe: tiLe, tiLePhan: tiLePhan, nguyen: nguyen,
    soSanhVN: soSanhVN, sapTheoTen: sapTheoTen, esc: esc,
    /* dạng số — gauge khai báo ở dưới, hàm khai báo kiểu này được nâng lên đầu phạm vi */
    statTile: statTile, kpiRow: kpiRow, heroFigure: heroFigure, meter: meter, gauge: gauge,
    /* so sánh */
    bars: bars, barsEmphasis: barsEmphasis, columns: columns, histogram: histogram,
    dotPlot: dotPlot, dumbbell: dumbbell, bullet: bullet,
    /* xu hướng */
    lineChart: lineChart, areaChart: areaChart, sparkline: sparkline,
    /* phần trên tổng */
    stackedBar: stackedBar, donut: donut, divergingStacked: divergingStacked,
    /* lệch và phân bố */
    divergingBar: divergingBar, heatmap: heatmap,
    /* nền */
    bang: bang, boBang: boBang, tableView: tableView, smallMultiples: smallMultiples,
    banner: banner, emptyState: emptyState, vanDefs: vanDefs,
    /* vá vào trang */
    veVao: veVao, hoatHoa: hoatHoa, hienHet: hienHet, demLen: demLen,
    moBang: moBang, chuanBiIn: chuanBiIn,
    /* csv */
    chuoiCSV: chuoiCSV, taiCSV: taiCSV,
    giamChuyenDong: GIAM_CHUYEN_DONG
  };

  /**
   * gauge — đồng hồ cung 270°.
   * Mẹo pathLength="100": strokeDasharray thành phần trăm viết thẳng, khỏi tính
   * chu vi bằng tay và khỏi lệch khi đổi bán kính. Cung 270° = 75% chu vi.
   * Quay riêng NHÓM cung -135°, KHÔNG quay cả <svg>: quay cả svg thì con số ở
   * giữa cũng nằm nghiêng theo.
   * Dùng khi một chỉ số cần đọc như mặt đồng hồ; ngoài ra `meter` gọn hơn.
   */
  function gauge(o) {
    var max = (o.max === undefined || o.max === null) ? 100 : o.max;
    var v = clamp(o.value || 0, 0, max);
    var frac = max ? v / max : 0;
    var size = o.size || 210, cx = size / 2, cy = size / 2 + 8;
    var r = o.r || 78, sw = o.thickness || 16;
    var mau = o.mau || MAU.brand600;
    var fmt = o.fmt || function (x) { return tiLePhan(x, (o.dec === undefined) ? 1 : o.dec); };
    var s = '<g transform="rotate(-135 ' + cx + ' ' + cy + ')">' +
      '<circle r="' + r + '" cx="' + cx + '" cy="' + cy + '" fill="none" stroke="' + (o.rang || MAU.brand100) +
      '" stroke-width="' + sw + '" stroke-linecap="round" pathLength="100" stroke-dasharray="75 100"/>' +
      '<circle class="ths-arc" r="' + r + '" cx="' + cx + '" cy="' + cy + '" fill="none" stroke="' + mau +
      '" stroke-width="' + sw + '" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100"' +
      ' data-arc="' + round(75 * frac) + '" data-rest="100"/></g>';

    /* Số của đồng hồ: KHÔNG class="num" — số lớn đứng một mình dùng chữ số tỉ lệ. */
    s += '<text x="' + cx + '" y="' + (cy + 2) + '" text-anchor="middle" font-size="30" font-weight="800" fill="' +
      MAU.soTrenDau + '">' + esc(fmt(v)) + '</text>';
    if (o.centerLabel) {
      s += '<text x="' + cx + '" y="' + (cy + 24) + '" text-anchor="middle" font-size="12" fill="' + MAU.mucNhat + '">' +
        esc(o.centerLabel) + '</text>';
    }
    /* Hai đầu cung, đặt đúng chỗ cung bắt đầu và kết thúc. */
    s += '<text x="' + round(cx - r * 0.72) + '" y="' + round(cy + r * 0.78) + '" text-anchor="middle" font-size="11" fill="' +
      MAU.nhanTruc + '">' + esc(fmt(0)) + '</text>';
    s += '<text x="' + round(cx + r * 0.72) + '" y="' + round(cy + r * 0.78) + '" text-anchor="middle" font-size="11" fill="' +
      MAU.nhanTruc + '">' + esc(fmt(max)) + '</text>';

    return kemBang(khungSvg(o, size, size, s, 'ths-gauge', o.maxWidth || 240), o, {
      cols: [{ key: 'label', label: 'Chỉ số' }, { key: 'value', label: 'Giá trị', num: true }, { key: 'max', label: 'Mốc tối đa', num: true }],
      rows: [{ label: o.title || o.ariaLabel || 'Chỉ số', value: fmt(v), max: fmt(max) }]
    });
  }
})(typeof window !== 'undefined' ? window : this);
