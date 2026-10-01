#!/usr/bin/env python3
"""Dung trang bang Chrome headless roi tra ve DOM sau khi JS da chay.

VI SAO CAN: trang bao cao sinh phan lon noi dung luc chay — bieu do, nhan so,
van xuoi trong callout, tat ca do svg-kit dung ra. Soi HTML tinh la soi dung cai
phan khong can soi. Do that trong bo thu dau-cuoi: 37 con so va 53 doan dam nam
trong phan JS dung ra, ca hai may do deu khong thay.

Dung nhu module:
    from render_dom import dung_dom
    duong_dan_dom, ghi_chu = dung_dom("bao-cao.html")   # None neu khong dung duoc

Dung nhu script (de kiem tay):
    python render_dom.py <file.html> [file-ra.html]
"""

import os
import re
import sys
import subprocess
import tempfile

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

# Cac cho Chrome/Edge thuong nam tren Windows, roi den PATH cho may khac.
CHO_TIM = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]

TEN_TRONG_PATH = ["chrome", "chromium", "google-chrome", "msedge"]


def tim_trinh_duyet():
    for p in CHO_TIM:
        if os.path.isfile(p):
            return p
    from shutil import which
    for t in TEN_TRONG_PATH:
        p = which(t)
        if p:
            return p
    return None


def _duong_dan_file_url(path):
    p = os.path.abspath(path).replace("\\", "/")
    return "file:///" + p


def dung_dom(html_path, cho_ms=9000, trinh_duyet=None, giu_lai=False):
    """Tra ve (duong_dan_dom, ghi_chu). duong_dan_dom la None neu khong dung duoc.

    ghi_chu luon la mot cau noi ro da dung duoc hay chua va vi sao — de cho goi
    IN RA cho nguoi doc, chu khong lang le roi ve HTML tinh.
    """
    if not os.path.isfile(html_path):
        return None, "khong doc duoc file: %s" % html_path

    exe = trinh_duyet or tim_trinh_duyet()
    if not exe:
        return None, ("khong tim thay Chrome hay Edge — soi HTML TINH, "
                      "nen moi thu do JS dung ra se KHONG duoc soi")

    ra = os.path.join(tempfile.mkdtemp(prefix="ths-dom-"), "dom.html")
    lenh = [
        exe, "--headless", "--disable-gpu", "--no-sandbox",
        "--virtual-time-budget=%d" % cho_ms,
        "--dump-dom", _duong_dan_file_url(html_path),
    ]
    try:
        kq = subprocess.run(lenh, capture_output=True, timeout=(cho_ms / 1000.0) + 45)
    except subprocess.TimeoutExpired:
        return None, "Chrome qua thoi gian cho (%dms) — soi HTML TINH" % cho_ms
    except Exception as e:
        return None, "khong chay duoc Chrome (%s) — soi HTML TINH" % e

    dom = kq.stdout.decode("utf-8", "replace")
    if len(dom) < 200:
        return None, ("Chrome tra ve DOM rong (%d byte) — soi HTML TINH. stderr: %s"
                      % (len(dom), kq.stderr.decode("utf-8", "replace")[:200]))

    with open(ra, "w", encoding="utf-8") as f:
        f.write(dom)

    goc = os.path.getsize(html_path)
    return ra, ("da dung bang %s: DOM %d byte tu nguon %d byte"
                % (os.path.basename(exe), len(dom.encode("utf-8")), goc))


def boc_van_ban(dom_html):
    """Boc phan chu nguoi doc thay ra khoi DOM. Bo script/style va moi the."""
    s = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", dom_html)
    s = re.sub(r"(?s)<!--.*?-->", " ", s)
    s = re.sub(r"(?s)<[^>]+>", " ", s)
    return s


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    d, ghi_chu = dung_dom(sys.argv[1])
    print(ghi_chu)
    if not d:
        sys.exit(1)
    if len(sys.argv) > 2:
        import shutil
        shutil.copy(d, sys.argv[2])
        print("da ghi ra: %s" % sys.argv[2])
    else:
        print("DOM tam o: %s" % d)
    sys.exit(0)
