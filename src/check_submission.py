"""Kiểm tra bài dự thi theo các lý do bị loại trong thể lệ. Exit 1 nếu có lỗi chặn."""
import hashlib, pathlib, re, sys
import xml.etree.ElementTree as ET
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(".")
errors: list[str] = []


def need(path: str) -> pathlib.Path:
    p = ROOT / path
    if not p.exists():
        errors.append(f"Thiếu: {path}")
    return p


def transparent_png(path: str) -> None:
    p = need(path)
    if p.exists():
        try:
            im = Image.open(p)
            im.load()
        except Exception:
            errors.append(f"PNG không mở được: {path}")
            return
        if im.mode != "RGBA" or im.getchannel("A").histogram()[0] < 0.05 * im.width * im.height:
            errors.append(f"PNG không trong suốt (cần RGBA, ≥ 5% điểm ảnh alpha 0): {path}")


for name in ("logo-ngang", "logo-doc"):
    svg = need(f"01-logo/svg/{name}.svg")
    if svg.exists():
        raw = svg.read_text(encoding="utf-8")
        if "<text" in raw:
            errors.append(f"SVG còn thẻ <text> (chưa chuyển path): {svg}")
        try:
            has_path = any(e.tag == "{http://www.w3.org/2000/svg}path" for e in ET.fromstring(raw).iter())
        except ET.ParseError:
            has_path = False
            errors.append(f"SVG không parse được: {svg}")
        else:
            if not has_path:
                errors.append(f"SVG không có phần tử <path>: {svg}")
    transparent_png(f"01-logo/png/{name}-1024.png")

slogan = need("02-slogan/slogan.md")
if slogan.exists():
    st = slogan.read_text(encoding="utf-8")
    if "AI làm việc, mình làm chủ." not in st:
        errors.append("Slogan sai/thiếu trong 02-slogan/slogan.md")
    paras = [x.strip() for x in re.split(r"\n\s*\n", st) if x.strip()]
    if not any("AI làm việc, mình làm chủ." not in x and len(x) >= 60 for x in paras):
        errors.append("02-slogan/slogan.md thiếu đoạn giải thích ý nghĩa (≥ 60 ký tự, ngoài dòng slogan)")

transparent_png("03-mascot/png/nghe-nghe-1024.png")

fonts = need("04-font/fonts.md")
if fonts.exists():
    t = fonts.read_text(encoding="utf-8")
    for f in ("Bricolage Grotesque", "Be Vietnam Pro", "fonts.google.com", "Open Font License"):
        if f not in t:
            errors.append(f"04-font/fonts.md thiếu '{f}'")

voice = need("05-brand-voice/brand-voice.md")
if voice.exists():
    # câu mẫu có nhãn: "- **Nhãn:** "câu""
    samples = re.findall(r"^\s*[-*] \*\*[^*\n]+:\*\*\s*[\"“«]", voice.read_text(encoding="utf-8"), re.M)
    if len(samples) < 3:
        errors.append(f"Brand voice cần ≥ 3 câu mẫu có nhãn (dạng '- **Nhãn:** câu'), đang có {len(samples)}")

design = need("DESIGN.md")
if design.exists():
    t = design.read_text(encoding="utf-8")
    for key in ("colors:", "typography:", "spacing:", "rounded:", "## Do's and Don'ts"):
        if key not in t:
            errors.append(f"DESIGN.md thiếu '{key}'")
    if len(re.findall(r"#[0-9A-Fa-f]{6}", t)) < 5:
        errors.append("DESIGN.md cần ≥ 5 mã màu HEX (#RRGGBB)")
    if not re.search(r"^#{2,4} .*Logo", t, re.M | re.I):
        errors.append("DESIGN.md thiếu mục (heading) về Logo")

shots_dir = ROOT / "06-process/screenshots"
hashes: set[str] = set()
if shots_dir.exists():
    for f in shots_dir.iterdir():
        if f.suffix.lower() not in (".png", ".jpg", ".jpeg"):
            continue
        try:
            with Image.open(f) as im:
                ok = im.width >= 400
        except Exception:
            ok = False
        if ok:
            hashes.add(hashlib.sha256(f.read_bytes()).hexdigest())
if len(hashes) < 2:
    errors.append(f"Cần ≥ 2 ảnh chụp quá trình hợp lệ (PNG/JPG, rộng ≥ 400px, không trùng), đang có {len(hashes)}")
proc = need("06-process/PROCESS.md")
if proc.exists() and "Claude Code" not in proc.read_text(encoding="utf-8"):
    errors.append("06-process/PROCESS.md thiếu tên agent 'Claude Code'")
need("README.md")
need("board/brand-board.png")
need("board/poster-nghe-phang.png")

if errors:
    print("CHẶN ĐĂNG:\n- " + "\n- ".join(errors))
    sys.exit(1)
print("OK: đủ 6 hạng mục + bằng chứng.")
