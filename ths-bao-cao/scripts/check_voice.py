#!/usr/bin/env python3
"""Máy dò giọng cho bản báo cáo Trường học số.

Bắt phần mà máy bắt được trong references/05-giong-humanized.md muc 8.
Phần còn lại là việc của lăng kính giọng (agents/qa-02-giong.md) — script này
không thay nó, chỉ chặn những lỗi không cần người cũng thấy.

Dùng:
    python check_voice.py <file.md | file.html> [...]
    python check_voice.py --render <file.html> [...]

    --render  Dung trang bang Chrome headless roi soi DOM sau khi JS chay.
              BAT BUOC voi trang bao cao that: trang sinh phan lon van xuoi luc
              chay, nen soi HTML tinh la soi dung cai phan khong can soi. Do
              that trong bo thu dau-cuoi: 53 doan dam va ba con so dang lo bi boi
              dam deu LOT vi chung do JS dung ra.

Ma tra ve:
    0  không có lỗi chặn
    1  có lỗi chặn — sửa rồi mới giao
    2  sai cách dùng, hoặc không đọc được file
"""

import sys
import os
import re

try:
    from render_dom import dung_dom
except Exception:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    try:
        from render_dom import dung_dom
    except Exception:
        dung_dom = None

# stdout tren Windows la cp1252 -> in tieng Viet la vo. Bat buoc utf-8.
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

# ---------------------------------------------------------------- tien ich

VN_CHARS = set("ăâđêôơưĂÂĐÊÔƠƯáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệ"
               "íìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ"
               "ÁÀẢÃẠẤẦẨẪẬẮẰẲẴẶÉÈẺẼẹẾỀỂỄỆÍÌỈĨỊ"
               "ÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ")

EMOJI_RANGES = [
    (0x1F300, 0x1FAFF), (0x1F000, 0x1F2FF), (0x2600, 0x27BF),
    (0x2B00, 0x2BFF), (0x1F1E6, 0x1F1FF), (0xFE0F, 0xFE0F),
]

# Tu tieng Anh hay gap nhat, du de nhan ra mot cau tieng Anh.
EN_WORDS = set("""the a an and or but if then this that these those is are was were be been
being have has had do does did will would can could should may might must i you he she it we they
for to of in on at by with from as not no yes here there what which who when where why how
report data check found changes answer my your our their real before after because so than
first second next last all any each every some more most other another same such only just
about above below over under again once during while both few many much own too very""".split())

# Cum bi chan cua humanized.
BLOCKED_PHRASES = [
    "ưu tiên tối ưu", "điểm yếu rõ", "cần hành động",
    "ai phân tích", "ai đánh giá", "hệ thống ai cho thấy",
]

# Tieng cua MAY ve viec doc du lieu, lot ra than bai. Vong 4: hieu truong doc
# "trong 35 lop bo mon khoi 6 den khoi 9 da doc" va hieu thanh LOP DA DOC BAI.
# Chu "doc" o day la viec cua may, thuoc muc "Nguon so" o chan trang.
# Cach viet dung: "35 lop bo mon xem duoc tren he thong".
TIENG_MAY_DOC = [
    (r"(?i)đã đọc(?=\s*[,.;:)”\"]|\s+(?:và|nhưng|nên|thì|là|trong)\b|\s*$)",
     "'đã đọc' đứng cuối mệnh đề — người đọc hiểu thành lớp/em đã đọc bài. "
     "Viết 'xem được trên hệ thống' hoặc 'có trong sổ'."),
    (r"(?i)(khoảng|cửa sổ|phạm vi|vùng)\s+đọc\b",
     "'khoảng đọc' là tiếng của máy. Viết thẳng ngày: 'từ 01/09 đến 14/09'."),
    (r"(?i)\bđọc được\s+(?:là\s+)?\d",
     "'đọc được N' là tiếng của máy. Viết 'có N ... trong sổ'."),
]

CERTAINTY = ["chắc chắn", "hoàn toàn", "tuyệt đối", "rõ ràng"]

QUANTIFIERS = ["phần lớn", "hầu hết", "gần như", "đa số", "nhiều em", "phần nhiều"]

CAUSAL = ["nghĩa là", "là vì", "là do", "bởi vì", "cho nên là"]
CAUSAL_HEDGE = ["có thể", "phỏng đoán", "chưa rõ", "cần xác nhận",
                "cần kiểm tra", "có dấu hiệu", "nhờ quản trị"]

# Cum PHU DINH mot quan he nhan qua — do chinh la thu luat nay muon, khong phai
# thu no cam. "Số 0 đọc từ lớp chủ nhiệm KHÔNG CÓ NGHĨA LÀ lớp không có nhiệm vụ"
# tung bi bao nham la 'nhan qua noi thang'.
CAUSAL_PHU_DINH = [
    "không có nghĩa là", "không nghĩa là", "chưa có nghĩa là", "không hẳn là",
    "không phải là vì", "chưa chắc là do", "không đồng nghĩa",
]

ABSOLUTE_NEG = [
    r"tuyệt đối trống", r"tất cả đều không", r"không em nào",
    r"không có\s+\S+\s+nào", r"chưa có\s+\S+\s+nào\s+cả", r"không lớp nào",
]

LINE_OPENERS = ["cần", "ưu tiên", "khuyến nghị"]

NEXT_STEP = ["nên", "có thể", "phù hợp để", "để ý thêm"]

ALARM_UNITS = ["%", "lượt", "vắng", "không đạt", "quá hạn", "trượt", "dưới"]

HEADING_LABELS = ["tổng quan", "phân tích", "đánh giá", "thống kê", "kết quả chung"]


def co_dau_viet(s):
    return any(ch in VN_CHARS for ch in s)


def co_emoji(s):
    for ch in s:
        cp = ord(ch)
        for lo, hi in EMOJI_RANGES:
            if lo <= cp <= hi:
                return ch
    return None


def boc_the_html(text):
    """Bo the, script, style — chi giu phan chu nguoi doc thay."""
    text = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", text)
    text = re.sub(r"(?s)<!--.*?-->", " ", text)
    text = re.sub(r"(?s)<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    return text


def bo_khoi_ma(text):
    """Bo khoi ma trong markdown — ma khong phai van ban nguoi doc."""
    text = re.sub(r"(?s)```.*?```", "\n", text)
    text = re.sub(r"`[^`\n]+`", " ", text)
    return text


def la_dong_noi_dung(dong):
    """Dong co noi dung nhan xet: khong phai tieu de, bang, dau phan cach."""
    d = dong.strip()
    if not d:
        return False
    if d.startswith("#") or d.startswith("|") or d.startswith("---"):
        return False
    if re.match(r"^[\s\-=_*]+$", d):
        return False
    return len(d.split()) >= 5


# ---------------------------------------------------------------- phep do

def do_mot_file(path):
    """Tra ve (chan[], nhac[])."""
    chan, nhac = [], []

    with open(path, "r", encoding="utf-8", errors="replace") as f:
        raw = f.read()

    la_html = path.lower().endswith((".html", ".htm"))
    van = boc_the_html(raw) if la_html else bo_khoi_ma(raw)
    dong_goc = raw.splitlines()

    if la_html:
        # DOM da render nam tren vai dong khong lo, nen cat theo DONG la vo nghia:
        # may bat mot chu o dau trang roi trich ra mot doan o cuoi trang. Do that:
        # mot ban bao cao bi bao 'nhan qua noi thang' voi bang chung la mot danh
        # sach ma lop. Cat theo CAU thi bang chung moi tro lai dung cho.
        dong_van = [c for c in re.split(r"(?<=[.!?])\s+|\n", van) if c.strip()]
    else:
        dong_van = van.splitlines()

    def ghi(bucket, so_dong, ma, thong_diep, trich=""):
        bucket.append({
            "line": so_dong, "code": ma, "msg": thong_diep,
            "quote": trich.strip()[:160],
        })

    # --- emoji: quet toan file, ke ca trong the ---
    for i, d in enumerate(dong_goc, 1):
        e = co_emoji(d)
        if e:
            ghi(chan, i, "EMOJI",
                "Có biểu tượng cảm xúc %r. Trạng thái viết bằng chữ, không bằng emoji." % e, d)

    # --- boi dam ---
    # Luat goc cua humanized ("no excessive bolding") viet cho bao cao dang chu.
    # Tren mot trang HTML thi <b> con la thiet bi in an trong nhan so lieu — mot
    # <b>4,5%</b> trong o chi so KHONG lam trang gao len. Nen do theo NGU CANH
    # cho dam, khong do theo so luong tho: dem tho thi 54 doan dam cua mot trang
    # sach cung bi chan, va do la bao dong gia.
    #
    # Y dinh thuc cua luat: dung boi dam ca cau, va dung khuech dai con so xau.

    # DA THU HAI CACH DE TU DONG XET "con so dang lo bi boi dam", ca hai deu sai:
    #   - dem tho moi doan dam  -> chan ca mot trang sach (54 doan, deu la nhan so lieu)
    #   - xet the bao quanh     -> chan 14 cho tren cung trang sach, vi nhan so lieu
    #                              nam trong <div class="note"> chu khong trong <td>
    # May khong phan biet duoc "<b>4,5%</b> trong o chi so" (khong sao) voi
    # "<b>21</b> tren <b>22</b> em trong loi van" (chan). Nen KHONG doan o day.
    # Viec do giao cho agents/qa-02-giong.md muc 2.5 — o do co mat doc.
    #
    # Script chi giu nhung phep may lam DUNG:

    if la_html:
        cac_dam = [re.sub(r"(?s)<[^>]+>", "", m.group(1)).strip()
                   for m in re.finditer(r"(?is)<(?:b|strong)\b[^>]*>(.*?)</(?:b|strong)>", raw)]
    else:
        cac_dam = [m.group(1) for m in re.finditer(r"\*\*([^*\n]+)\*\*", van)]

    # 1 · Boi dam ca cau: do duoc chac chan, va luon la loi.
    #     Mot day so trong o bang ("33,1 · 36,4 · 35,0 · 39,8 · 41,3") bi .split()
    #     dem thanh 9 "tu" — nen chi tinh la cau khi co du tu THAT.
    for noi in cac_dam:
        tu_that = [t for t in re.findall(r"[^\W\d_]{3,}", noi, re.UNICODE)]
        if len(tu_that) > 6:
            ghi(chan, 0, "DAM_CA_CAU",
                "Bôi đậm một đoạn %d từ. Đậm dùng cho tiêu đề mục, không dùng cho cả câu." % len(tu_that),
                noi)

    # 2 · Tong so doan dam: la tin hieu, khong tu la loi. Lang kinh xet.
    nguong = 40 if la_html else 3
    if len(cac_dam) > nguong:
        ghi(nhac, 0, "DAM_NHIEU",
            "Có %d đoạn bôi đậm (ngưỡng nhắc: %d). Máy không xét được đoạn nào là nhãn số liệu và đoạn nào là nhấn mạnh trong lời văn — lăng kính giọng mục 2.5 phải đọc và xét, riêng con số đáng lo thì không bao giờ được nhấn."
            % (len(cac_dam), nguong))

    # --- cau tieng Anh ---
    for i, d in enumerate(dong_van, 1):
        for cau in re.split(r"(?<=[.!?])\s+", d):
            c = cau.strip()
            if len(c.split()) < 4 or co_dau_viet(c):
                continue
            tu = re.findall(r"[A-Za-z']+", c.lower())
            if len(tu) >= 4 and sum(1 for t in tu if t in EN_WORDS) >= 4:
                ghi(chan, i, "TIENG_ANH",
                    "Câu tiếng Anh trong bản báo cáo tiếng Việt.", c)

    # --- cum bi chan / tu chac chan / phu dinh tuyet doi ---
    for i, d in enumerate(dong_van, 1):
        thap = d.lower()
        for p in BLOCKED_PHRASES:
            if p in thap:
                ghi(chan, i, "CUM_BI_CHAN",
                    "Cụm %r nằm trong danh sách chặn của humanized." % p, d)
        for pat, loi in TIENG_MAY_DOC:
            if re.search(pat, d):
                ghi(chan, i, "TIENG_MAY_DOC", loi, d)
        for w in CERTAINTY:
            if w in thap:
                ghi(chan, i, "TU_CHAC_CHAN",
                    "Từ %r dùng cho suy luận từ dữ liệu thô. Thay bằng 'có dấu hiệu' hoặc 'cần kiểm tra lại'." % w, d)
        for pat in ABSOLUTE_NEG:
            m = re.search(pat, thap)
            if m:
                ghi(chan, i, "PHU_DINH_TUYET_DOI",
                    "Phủ định tuyệt đối %r từ một lần đọc có cửa sổ. Dạng được phép: 'trong khoảng <từ>–<đến>, tài khoản đang truy cập không thấy ... nào'." % m.group(0), d)

    # --- tu chi luong khong co bang chung dem ---
    for i, d in enumerate(dong_van, 1):
        thap = d.lower()
        for q in QUANTIFIERS:
            for m in re.finditer(re.escape(q), thap):
                sau = d[m.end():m.end() + 60]
                if not re.search(r"\d+\s*(/|trên|trong)\s*\d+", sau):
                    ghi(chan, i, "CHI_LUONG_KHONG_SO",
                        "Từ chỉ lượng %r không có bằng chứng đếm dạng x/y ngay sau nó." % q, d)
                    break

    # --- nhan qua noi thang ---
    for i, d in enumerate(dong_van, 1):
        thap = d.lower()
        if any(pd in thap for pd in CAUSAL_PHU_DINH):
            continue
        for c in CAUSAL:
            if c in thap and not any(h in thap for h in CAUSAL_HEDGE):
                ghi(chan, i, "NHAN_QUA_NOI_THANG",
                    "Câu nhân quả %r không có trường dữ liệu chống lưng và không được rào. Viết 'chưa rõ nguyên nhân' hoặc gắn nhãn phỏng đoán." % c, d)
                break

    # --- yeu / kem noi ve hoc sinh ---
    for i, d in enumerate(dong_van, 1):
        thap = d.lower()
        for w in ["yếu", "kém"]:
            for m in re.finditer(r"\b" + w + r"\b", thap):
                canh = thap[max(0, m.start() - 40):m.end() + 40]
                if any(k in canh for k in ["em ", "học sinh", "lớp ", "các em"]):
                    if '"' in canh or "“" in canh or "khoảng điểm" in canh:
                        continue
                    ghi(chan, i, "YEU_KEM",
                        "Từ %r nói về học sinh. Dùng 'cần theo dõi' hoặc 'cần hỗ trợ'." % w, d)
                    break

    # --- dong mo bang Can / Uu tien / Khuyen nghi ---
    for i, d in enumerate(dong_van, 1):
        sach = re.sub(r"^[\s\-*+#>\d.)\|]+", "", d).strip().lower()
        for op in LINE_OPENERS:
            if sach.startswith(op + " ") or sach.startswith(op + ":"):
                ghi(chan, i, "MO_DAU_CAN",
                    "Dòng mở đầu bằng %r. Trộn 'nên', 'có thể', 'phù hợp để', 'để ý thêm', hoặc mở thẳng bằng sự việc." % op, d)
                break

    # --- nhac: ca bang mot khuon ---
    dong_nx = [d for d in dong_van if la_dong_noi_dung(d)]
    if len(dong_nx) >= 5:
        dau = {}
        for d in dong_nx:
            sach = re.sub(r"^[\s\-*+#>\d.)\|]+", "", d).strip().lower()
            t = sach.split()[0] if sach.split() else ""
            dau[t] = dau.get(t, 0) + 1
        pho_bien, so = max(dau.items(), key=lambda kv: kv[1])
        if so / len(dong_nx) > 0.6:
            ghi(nhac, 0, "MOT_KHUON",
                "%d trên %d dòng nội dung mở đầu bằng %r. Người đọc bỏ qua từ dòng thứ ba."
                % (so, len(dong_nx), pho_bien))

    # --- nhac: thieu nhip ba, cau dai ---
    # Doan dan dau trang (truoc tieu de '##' dau tien) khong can nhip viec-lam-tiep —
    # no gioi thieu tuan co gi, khong phai mot dong nhan xet.
    da_qua_muc_dau = False
    for i, d in enumerate(dong_van, 1):
        if re.match(r"^\s*#{2,3}\s+", d):
            da_qua_muc_dau = True
            continue
        if not la_dong_noi_dung(d):
            continue
        thap = d.lower()
        if da_qua_muc_dau and len(d.split()) > 14 and not any(n in thap for n in NEXT_STEP):
            ghi(nhac, i, "THIEU_NHIP_BA",
                "Dòng nhận xét không có nhịp việc-làm-tiếp ('nên', 'có thể', 'phù hợp để', 'để ý thêm').", d)
        # Do theo TUNG CAU, khong theo ca dong: mot dong ba nhip la ba cau, dai la binh thuong.
        for cau in re.split(r"(?<=[.!?])\s+", d):
            if len(cau.split()) > 45:
                ghi(nhac, i, "CAU_DAI", "Một câu dài %d từ." % len(cau.split()), cau)

    # --- nhac: tieu de dang nhan ---
    for i, d in enumerate(dong_van, 1):
        m = re.match(r"^\s*#{2,3}\s+(.+)$", d)
        if m:
            tieu_de = m.group(1).strip()
            thap = tieu_de.lower()
            if len(tieu_de.split()) < 4 or any(thap.startswith(l) for l in HEADING_LABELS):
                ghi(nhac, i, "TIEU_DE_NHAN",
                    "Tiêu đề mục đang là nhãn, không phải câu nói ra điều người đọc sẽ thấy.", tieu_de)

    # --- dong dau tien phai la tieu de markdown ---
    if not la_html:
        for d in dong_goc:
            if d.strip():
                if not d.lstrip().startswith("#"):
                    ghi(chan, 1, "MO_DAU_KHONG_MARKDOWN",
                        "Dòng đầu không phải tiêu đề '#'. Nếu 500 ký tự đầu không có markdown thì cả tin nhắn mất định dạng.", d)
                break

    return chan, nhac


# ---------------------------------------------------------------- chay

def main(argv):
    args = [a for a in argv[1:] if not a.startswith("--")]
    render = "--render" in argv[1:]
    if not args:
        print(__doc__)
        return 2

    if render and dung_dom is None:
        print("--render can scripts/render_dom.py nam canh script nay")
        return 2

    tong_chan = tong_nhac = 0
    for path in args:
        if not os.path.isfile(path):
            print("KHONG DOC DUOC: %s" % path)
            return 2

        soi_path, ghi_chu_render = path, None
        if render:
            d, ghi_chu_render = dung_dom(path)
            if d:
                soi_path = d
            else:
                # Khong lang le roi ve HTML tinh — noi ra, vi luc do phan JS dung
                # ra khong duoc soi va nguoi doc ket qua phai biet dieu do.
                tong_chan += 1
                print("\n  KHONG DUNG DUOC TRANG: %s" % ghi_chu_render)

        chan, nhac = do_mot_file(soi_path)
        tong_chan += len(chan)
        tong_nhac += len(nhac)

        print("\n" + "=" * 72)
        print("GIỌNG · %s" % path)
        if ghi_chu_render:
            print("  render: %s" % ghi_chu_render)
        elif path.lower().endswith((".html", ".htm")):
            print("  render: KHÔNG — đang soi HTML tĩnh. Trang báo cáo sinh phần lớn")
            print("          văn xuôi lúc chạy, nên chạy lại với --render.")
        print("=" * 72)

        if not chan and not nhac:
            print("  Không có lỗi nào.")
            continue

        if chan:
            print("\n  CHẶN — sửa rồi mới giao (%d)" % len(chan))
            for f in chan:
                vt = (("câu %d" % f["line"]) if path.lower().endswith((".html",".htm")) else ("dòng %d" % f["line"])) if f["line"] else "cả trang"
                print("    [%s] %s — %s" % (f["code"], vt, f["msg"]))
                if f["quote"]:
                    print("        > %s" % f["quote"])
        if nhac:
            print("\n  NHẮC — người viết tự quyết (%d)" % len(nhac))
            for f in nhac:
                vt = (("câu %d" % f["line"]) if path.lower().endswith((".html",".htm")) else ("dòng %d" % f["line"])) if f["line"] else "cả trang"
                print("    [%s] %s — %s" % (f["code"], vt, f["msg"]))
                if f["quote"]:
                    print("        > %s" % f["quote"])

    print("\n" + "-" * 72)
    print("Tổng: %d chặn, %d nhắc" % (tong_chan, tong_nhac))
    print("Kết luận: %s" % ("KHÔNG GIAO — còn lỗi chặn" if tong_chan else "Giọng đạt"))
    return 1 if tong_chan else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
