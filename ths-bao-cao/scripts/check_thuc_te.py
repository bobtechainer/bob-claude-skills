#!/usr/bin/env python3
"""Doi chieu ban bao cao voi THE GIOI THAT cua nguoi doc.

May thu ba trong bo. Hai may kia do:
  check_sidecar  — con so co truy duoc nguon khong
  check_voice    — giong co phai giong giao vien khong
  check_useful   — trang co noi duoc gi khong
May nay do mot thu khac han: trang co noi DUNG ve the gioi cua nguoi doc khong.

Vi sao co may nay: sau nguoi doc doc lap cham sau ban bao cao da qua SACH ca ba
may kia, va ca sau deu noi KHONG DUNG DUOC. Khong ban nao bia so. Chung sai o
cho khac — bay mau ghi o references/08-su-that-voi-nguoi-doc.md.

DU LIEU O BAN PHAT TRIEN CO NHIEU CHO VO LY — DO LA BINH THUONG, khong phai
loi phai chan. Nen may nay chia lam hai:

  CHAN  — loi cua BAI VIET, du lieu dep hay xau cung van sai:
          · so 0 khong noi ro la 0 cua cai gi
          · hai con so cho cung mot thu

  NHAC  — tinh chat cua du lieu phat trien, chi nhac de viet cho kheo:
          · ten dang du lieu thu       -> dem vao tong nhung dung goi ten
          · khoi lech cap hoc          -> khong phai loi cua bao cao
          · khoang do cham nghi he     -> noi mot cau la du

Ba mau con lai can doc hieu nen thuoc ve agents/qa-04-nguoi-doc.md:
  - giao viec dua tren thu vua noi la khong tin duoc
  - suy viec-lam-tiep tu mot cho trong
  - giao viec nguoi doc khong lam duoc

Dung:
    python check_thuc_te.py --render <file.html> [...]
    python check_thuc_te.py <file.md | file.html> [...]

Ma tra ve:
    0  dat
    1  truot — sua roi moi giao
    2  sai cach dung, hoac khong doc duoc file
"""

import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    from render_dom import dung_dom
except Exception:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    try:
        from render_dom import dung_dom
    except Exception:
        dung_dom = None

# ------------------------------------------------------------------ cau hinh

# Cap hoc -> khoi hop le. Nguon: he thong giao duc pho thong Viet Nam.
CAP_HOC = [
    (r"\bTHCS\b|trung học cơ sở",        set(range(6, 10)),  "THCS"),
    (r"\bTHPT\b|trung học phổ thông",    set(range(10, 13)), "THPT"),
    (r"\btiểu học\b",                    set(range(1, 6)),   "Tiểu học"),
]

# Ten co dang du lieu thu. Khong bao gio duoc neu ten ra cho nguoi doc thay.
DANG_DU_LIEU_THU = [
    (r"\btest\b", "test"),
    (r"\bTest\b", "Test"),
    (r"\bdemo\b", "demo"),
    (r"\bQA\b", "QA"),
    (r"\bstaging\b", "staging"),
    (r"\be2e\b", "e2e"),
    (r"\bsample\b", "sample"),
    (r"\bxxx+\b", "xxx"),
    (r"\babc\b", "abc"),
    (r"\basdf\w*", "asdf"),
    (r"\b(?:làm đi|lam di)\b", "tiếng lóng"),
    # Chuoi 4+ phu am lien nhau khong doc duoc, vi du "ddcd", "dfgdfg", "tetttt"
    (r"(?<![./\w-])\b(?!html|xhtml|css|js|json|png|jpg|svg|pdf|xlsx|xls|csv|txt|md|sql|http|https|www)"
     r"[bcdfghjklmnpqrstvwxz]{4,}\b(?![./\w-])", "chuỗi phụ âm không đọc được"),
    # Chuoi chi toan chu so lam TEN, vi du bai ten "123"
    (r"[\"“”']\s*\d{1,4}\s*[\"“”']", "tên chỉ là chữ số"),
]

# Thang nghi he o Viet Nam: 6, 7, va nua dau thang 8.
def cham_nghi_he(m, d):
    if m in (6, 7):
        return True
    if m == 8 and d <= 15:
        return True
    return False

# CAU DAN THAY VI SUA. Vong 6 sinh ra han mot loai loi moi, do chinh ban sua
# cua vong 5 gay ra: bat khai mauSo lam nguoi viet NHAN RA hai con so de lan
# nhau, roi ho xu ly bang cach... viet mot cau dan nguoi doc dung lan.
#   · "Con so 21 hien o hai cho tren trang voi hai nghia khac nhau, nen doc ky"
#   · "Hai con so 18 vua neu dem hai thu khac nhau"
#   · "Hai cot dem hai thu khac nhau va khong cong duoc voi nhau"
# Giao vien bo mon noi thang: "Da biet la de nham thi doi cach goi di, dung bat
# nguoi doc ganh." Dung — cau dan la day viec sang nguoi doc, khong phai sua loi.
# Cach dung: DOI TEN mot trong hai, hoac bo mot cai di.
CAU_DAN_THAY_VI_SUA = [
    (r"(?i)hai\s+con\s+số\s+\d+[^.]{0,70}?(khác\s+nhau|hai\s+thứ|hai\s+nhóm|hai\s+nghĩa)",
     "hai con số trùng giá trị được dặn là khác nghĩa"),
    (r"(?i)(hiện|nằm|xuất hiện)\s+ở\s+hai\s+chỗ[^.]{0,70}?(khác\s+nhau|hai\s+nghĩa)",
     "một con số hiện hai chỗ với hai nghĩa"),
    (r"(?i)(hai|ba)\s+(cột|con\s+số|nhóm|dòng)[^.]{0,40}?đếm\s+(hai|ba)\s+thứ\s+khác\s+nhau",
     "hai cột được dặn là đếm hai thứ khác nhau"),
    (r"(?i)(đừng|không\s+nên|chớ)\s+(cộng|gộp)\s+(chúng|hai|nó|các\s+con\s+số)",
     "dặn người đọc đừng cộng hai con số"),
    (r"(?i)không\s+cộng\s+(được\s+)?(với\s+nhau|vào\s+nhau)",
     "dặn hai con số không cộng được với nhau"),
    (r"(?i)đọc\s+kỹ\s+chỗ\s+này",
     "dặn người đọc đọc kỹ một chỗ dễ nhầm"),
]

NOI_VE_NGHI = ["nghỉ hè", "kỳ nghỉ", "trong hè", "mùa hè", "nghỉ lễ", "chưa vào năm học", "trước khai giảng"]

# Tu noi ve XU HUONG. Rut xu huong qua mot khoang co nghi he la sai — vong 4:
# to truong doc "nhip giao bai dang thua dan: 3 bai thang 7, 1 bai thang 8" va
# noi "toi ma doc cau nay len trong hop to thi toi dang che mot co giao vi co ay
# khong giao bai trong he. Oan."
TU_XU_HUONG = [
    "thưa dần", "giảm dần", "tăng dần", "ít dần", "nhiều dần", "đều dần",
    "đang giảm", "đang tăng", "xu hướng giảm", "xu hướng tăng",
    "đi xuống", "đi lên", "sụt giảm", "chững lại", "nhịp giảm", "nhịp tăng",
]

# Thang he viet bang chu, de bat cau co ca tu xu huong lan thang he.
THANG_HE_CHU = ["tháng 6", "tháng 7", "tháng 8", "tháng sáu", "tháng bảy", "tháng tám"]

# Cum noi ro so 0 la 0 gi.
GIAI_THICH_SO_0 = [
    "chưa chấm", "chưa có bài nào được chấm", "chưa được chấm", "chưa có điểm",
    "chưa rõ đã chấm", "hệ thống chưa trả về điểm", "không phải điểm thật",
]


def boc_van(raw, la_html):
    if not la_html:
        s = re.sub(r"(?s)```.*?```", " ", raw)
        return re.sub(r"`[^`\n]+`", " ", s)
    s = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", raw)
    s = re.sub(r"(?s)<!--.*?-->", " ", s)
    return re.sub(r"(?s)<[^>]+>", " ", s)


def tach_cau(van):
    van = re.sub(r"\s+", " ", van)
    return [c.strip() for c in re.split(r"(?<=[.!?])\s+", van) if c.strip()]


def do_mot_file(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        raw = f.read()
    la_html = path.lower().endswith((".html", ".htm"))
    van = boc_van(raw, la_html)
    cau = tach_cau(van)
    chan, nhac = [], []

    def ghi(b, ma, msg, trich=""):
        b.append({"code": ma, "msg": msg, "quote": trich.strip()[:170]})

    # --- 1. so 0 tro trong ngu canh DIEM SO ---
    # Hai bay da gap:
    #  · "sổ ĐIỂM DANH ghi 0 lượt có mặt" — chuyen cham, khong phai diem so
    #  · chu "điểm" o dau cau roi mot so 0 khong lien quan o cuoi cau
    #  · nhanh "0 điểm" tran: tren DOM da render, khoang trang bi go nen mot
    #    nhan truc "0" va chu "điểm" o hai the khac nhau dinh vao nhau. Da bo.
    # Nen chi bat khi so 0 dung DUNG canh mot cum chi diem so.
    CUM_DIEM = r"(?:điểm\s+trung\s+bình|điểm\s+số|trung\s+bình\s+điểm|đạt\s+điểm|được\s+điểm)"
    for c in cau:
        thap = c.lower()
        for m0 in re.finditer(
                CUM_DIEM + r"[^.;:]{0,28}?[:\s]\s*0(?![\d,.%])", thap):
            doan = m0.group(0)
            truoc = thap[max(0, m0.start() - 24): m0.start()]
            if "điểm danh" in doan or "điểm danh" in truoc:
                continue
            canh = thap[max(0, m0.start() - 80): m0.end() + 130]
            if any(g in canh for g in GIAI_THICH_SO_0):
                continue
            ghi(chan, "SO_0_TRO",
                "Số 0 đứng trong ngữ cảnh điểm số mà không nói rõ là 0 của cái gì. "
                "Người đọc sẽ hiểu là bị 0 điểm — đây là con số ở lại trong đầu họ.",
                c)
            break

    # --- 2. ten dang du lieu thu ---
    for c in cau:
        for pat, ten in DANG_DU_LIEU_THU:
            m = re.search(pat, c)
            if m:
                ghi(nhac, "DU_LIEU_THU",
                    "Tên dạng dữ liệu thử (%s) hiện trong phần người đọc thấy: %r. "
                    "Đếm riêng và đừng nêu tên — viết 'n mục chưa đặt tên rõ'."
                    % (ten, m.group(0)), c)
                break

    # --- 3. khoi lech cap hoc ---
    khoi_thay = set()
    for m in re.finditer(r"(?i)\b(?:lớp|khối)\s*(\d{1,2})\b", van):
        k = int(m.group(1))
        if 1 <= k <= 12:
            khoi_thay.add(k)
    # Ten lop dang "12A11", "10A1" cung tinh
    for m in re.finditer(r"\b(1[0-2]|[1-9])[A-Za-zÀ-ỹ]\d*\b", van):
        k = int(m.group(1))
        if 1 <= k <= 12:
            khoi_thay.add(k)
    for pat, hop_le, ten in CAP_HOC:
        if re.search(pat, van, re.I):
            lech = sorted(khoi_thay - hop_le)
            if lech:
                ghi(nhac, "KHOI_LECH_CAP",
                    "Trang nói đây là trường %s nhưng có khối %s — những khối đó không tồn tại ở cấp này. "
                    "Dòng lệch phải ra khỏi mọi mẫu số, không chỉ ghi chú."
                    % (ten, ", ".join(str(x) for x in lech)))
            break

    # --- 4. khoang do cham nghi he ma khong noi ---
    cham = []
    for m in re.finditer(r"\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?\b", van):
        d, mo = int(m.group(1)), int(m.group(2))
        if 1 <= d <= 31 and 1 <= mo <= 12 and cham_nghi_he(mo, d):
            cham.append(m.group(0))
    if cham and not any(k in van.lower() for k in NOI_VE_NGHI):
        ghi(nhac, "KHOANG_NGHI_HE",
            "Khoảng đo chạm vào kỳ nghỉ hè (%s) nhưng trang không nói ra. "
            "Số liệu thấp trong hè là bình thường — không nói thì người đọc hiểu thành lỗi của ai đó."
            % ", ".join(sorted(set(cham))[:5]))

    # --- 4b. rut xu huong bac qua ky nghi he ---
    # Chi xet TRONG CUNG MOT CAU: cau vua noi xu huong vua dan thang he.
    # Pham vi mot cau nen khong dinh vao nhung cau noi xu huong o khoang nam hoc.
    # Loi thoat: cau do da tu noi ra la he thi khong chan.
    for c in cau:
        thap = c.lower()
        tu = next((k for k in TU_XU_HUONG if k in thap), None)
        if not tu:
            continue
        he = [k for k in THANG_HE_CHU if k in thap]
        for m in re.finditer(r"\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?\b", c):
            d, mo = int(m.group(1)), int(m.group(2))
            if 1 <= d <= 31 and 1 <= mo <= 12 and cham_nghi_he(mo, d):
                he.append(m.group(0))
        if not he:
            continue
        if any(k in thap for k in NOI_VE_NGHI):
            continue
        ghi(chan, "XU_HUONG_QUA_HE",
            "Câu này rút xu hướng (\"%s\") qua một khoảng có kỳ nghỉ hè (%s). "
            "Trường không giao bài trong hè, nên đường cong đó là lịch nghỉ chứ không phải nhịp làm việc "
            "của ai. Bỏ chữ chỉ xu hướng, hoặc đổi sang khoảng nằm hẳn trong năm học."
            % (tu, ", ".join(sorted(set(he))[:4])), c)

    # --- 4c. cau dan nguoi doc thay vi sua trang ---
    for c in cau:
        for pat, ten in CAU_DAN_THAY_VI_SUA:
            if re.search(pat, c):
                ghi(chan, "CAU_DAN_THAY_VI_SUA",
                    "Câu này dặn người đọc đừng nhầm (%s) thay vì sửa chỗ dễ nhầm. "
                    "Đã biết hai con số dễ lẫn thì ĐỔI TÊN một trong hai, hoặc bỏ một cái đi — "
                    "đừng đẩy việc phân biệt sang người đọc." % ten, c)
                break

    # --- 5. hai con so cho cung mot thu: DA THU, DA BO ---
    # Thu gom theo (cong cu, ten truong, khoang ngay) roi bao khi co nhieu gia tri.
    # Sai hoan toan: no bao "48 em, 22 em, 13 em" la mau thuan, trong khi do la
    # si so cua BA LOP KHAC NHAU. Khoi JSON dong hanh khong ghi con so NOI VE AI,
    # nen may khong tach duoc "cung mot thu" voi "cung mot loai so, khac doi tuong".
    #
    # Day la lan thu BA trong cung mot phien ma mot phep do bat may doan nghia va
    # sai: truoc do la "con so dang lo bi boi dam" (check_voice) va "cong cu la tu
    # long hay la ten module" (check_useful). Bai hoc lap lai: may khong phan biet
    # duoc thi giao cho nguoi doc, dung bat no doan.
    #
    # Phep nay thuoc ve agents/qa-04-nguoi-doc.md — nguoi doc mo trang ra la thay
    # ngay "cho nay ghi 44 em, cho kia ghi 48 em".

    return chan, nhac, len(cau)


def main(argv):
    args = [a for a in argv[1:] if not a.startswith("--")]
    render = "--render" in argv[1:]
    if not args:
        sys.stdout.write(__doc__ + "\n")
        return 2
    if render and dung_dom is None:
        print("--render can scripts/render_dom.py nam canh script nay")
        return 2

    tong = 0
    for path in args:
        if not os.path.isfile(path):
            print("KHONG DOC DUOC: %s" % path)
            return 2
        soi, ghi_chu = path, None
        if render:
            d, ghi_chu = dung_dom(path)
            if d:
                soi = d
            else:
                print("\n  KHÔNG DỰNG ĐƯỢC TRANG: %s" % ghi_chu)
                tong += 1
        chan, nhac, n = do_mot_file(soi)
        tong += len(chan)

        print("\n" + "=" * 72)
        print("SỰ THẬT VỚI NGƯỜI ĐỌC · %s" % path)
        if ghi_chu:
            print("  render: %s" % ghi_chu)
        print("=" * 72)
        print("  %d câu" % n)
        if not chan and not nhac:
            print("  Bốn phép máy làm được: không có lỗi nào.")
        if chan:
            print("\n  CHẶN (%d)" % len(chan))
            for f in chan:
                print("    [%s] %s" % (f["code"], f["msg"]))
                if f["quote"]:
                    print("        > %s" % f["quote"])
        print("\n  Ba mẫu máy KHÔNG bắt được — lăng kính người đọc phải soi:")
        print("    · kể chuyện từ nguồn vừa gắn nhãn không tin được")
        print("    · hai con số cho cùng một thứ")
        print("    · suy việc-làm-tiếp từ một chỗ trống")

    print("\n" + "-" * 72)
    print("Tổng: %d lỗi chặn" % tong)
    print("Kết luận: %s" % ("KHÔNG GIAO" if tong else "Bốn phép máy đạt"))
    return 1 if tong else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
