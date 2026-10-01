#!/usr/bin/env python3
"""Do xem ban bao cao co NOI DUOC GI cho nguoi doc khong.

Hai may do kia (check_voice, check_sidecar) do su TRUNG THUC. May nay do su
DUNG DUOC. Chung khong thay nhau: mot ban bao cao co the dung tung con so, dan
duoc tung nguon, giong dung chuan — va van vo dung.

Do that tren mot ban da giao cho nguoi dung, ca hai cua kia deu bao dat:
    200 cau · 27% chua tu vung noi bo · 24% noi ve du lieu hong
    ~0% noi ve hoc sinh · 1 bieu do tren 27.350 ky tu
May nay sinh ra de chan dung ban do.

Dung:
    python check_useful.py --render <file.html> [...]
    python check_useful.py <file.md | file.html> [...]

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

# ---------------------------------------------------------------- nguong

TRAN_DU_LIEU_HONG = 0.15   # ti le cau noi ve du lieu hong
SAN_PHAT_HIEN = 3          # so phat hien that toi thieu

# Ten cong cu MCP — khong bao gio duoc nam trong phan nguoi doc thay.
TEN_CONG_CU = [
    "ths-giaovien", "ths-school", "list_teacher_classes", "get_class_roster",
    "get_class_attendance_summary", "get_class_exam_summary", "get_class_mission_summary",
    "get_student_attendance", "get_student_exam_scores", "get_student_mission_status",
    "get_student_profile", "find_at_risk_students", "search_students", "get_schedule",
    "get_school_overview", "list_exams", "list_exam_answers", "lookup_reference",
    "run_reads", "find_tools", "search_questions", "run_tool",
]

# Ten truong tra ve — cung vay.
TEN_TRUONG = [
    "class_id", "student_id", "student_count", "absent_rate_pct", "attendance_rate_percent",
    "average_percent", "min_percent", "max_percent", "exam_count", "mission_count",
    "marked_periods", "overdue_open", "avg_score_of_done", "by_status", "_count", "_widget",
    "_unit", "role==", "hasOwnProperty", "data-fig", "recent_absent_dates", "absent_dates",
]

# Tu vung ky thuat cua chinh skill — nguoi doc khong can biet.
TU_VUNG_NOI_BO = [
    "cửa sổ", "dội lại", "lời gọi", "tài khoản đang truy cập", "truy vấn",
    "sổ lớp trả về", "trường dữ liệu", "khoá thiếu", "MCP", "API", "endpoint",
    "tham số", "máy chủ dữ liệu", "tầng dữ liệu", "skill",
]

# "cong cu" DA BI BO khoi danh sach chan. Truong hoc so co mot module ten that
# la "Kho cong cu", nen mot ban bao cao ve dung module do phai duoc goi ten no —
# va may khong tach duoc "3 cong cu dang bat" (danh tu that) khoi "cong cu doc"
# (tu long ky thuat). Da thu lookbehind "kho ", van bao nham.
# Cung mot bai hoc voi bo do dam: may khong phan biet duoc thi dung bat no doan.
# Viec nay giao cho lang kinh giong, agents/qa-02-giong.md muc 2.8.
JARGON_CO_NGOAI_LE = []

DAU_HIEU_DU_LIEU_HONG = [
    "chưa dùng được", "không dùng được", "chưa tin", "không đáng tin", "không khớp",
    "chưa rõ nguyên nhân", "cần đối chiếu", "dữ liệu thử", "chưa có dữ liệu",
    "không đọc được", "lỗi dữ liệu", "nhờ quản trị", "người phụ trách hệ thống",
    "chưa chấm", "đã đạt giới hạn", "bị giới hạn", "là sàn", "chưa quy được",
    "chưa xếp thời khoá biểu", "số thô", "chưa nói được",
]

# Skill nay la kim chi nam cho MOI loai bao cao, moi vai. Nen danh sach nay
# phai phu ca nhung thu ngoai day-va-hoc: kho hoc lieu, doi ngu, thiet bi,
# sach, tai khoan, don vi. Hep qua thi chinh cua nay chan nham mot ban bao cao
# dung — do la loi da xay ra o vong truoc.
DANH_TU_NGHE = [
    # day va hoc
    "em", "học sinh", "lớp", "bài", "nhiệm vụ", "tiết", "điểm", "câu", "chủ đề",
    "bài làm", "chữa bài", "nộp bài", "hạn nộp", "phòng thi", "môn", "khối",
    "giáo viên", "thầy", "cô", "phụ huynh", "buổi", "đề", "bộ đề", "kỳ",
    # kho hoc lieu, sach, noi dung
    "học liệu", "sách", "trang", "video", "bài giảng", "tài liệu", "thư viện",
    "danh mục", "chương", "mục",
    # doi ngu, don vi, quan tri
    "trường", "tổ", "nhóm", "người", "nhân sự", "đơn vị", "phòng", "ban",
    # thiet bi, ha tang
    "thiết bị", "máy", "phòng máy", "màn hình", "tài khoản",
    # don vi dem chung
    "lượt", "cái", "bộ", "file", "mục", "dòng", "phần", "loại", "ngày", "tuần", "tháng",
]

# Muc chan trang duoc phep chua ten cong cu — do la noi no thuoc ve.
ID_MUC_NGUON = r'(nguon|nguồn|source|provenance|so-lieu-lay-tu-dau)'


def boc_van_nguoi_doc(raw, la_html):
    """Tra ve (van_ban, so_muc_nguon_da_bo). Bo script/style va muc Nguon so."""
    if not la_html:
        s = re.sub(r"(?s)```.*?```", " ", raw)
        return re.sub(r"`[^`\n]+`", " ", s), 0

    s = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", raw)
    s = re.sub(r"(?s)<!--.*?-->", " ", s)

    # Bo cac muc nguon — chung duoc phep chua ten cong cu.
    da_bo = 0
    for m in list(re.finditer(r'(?is)<(section|div|footer)[^>]*(?:id|class)\s*=\s*["\'][^"\']*'
                              + ID_MUC_NGUON + r'[^"\']*["\'][^>]*>', s)):
        the = m.group(1)
        sau = s[m.end():]
        dong = re.search(r"(?is)</%s>" % the, sau)
        if dong:
            s = s[:m.start()] + " " + s[m.end() + dong.end():]
            da_bo += 1
    return re.sub(r"(?s)<[^>]+>", " ", s), da_bo


def tach_cau(van):
    van = re.sub(r"\s+", " ", van)
    return [c.strip() for c in re.split(r"(?<=[.!?])\s+", van) if len(c.split()) >= 4]


def co(ds, cau):
    c = cau.lower()
    return [k for k in ds if k.lower() in c]


def do_mot_file(path, la_render=False):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        raw = f.read()
    la_html = path.lower().endswith((".html", ".htm"))
    van, so_muc_nguon = boc_van_nguoi_doc(raw, la_html)
    tieu_de_tran = tieu_de_thieu_mau_so(raw) if la_html else []
    cau = tach_cau(van)
    if not cau:
        return {"loi": ["không bóc được câu nào từ trang"], "cau": 0}

    # --- 1. tu vung noi bo ---
    hit_congcu, hit_truong, hit_noibo = [], [], []
    for c in cau:
        for k in co(TEN_CONG_CU, c):
            hit_congcu.append((k, c))
        for k in co(TEN_TRUONG, c):
            hit_truong.append((k, c))
        for k in co(TU_VUNG_NOI_BO, c):
            hit_noibo.append((k, c))
        for pat, ten in JARGON_CO_NGOAI_LE:
            if re.search(pat, c):
                hit_noibo.append((ten, c))

    # --- 2. ti le cau noi ve du lieu hong ---
    c_hong = [c for c in cau if co(DAU_HIEU_DU_LIEU_HONG, c)]
    ti_le_hong = len(c_hong) / len(cau)

    # --- 3. phat hien that ---
    # Mot phat hien: co CON SO, co danh tu nghe, va KHONG dinh du lieu hong hay
    # tu vung noi bo. Do la mot cau noi dieu gi do ve lop.
    phat_hien = []
    for c in cau:
        if not re.search(r"\d", c):
            continue
        if co(DAU_HIEU_DU_LIEU_HONG, c) or co(TU_VUNG_NOI_BO, c) or co(TEN_CONG_CU, c) or co(TEN_TRUONG, c):
            continue
        if len(co(DANH_TU_NGHE, c)) >= 1:
            phat_hien.append(c)

    # --- 4. bieu do ---
    so_bieu_do = 0
    if la_html:
        khong_script = re.sub(r"(?is)<script\b.*?</script>", " ", raw)
        tat_ca = re.findall(r'(?is)<svg[^>]*role\s*=\s*["\']img["\'][^>]*>', khong_script)
        spark = [t for t in tat_ca if re.search(r'(?i)class\s*=\s*["\'][^"\']*(spark|ths-gauge|ths-meter)', t)]
        so_bieu_do = len(tat_ca) - len(spark)

    return {
        "cau": len(cau), "so_muc_nguon": so_muc_nguon,
        "hit_congcu": hit_congcu, "hit_truong": hit_truong, "hit_noibo": hit_noibo,
        "c_hong": c_hong, "ti_le_hong": ti_le_hong,
        "phat_hien": phat_hien, "so_bieu_do": so_bieu_do,
        "tieu_de_tran": tieu_de_tran,
    }


def in_ket_qua(path, kq, ghi_chu_render):
    chan = []
    print("\n" + "=" * 72)
    print("DÙNG ĐƯỢC · %s" % path)
    if ghi_chu_render:
        print("  render: %s" % ghi_chu_render)
    print("=" * 72)

    if kq.get("loi"):
        for e in kq["loi"]:
            print("  KHÔNG ĐO ĐƯỢC: %s" % e)
        return ["không đo được"]

    n = kq["cau"]
    print("  %d câu · %d biểu đồ · đã bỏ %d mục nguồn khỏi phép đo"
          % (n, kq["so_bieu_do"], kq["so_muc_nguon"]))
    print()

    # 1
    tong_jargon = len(kq["hit_congcu"]) + len(kq["hit_truong"]) + len(kq["hit_noibo"])
    dat = tong_jargon == 0
    print("  [%s] Từ vựng nội bộ trong phần người đọc thấy: %d (trần 0)"
          % ("ĐẠT" if dat else "TRƯỢT", tong_jargon))
    if not dat:
        chan.append("từ vựng nội bộ")
        goc = {}
        for k, c in kq["hit_congcu"] + kq["hit_truong"] + kq["hit_noibo"]:
            goc.setdefault(k, []).append(c)
        for k in sorted(goc, key=lambda x: -len(goc[x]))[:12]:
            print("        %-28s %d lần   ví dụ: %s" % (k, len(goc[k]), goc[k][0][:90]))
        print("        → những chữ này chỉ được nằm trong mục Nguồn số ở chân trang.")

    # 2
    dat = kq["ti_le_hong"] <= TRAN_DU_LIEU_HONG
    print("  [%s] Câu nói về dữ liệu hỏng: %d/%d = %.0f%% (trần %.0f%%)"
          % ("ĐẠT" if dat else "TRƯỢT", len(kq["c_hong"]), n,
             100 * kq["ti_le_hong"], 100 * TRAN_DU_LIEU_HONG))
    if not dat:
        chan.append("dữ liệu hỏng chiếm quá nhiều trang")
        for c in kq["c_hong"][:4]:
            print("        · %s" % c[:110])
        print("        → mỗi chỉ số chết được MỘT khối, tối đa 3 câu. Rồi chuyển sang chỉ số còn sống.")

    # 3
    dat = len(kq["phat_hien"]) >= SAN_PHAT_HIEN
    print("  [%s] Phát hiện thật về thứ được hỏi: %d (sàn %d)"
          % ("ĐẠT" if dat else "TRƯỢT", len(kq["phat_hien"]), SAN_PHAT_HIEN))
    if kq["phat_hien"]:
        for c in kq["phat_hien"][:3]:
            print("        · %s" % c[:110])
    if not dat:
        chan.append("chưa đủ phát hiện về lớp")
        print("        → nới cửa sổ ra cho tới khi tìm được, rồi nói rõ đã nới.")

    if kq.get("tieu_de_tran"):
        print()
        print("  [NHẮC] %d tiêu đề mang con số mà không có mẫu số ngay tại đó."
              % len(kq["tieu_de_tran"]))
        for c in kq["tieu_de_tran"][:5]:
            print("        · %s" % c)
        print("        → người bận chỉ đọc tiêu đề và mục lục. Mẫu số phải nằm ngay đó,")
        print("          và nếu nó là mẫu chọn tay hay sàn thì nói luôn trong tiêu đề.")

    print()
    print("  Kết luận: %s" % ("DÙNG ĐƯỢC" if not chan else "KHÔNG GIAO — " + ", ".join(chan)))
    return chan



# --- tieu de mang con so tran, khong co mau so ---
# NHAC thoi, khong chan: may khong phan biet duoc "Ca 22 em" (mau so day du)
# voi "Bon luot nop" (thieu mau so). Nhung liet ke ra thi nguoi viet thay ngay.
# Vong 9: hieu truong doc muc luc "Bon luot nop tren 336 luot giao" trong mot ban
# de "toan truong" va hieu thanh so ca truong — that ra la so cua MOT lop.
DON_VI_TIEU_DE = r"(?:em|học sinh|lớp|bài|dòng|lượt|tiết|phòng|nhiệm vụ)"
DAU_MAU_SO = ["trên", "trong", "/", "của", "cả ", "mỗi ", "toàn "]


def tieu_de_thieu_mau_so(raw):
    """Tra ve danh sach tieu de co con so dem ma khong co dau hieu mau so."""
    ra = []
    for m in re.finditer(r"(?is)<h([23])[^>]*>(.*?)</h\1>", raw):
        chu = re.sub(r"\s+", " ", re.sub(r"(?s)<[^>]+>", " ", m.group(2))).strip()
        if not re.search(r"\d[\d.,]*\s*" + DON_VI_TIEU_DE + r"\b", chu):
            continue
        if any(k in chu.lower() for k in DAU_MAU_SO):
            continue
        ra.append(chu[:90])
    return ra


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
        tong += len(in_ket_qua(path, do_mot_file(soi, render), ghi_chu))

    print("\n" + "-" * 72)
    print("Tổng: %d phép trượt" % tong)
    return 1 if tong else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
