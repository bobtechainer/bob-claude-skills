#!/usr/bin/env python3
"""Doi chieu con so tren trang voi khoi JSON dong hanh.

Bat phan may bat duoc trong references/06-dung-trang.md. Phan con lai —
doi chieu voi phan hoi MCP that — la viec cua lang kinh 1 (agents/qa-01-du-lieu.md);
script nay khong thay no, chi don phan de.

Dung:
    python check_sidecar.py <file.html> [...]
    python check_sidecar.py --render <file.html> [...]

    --render  Dung trang bang Chrome headless roi soi DOM sau khi JS chay.
              BAT BUOC voi trang bao cao that. Do that trong bo thu dau-cuoi:
              37 con so sinh luc chay VO HINH voi ban tinh, trong do co mot con
              so khong truy duoc nguon ma van lot cua.

Ma tra ve:
    0  khong co loi chan
    1  co loi chan — sua roi moi giao
    2  sai cach dung, khong doc duoc file, hoac khoi JSON khong parse duoc
"""

import sys
import os
import re
import json

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

TRAN = {
    "get_school_overview": 20,
    "get_class_exam_summary": 30,
    "get_student_exam_scores": 50,
    "list_exams": 60,
    "run_reads": 5,
    "find_tools": 20,
}

CUA_SO_MAC_DINH = {
    "get_class_attendance_summary": "14 ngày",
    "get_class_mission_summary": "30 ngày",
    "find_at_risk_students": "30 ngày",
    "get_school_overview": "30 ngày",
    "get_class_exam_summary": "90 ngày",
    "get_student_exam_scores": "90 ngày",
    "get_schedule": "7 ngày",
}

# Cong cu KHONG loc ngay — thieu cua so o day la binh thuong.
KHONG_LOC_NGAY = {
    "get_class_roster", "list_teacher_classes", "list_exams",
    "lookup_reference", "get_student_profile", "search_students",
    "list_exam_answers", "search_questions", "find_tools",
}

TRUONG_BI_CAM = [
    ("find_at_risk_students", "class_name"),
    ("search_students", "class_name"),
]

GIA_TRI_KHOA_THIEU_SAI = {"0", "0%", "", "—", "-", "NaN", "undefined", "null", "0,0", "0.0"}

# Don vi DEM. Moi con so mang mot trong nhung don vi nay deu tra loi cau
# "bao nhieu ... trong bao nhieu", nen no BUOC phai mang mauSo.
#
# Vi sao co luat nay: ba vong thu lien tiep, loi bi che nhieu nhat khong phai so
# sai ma la HAI CON SO CUNG NOI VE MOT THU nhung dem tren hai tap khac nhau.
#   · chu nhiem doc tieu de "38 em dang no" roi cau duoi noi gan 70 em
#   · hieu truong ghi 48 vao so tay, mai hop cuoi moi thay "48 la so DONG chu chua phai 48 em"
#   · hoc sinh gap hai con so 18 canh nhau kem mot cau dan "dung cong chung lai"
# Vong 4 da thu chua bang mot luat bang chu — bao nguoi dung tu chep moi con so
# ra mot bang roi doi chieu. Khong an thua: do la viec lam trong dau, khong de
# lai dau vet nao, nen bo qua duoc va da bi bo qua.
# Nen doi cach: KHONG di bat mau thuan (da thu 4 lan, 4 lan may doan sai nghia),
# ma bat MAU SO phai dinh lien voi con so. In "38 trong 70 em cua hai lop" thi
# mau thuan kia khong the xay ra.
DON_VI_DEM = {
    "em", "học sinh", "lớp", "bài", "dòng", "lượt", "phòng", "phòng thi",
    "nhiệm vụ", "tiết", "câu", "bộ đề", "thầy cô", "giáo viên", "buổi", "ngày công",
    # TI LE cung phai khai mau so. Vong 7: mot dai so duoi bieu do in tran
    # "trung binh cac phong da co diem 4,2%" — giao vien bo mon: "liec qua la
    # tuong trung binh ca lop", trong khi cau giai thich no la so cua MOT em
    # nam tan doan phia tren. Mot ti le khong noi "cua cai gi" thi vo nghia.
    "%", "phần trăm", "điểm %", "tỉ lệ",
}



def doc_sidecar(raw):
    """Boc khoi <script type=application/json id=thsSidecar>."""
    m = re.search(
        r'<script[^>]*id\s*=\s*["\']thsSidecar["\'][^>]*>(.*?)</script>',
        raw, re.S | re.I)
    if not m:
        return None, "khong tim thay khoi <script id=\"thsSidecar\">"
    try:
        return json.loads(m.group(1).strip()), None
    except json.JSONDecodeError as e:
        return None, "khoi JSON dong hanh khong parse duoc: %s" % e


def doc_data_fig(raw):
    """Tra ve {id: chu hien thi} cho moi phan tu co data-fig."""
    ket_qua = {}
    for m in re.finditer(r'data-fig\s*=\s*["\']([^"\']+)["\']', raw):
        fid = m.group(1)
        # Lay chu ben trong the mang thuoc tinh nay, do tho nhung du dung.
        sau = raw[m.end():m.end() + 600]
        dong = re.sub(r"(?s)<[^>]+>", " ", sau)
        dong = re.sub(r"\s+", " ", dong).strip()
        ket_qua[fid] = dong[:80]
    return ket_qua


def do_mot_file(path):
    chan, nhac = [], []

    def ghi(bucket, ma, thong_diep, chi_tiet=""):
        bucket.append({"code": ma, "msg": thong_diep, "detail": chi_tiet})

    with open(path, "r", encoding="utf-8", errors="replace") as f:
        raw = f.read()

    sc, loi = doc_sidecar(raw)
    if sc is None:
        ghi(chan, "THIEU_SIDECAR", loi)
        return chan, nhac, None

    so_lieu = sc.get("soLieu") or {}
    tren_trang = doc_data_fig(raw)

    # --- 1. con so tren trang khong co trong sidecar ---
    for fid, chu in tren_trang.items():
        if fid not in so_lieu:
            ghi(chan, "KHONG_TRUY_NGUON",
                "data-fig %r hien tren trang nhung khong co trong khoi JSON. Con so khong truy duoc nguon phai XOA khoi trang, khong phai lam nhe di." % fid,
                chu)

    # --- 2. muc trong sidecar khong hien tren trang ---
    for fid in so_lieu:
        if fid not in tren_trang:
            ghi(nhac, "MUC_LAC",
                "muc %r co trong khoi JSON nhung khong co data-fig nao tren trang" % fid)

    # --- 3. tung muc: cong cu, truong, cua so ---
    for fid, m in so_lieu.items():
        if not isinstance(m, dict):
            ghi(chan, "MUC_SAI_KIEU", "muc %r khong phai mot doi tuong" % fid)
            continue

        cong_cu = m.get("congCu")
        truong = m.get("truong")
        cua_so = m.get("cuaSo")

        if not cong_cu:
            ghi(chan, "THIEU_CONG_CU", "muc %r khong noi cong cu nao sinh ra no" % fid)
        if not truong:
            ghi(chan, "THIEU_TRUONG", "muc %r khong noi ten truong nao" % fid)

        if cong_cu and cong_cu not in KHONG_LOC_NGAY and not cua_so:
            ghi(chan, "THIEU_CUA_SO",
                "muc %r lay tu %s (mac dinh %s) nhung khong ghi cua so. So khong co cua so phai xoa khoi trang."
                % (fid, cong_cu, CUA_SO_MAC_DINH.get(cong_cu, "co loc ngay")))

        if cua_so and not re.match(r"^\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}$", str(cua_so)):
            ghi(nhac, "CUA_SO_SAI_DANG",
                "muc %r co cuaSo %r — dang mong doi la YYYY-MM-DD..YYYY-MM-DD" % (fid, cua_so))

        # truong bi cam in
        for cc, tr in TRUONG_BI_CAM:
            if cong_cu == cc and truong and tr in str(truong):
                ghi(chan, "TRUONG_BI_CAM",
                    "muc %r in truong %s.%s — truong nay SAI (voi class_id cua 6a2 no tra ve '6a2 Am nhac', '12A10', '13A13'). Ten lop chi lay tu list_teacher_classes hoac get_class_roster."
                    % (fid, cc, tr))

        # khoa thieu ma hien ra so
        if m.get("khoaThieu"):
            hien = str(m.get("hienThi", "")).strip()
            if hien in GIA_TRI_KHOA_THIEU_SAI:
                ghi(chan, "KHOA_THIEU_HIEN_SO",
                    "muc %r co khoaThieu=true nhung hienThi la %r. Khoa thieu phai hien 'chua cham' hoac 'chua co diem'."
                    % (fid, hien))
            if m.get("giaTri") not in (None, ""):
                ghi(chan, "KHOA_THIEU_CO_GIA_TRI",
                    "muc %r co khoaThieu=true nhung giaTri la %r — phai la null" % (fid, m.get("giaTri")))

        # gia tri tu tinh phai co nhan
        if truong and any(k in str(truong) for k in ["/", "delta", "-", "sum(", "avg("]):
            if not m.get("tuTinh"):
                ghi(nhac, "THIEU_NHAN_TU_TINH",
                    "muc %r co truong %r trong nhu mot phep tinh nhung thieu tuTinh:true" % (fid, truong))

        # si so phai dem role=="student" — khong bao gio lay _count / student_count.
        # Giao vien chu nhiem nam trong members[] voi role "teacher".
        if truong and re.match(r"^\s*(_count|student_count)\s*$", str(truong)):
            ghi(chan, "SI_SO_SAI_NGUON",
                "muc %r lay si so tu %r. Si so phai la so dong role==\"student\" — giao vien chu nhiem nam trong members[] va _count dem ca ho."
                % (fid, truong))

    # --- 3b. moi con so DEM phai mang mau so ---
    for fid, m in (sc.get("soLieu") or {}).items():
        if not isinstance(m, dict):
            continue
        don_vi = str(m.get("donVi") or "").strip().lower().lstrip("/").strip()
        if don_vi not in DON_VI_DEM:
            continue
        mau_so = str(m.get("mauSo") or "").strip()
        if not mau_so:
            ghi(chan, "THIEU_MAU_SO",
                "muc %r dem theo don vi %r nhung khong co mauSo. Moi con so dem phai noi ro no dem "
                "TREN TAP NAO, va mau so do phai in ngay canh con so tren trang — khong de o muc khac."
                % (fid, m.get("donVi")))
        elif len(mau_so) < 8:
            ghi(nhac, "MAU_SO_MO_HO",
                "muc %r co mauSo %r — qua ngan de nguoi doc biet no dem tren tap nao. "
                "Viet ro: 'trong 70 dong so cua hai lop, 15/08-15/09'." % (fid, mau_so))

    # --- 3c. hai muc mo ta CUNG mot thu ma gia tri khac nhau ---
    # Phep so sanh duy nhat an toan: doi chieu NHAN do chinh nguoi viet dat, khong
    # doan nghia cau van. Trung moTa va trung mauSo thi hai muc noi ve dung mot thu.
    theo_nhan = {}
    for fid, m in (sc.get("soLieu") or {}).items():
        if not isinstance(m, dict):
            continue
        nhan = (str(m.get("moTa") or "").strip().lower(), str(m.get("mauSo") or "").strip().lower())
        if not nhan[0]:
            continue
        theo_nhan.setdefault(nhan, []).append((fid, m.get("giaTri")))
    for (mo_ta, _), ds in theo_nhan.items():
        gia_tri = set(str(v) for _, v in ds)
        if len(ds) > 1 and len(gia_tri) > 1:
            ghi(chan, "MOT_THU_HAI_SO",
                "%d muc cung mo ta %r nhung mang gia tri khac nhau: %s. Mot thu chi duoc co mot con so — "
                "sua cho bang nhau, hoac dat cho chung hai cai ten khac nhau ngay tren trang."
                % (len(ds), mo_ta, ", ".join("%s=%s" % (k, v) for k, v in ds)))

    # --- 4. tran danh sach ---
    for g in (sc.get("gioiHan") or []):
        if not isinstance(g, dict):
            continue
        cc, do_dai = g.get("congCu"), g.get("doDai")
        if cc in TRAN and do_dai == TRAN[cc] and not g.get("note"):
            ghi(chan, "TRAN_KHONG_NOI",
                "%s tra ve dung %d muc — bang tran — nhung khoi JSON khong ghi cau note cua he thong. Con so bi cat la SAN, khong phai tong."
                % (cc, do_dai))

    # danh sach dai bang tran nhung khong khai trong gioiHan
    da_khai = {(g.get("congCu")) for g in (sc.get("gioiHan") or []) if isinstance(g, dict)}
    for fid, m in so_lieu.items():
        if not isinstance(m, dict):
            continue
        cc = m.get("congCu")
        gt = m.get("giaTri")
        if cc in TRAN and gt == TRAN[cc] and cc not in da_khai:
            ghi(chan, "TRAN_KHONG_KHAI",
                "muc %r co giaTri %s, dung bang tran cua %s, nhung khong co dong nao trong gioiHan"
                % (fid, gt, cc))

    # --- 5. khoi bat buoc o dau trang ---
    if not sc.get("docTao"):
        ghi(chan, "THIEU_GIO_DOC", "khoi JSON khong co docTao — trang la mot ban chup dong bang, phai ghi gio doc so lieu")
    if not sc.get("phamVi"):
        ghi(chan, "THIEU_PHAM_VI", "khoi JSON khong co phamVi")
    if sc.get("giaDinh") is None:
        ghi(nhac, "THIEU_GIA_DINH", "khoi JSON khong co truong giaDinh (mang rong la hop le)")

    # --- 6. cac phep grep trong 06-dung-trang.md ---
    if not re.search(r"@page", raw):
        ghi(chan, "THIEU_AT_PAGE", "khong co @page — trang phai in duoc A4")
    if re.search(r'(?:src|href)\s*=\s*["\']https?://', raw):
        for m in re.finditer(r'(?:src|href)\s*=\s*["\'](https?://[^"\']+)', raw):
            ghi(chan, "THAM_CHIEU_MANG",
                "trang tham chieu ra mang: %s — file phai dung mot minh, may o truong co the khong co internet" % m.group(1))
    if "﻿" not in raw and "uFEFF" not in raw and "\\ufeff" not in raw.lower():
        ghi(nhac, "THIEU_BOM_CSV",
            "khong thay BOM trong duong xuat CSV — thieu no thi Excel tren Windows mo ra chu Viet loi het")
    if "localeCompare" in raw and not re.search(r"localeCompare\s*\([^)]*['\"]vi['\"]", raw):
        ghi(chan, "THIEU_LOCALE_VI",
            "co localeCompare nhung khong truyen 'vi' — ten Viet se sap sai")

    # Dem bieu do can bang song sinh. Hai phep tru, ca hai deu can:
    #
    # 1. Bo phan <script>: bo ham noi tuyen chua chinh chuoi 'role="img"' trong
    #    ma nguon cua no, nen dem tho bi cong them mot.
    # 2. Bo ho "so, khong phai bieu do" (Cua 1 cua 03-kho-bieu-do.md): duong nho,
    #    thanh muc, dong ho cung. Gia tri cua chung nam ngay canh chung o dang so,
    #    nen khong co gia tri nao bi gate sau mot bang gap. Bat chung phai co bang
    #    la doi mot bang mot dong — bang do khong cho nguoi doc them gi.
    #    `bullet` KHONG nam trong ho nay: no ma hoa hai gia tri (gia tri va muc
    #    tieu) nen bang cua no co noi dung that.
    HO_SO_KHONG_BIEU_DO = r'(?i)class\s*=\s*["\'][^"\']*(spark|ths-gauge|ths-meter)'
    khong_script = re.sub(r"(?is)<script\b.*?</script>", " ", raw)
    tat_ca_img = re.findall(r'(?is)<svg[^>]*role\s*=\s*["\']img["\'][^>]*>', khong_script)
    la_so = [t for t in tat_ca_img if re.search(HO_SO_KHONG_BIEU_DO, t)]
    so_bieu_do = len(tat_ca_img) - len(la_so)
    so_bang = len(re.findall(r'class\s*=\s*["\'][^"\']*data-table', khong_script))
    if so_bieu_do and so_bang < so_bieu_do:
        ghi(chan, "THIEU_BANG_SONG_SINH",
            "co %d bieu do can bang song sinh (%d the role=\"img\", tru %d thuoc ho so-khong-phai-bieu-do) nhung chi %d bang so lieu. Moi bieu do THAT phai co bang song sinh — khong ngoai le."
            % (so_bieu_do, len(tat_ca_img), len(la_so), so_bang))
    if not re.search(r"non-scaling-stroke", raw):
        ghi(nhac, "THIEU_NON_SCALING",
            "khong co vector-effect=\"non-scaling-stroke\" — bieu do co gian o 2x se ve net 1px thanh 5px")

    # --- 7. so lac trong van: co don vi nhung khong khai trong khoi JSON ---
    # Cach lam: boc chu nguoi doc thay, TRU di moi chuoi hienThi da khai, roi xem
    # con cum so nao co don vi khong. Con lai la ung vien khong truy duoc nguon.
    # Bo nhanh "x/y" vi no lan voi ngay thang (31/08); ti le nhu "1/22 em" van bat
    # duoc nho don vi "em".
    van = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", raw)
    # Cat PHAN BANG ra khoi phep quet loi van. Gia tri tung dong bang — diem cua
    # tung em, tinh trang tung bai — la du lieu muc DONG, khong the khai vao khoi
    # JSON duoc (khai thi thanh 22 muc cho mot cot). Chung khong phai "so lac";
    # chung thuoc ve chinh cai bang, va lang kinh 1 doi chieu chung voi MCP.
    # Do that: bo buoc nay thi 6 trong 10 cum con lai la diem cua tung em.
    van = re.sub(r"(?is)<table\b.*?</table>", " ", van)
    van = re.sub(r"(?s)<[^>]+>", " ", van)
    # Tru tung chuoi hienThi, nhung PHAI chan hai dau bang ky tu khong-phai-so.
    # Thay chuoi tho lam hienThi "0" xoa moi chu so 0 trong van, bien "80%" thanh "8%".
    for m in so_lieu.values():
        if not isinstance(m, dict):
            continue
        hien = str(m.get("hienThi", "")).strip()
        if not hien:
            continue
        if re.search(r"\d", hien):
            van = re.sub(r"(?<![\d,.])" + re.escape(hien) + r"(?![\d,.%])", " ", van)
        else:
            van = van.replace(hien, " ")
    # Tru them TUNG PHAN TU cua mang giaTri va cua mocDoiChieu.
    # Do thang: bo buoc nay thi ban mau bao 58 cum so lac, ma 47 trong so do la
    # gia tri cua chinh cac bieu do — mang [33.1, 36.4, 35.0, ...] da khai dang
    # hoang nhung hienThi chi la MOT chuoi nen tung phan tu lot ra. Bao oan 47
    # cho thi khong ai dam nang phep nay len chan.
    def _phang(v, ra):
        if isinstance(v, list):
            for x in v:
                _phang(x, ra)
        elif isinstance(v, (int, float)) and not isinstance(v, bool):
            ra.append(v)

    roi_rac = []
    for m in so_lieu.values():
        if isinstance(m, dict):
            _phang(m.get("giaTri"), roi_rac)
    for m in (sc.get("mocDoiChieu") or []):
        if isinstance(m, dict):
            _phang(m.get("giaTri"), roi_rac)

    for x in sorted(set(roi_rac), key=lambda v: -abs(v)):
        dang = {("%.1f" % x).replace(".", ","), ("%g" % x).replace(".", ",")}
        if float(x).is_integer():
            dang.add(str(int(x)))
        for d in dang:
            van = re.sub(r"(?<![\d,.])" + re.escape(d) + r"(?![\d,.])", " ", van)

    con_lai = re.findall(
        r"\d[\d.,]*\s*(?:%|em\b|lượt\b|bài\b|tiết\b|lớp\b|điểm\b|học sinh\b)", van)
    # Trang tu khai "loai": "danh-muc" thi BO QUA phep nay. Kho hinh la tai lieu
    # ve co che bieu do, khong phai bao cao: nhan truc 0% 25% 50%, cau giai thich
    # "nen la mau chuoi o 10%", chu thich thang "0-60%" deu la noi dung tai lieu.
    # Khai chung vao khoi JSON thi vo nghia. Khong hardcode ten file — trang phai
    # tu nhan minh la danh muc.
    if con_lai and sc.get("loai") != "danh-muc":
        # NANG LEN CHAN. Truoc do phep nay chi NHAC, va no bao 58 cum tren chinh
        # ban mau — khong ai dam chan voi con so do. Nhung 47 trong 58 la bao oan
        # (gia tri trong mang bieu do) va 8 nua la du lieu muc dong cua bang.
        # Sau khi tru ca hai, ban mau con 3 cum, va ca 3 deu la loi that:
        # mot tit lam tron 26,7% thanh "tren 26%", mot delta viet cung so, mot ti
        # le tinh luc chay ma khong khai. Sua xong ca ba thi ban mau ve 0.
        # Con so nao khong truy duoc nguon thi XOA khoi trang, khong lam nhe di.
        ghi(chan, "SO_LAC_TRONG_VAN",
            "con %d cum so co don vi trong phan chu ma khong khai trong khoi JSON. Con so khong truy duoc nguon phai xoa khoi trang, khong phai lam nhe di."
            % len(con_lai),
            " · ".join(x.strip() for x in con_lai[:12]))

    return chan, nhac, {"tren_trang": len(tren_trang), "sidecar": len(so_lieu), "bieu_do": so_bieu_do}


def main(argv):
    args = [a for a in argv[1:] if not a.startswith("--")]
    render = "--render" in argv[1:]
    if not args:
        sys.stdout.write(__doc__ + "\n")
        return 2
    if render and dung_dom is None:
        print("--render can scripts/render_dom.py nam canh script nay")
        return 2

    tong_chan = tong_nhac = 0
    loi_parse = False
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
                # Noi ra thay vi lang le roi ve ban tinh — ban tinh mu voi phan
                # JS dung ra, va phan do la phan lon trang.
                tong_chan += 1
                print("\n  KHONG DUNG DUOC TRANG: %s" % ghi_chu_render)

        chan, nhac, dem = do_mot_file(soi_path)
        tong_chan += len(chan)
        tong_nhac += len(nhac)
        if any(f["code"] == "THIEU_SIDECAR" for f in chan):
            loi_parse = True

        print("\n" + "=" * 72)
        print("TRUY NGUỒN · %s" % path)
        if ghi_chu_render:
            print("  render: %s" % ghi_chu_render)
        else:
            print("  render: KHÔNG — đang soi HTML tĩnh. Con số sinh lúc chạy sẽ")
            print("          không được soi. Chạy lại với --render.")
        print("=" * 72)
        if dem:
            print("  %d con số trên trang · %d mục trong khối JSON · %d biểu đồ"
                  % (dem["tren_trang"], dem["sidecar"], dem["bieu_do"]))

        if not chan and not nhac:
            print("  Không có lỗi nào.")
            continue
        if chan:
            print("\n  CHẶN — sửa rồi mới giao (%d)" % len(chan))
            for f in chan:
                print("    [%s] %s" % (f["code"], f["msg"]))
                if f["detail"]:
                    print("        > %s" % f["detail"])
        if nhac:
            print("\n  NHẮC (%d)" % len(nhac))
            for f in nhac:
                print("    [%s] %s" % (f["code"], f["msg"]))

    print("\n" + "-" * 72)
    print("Tổng: %d chặn, %d nhắc" % (tong_chan, tong_nhac))
    print("Kết luận: %s" % ("KHÔNG GIAO — còn lỗi chặn" if tong_chan else "Truy nguồn đạt"))
    if loi_parse:
        return 2
    return 1 if tong_chan else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
