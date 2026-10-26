"""Poster Nghé 3D qua Gemini. Ngân sách cứng: tối đa 15 lần gọi và 2 USD ước tính (đếm trong gemini-log.md).

Mọi lần gọi (kể cả lỗi) đều được ghi một dòng "- call N" vào log TRƯỚC khi kết thúc, nên bộ đếm không bị lọt.
Dùng: python -I src/gemini_poster.py [ghi chú sửa lỗi]   (env GEMINI_MODEL để đổi model dự phòng)
"""
import base64, json, os, pathlib, re, sys, urllib.error, urllib.request

MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.1-flash-image")
LOG = pathlib.Path("06-process/gemini-log.md")
OUT_DIR = pathlib.Path("explore/gemini")
REF = pathlib.Path("03-mascot/png/nghe-nghe-1024.png")
MAX_CALLS = 15
MAX_USD = 2.00
USD_PER_IMAGE = 0.07  # ~$0.067 / ảnh 1K (giá niêm yết, xem đầu log) làm tròn lên

PROMPT = """Render this exact character as a soft 3D clay-style mascot poster, 4:5 vertical.
Keep EVERY locked trait identical to the reference: baby water buffalo (nghé), chibi proportions (big head ~55% of height),
warm grey-brown body #8C7B70 with a navy (#1F3A5F) outline feel, a small tuft of hair on the forehead,
cream crescent horns that sweep out sideways then curve up, droopy side ears with pink inner,
broad rounded grey-pink (mauve, #BA8F89) water-buffalo muzzle with two bean-shaped nostrils, small open smiling mouth,
round black eyes with one white highlight, pink cheeks,
pastel blue (#B8D8F5) employee ID badge on a deep blue (#2B5C8A) lanyard, the badge reads "Nghé" in large navy letters.
Pose: waving hello with one raised hoof, cheerful. Background: airy pastel blue #B8D8F5 fading to white #F7FAFD, a small iced milk coffee cup beside.
No text other than the badge. No other characters. Do not change the design."""

CALL_RE = re.compile(r"^- call (\d+): (ok|error)", re.M)


def _log_text() -> str:
    return LOG.read_text(encoding="utf-8-sig") if LOG.exists() else ""


def calls_used() -> int:
    return len(CALL_RE.findall(_log_text()))


def usd_spent() -> float:
    return sum(USD_PER_IMAGE for _, status in CALL_RE.findall(_log_text()) if status == "ok")


def _append(line: str) -> None:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write("\n" + line)


def main(note: str = "") -> None:
    n, spent = calls_used(), usd_spent()
    if n >= MAX_CALLS:
        sys.exit(f"Hết ngân sách: đã gọi {n}/{MAX_CALLS} lần. Dùng poster SVG phẳng.")
    if spent + USD_PER_IMAGE > MAX_USD:
        sys.exit(f"Hết ngân sách: ước tính {spent:.2f} USD, gọi thêm sẽ vượt {MAX_USD:.2f} USD.")
    ref = base64.b64encode(REF.read_bytes()).decode()
    body = {"contents": [{"parts": [{"text": PROMPT + ("\n" + note if note else "")},
                                    {"inline_data": {"mime_type": "image/png", "data": ref}}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "4:5"}}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
        data=json.dumps(body).encode(), method="POST",
        headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
    k = n + 1
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            res = json.load(r)
        parts = res["candidates"][0]["content"]["parts"]
        img = next(p for p in parts if "inlineData" in p or "inline_data" in p)
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors="replace")[:900].replace("\n", " ")
        _append(f"- call {k}: error — model {MODEL} — HTTP {e.code}: {msg} — est. total {spent:.2f} USD")
        sys.exit(f"call {k} lỗi HTTP {e.code}: {msg}")
    except Exception as e:  # mạng, timeout, phản hồi không có ảnh
        _append(f"- call {k}: error — model {MODEL} — {type(e).__name__}: {str(e)[:200]} — est. total {spent:.2f} USD")
        sys.exit(f"call {k} lỗi: {type(e).__name__}: {e}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"poster-{k:02d}.png"
    out.write_bytes(base64.b64decode((img.get("inlineData") or img["inline_data"])["data"]))
    spent += USD_PER_IMAGE
    _append(f"- call {k}: ok — model {MODEL} — {out.as_posix()} — note: {note or '(none)'} — est. total {spent:.2f} USD")
    print(out, f"(call {k}/{MAX_CALLS}, est. {spent:.2f} USD)")


if __name__ == "__main__":
    main(" ".join(sys.argv[1:]))
