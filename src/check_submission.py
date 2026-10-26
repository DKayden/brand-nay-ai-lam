"""Kiểm tra bài dự thi theo các lý do bị loại trong thể lệ. Exit 1 nếu có lỗi chặn."""
import pathlib, re, sys
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
        im = Image.open(p)
        if im.mode != "RGBA" or im.getpixel((0, 0))[3] != 0:
            errors.append(f"PNG không trong suốt ở góc: {path}")


for name in ("logo-ngang", "logo-doc"):
    svg = need(f"01-logo/svg/{name}.svg")
    if svg.exists() and "<text" in svg.read_text(encoding="utf-8"):
        errors.append(f"SVG còn thẻ <text> (chưa chuyển path): {svg}")
    transparent_png(f"01-logo/png/{name}-1024.png")

slogan = need("02-slogan/slogan.md")
if slogan.exists() and "AI làm việc, mình làm chủ." not in slogan.read_text(encoding="utf-8"):
    errors.append("Slogan sai/thiếu trong 02-slogan/slogan.md")

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

shots_dir = ROOT / "06-process/screenshots"
shots = list(shots_dir.glob("*.png")) if shots_dir.exists() else []
if len(shots) < 2:
    errors.append(f"Cần ≥ 2 ảnh chụp quá trình, đang có {len(shots)}")
need("06-process/PROCESS.md")
need("README.md")
need("board/brand-board.png")
need("board/poster-nghe-phang.png")

if errors:
    print("CHẶN ĐĂNG:\n- " + "\n- ".join(errors))
    sys.exit(1)
print("OK: đủ 6 hạng mục + bằng chứng.")
