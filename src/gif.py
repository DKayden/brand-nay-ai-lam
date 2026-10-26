"""Ghép GIF ngắn: Nghé gõ laptop (nhấp nhô) rồi bật 'Xong rồi sếp!'. Tổng < 15 giây."""
import sys
from PIL import Image

BG = (255, 244, 228, 255)  # COLORS.background

def frame(path: str, dy: int) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    canvas = Image.new("RGBA", (512, 540), BG)
    canvas.alpha_composite(im, (0, 14 + dy))
    return canvas.convert("P", palette=Image.ADAPTIVE)

def main(out: str = "board/nghe-xong-roi-sep.gif") -> None:
    run = [frame("03-mascot/png/dang-chay-512.png", dy) for dy in (0, -6, 0, -6, 0, -6, 0, -6)]
    done = [frame("03-mascot/png/xong-roi-sep-512.png", dy) for dy in (-14, 0)]
    frames = run + done
    durations = [180] * len(run) + [200, 1800]
    assert sum(durations) <= 15000
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=durations, loop=0, disposal=2)
    print(out, sum(durations), "ms")

if __name__ == "__main__":
    main(*sys.argv[1:])
