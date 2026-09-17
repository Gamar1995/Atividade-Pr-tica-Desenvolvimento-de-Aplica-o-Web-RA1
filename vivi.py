import math
import os
import random
import sys
import time

# ---------------------------------------------------------------------
# CONFIGURAÇÕES ANSI (24-BIT TRUECOLOR) E CONSTANTES
# ---------------------------------------------------------------------
RESET = "\033[0m"
BOLD = "\033[1m"
HIDE = "\033[?25l"
SHOW = "\033[?25h"
CLEAR = "\033[2J\033[H"

def rgb(r: int, g: int, b: int) -> str:
    return f"\033[38;2;{r};{g};{b}m"

def neon_wave(t: float, offset: float = 0.0) -> str:
    r = int(127 * (math.sin(t + offset) + 1))
    g = int(127 * (math.sin(t + offset + 2.094) + 1))
    b = int(127 * (math.sin(t + offset + 4.188) + 1))
    return rgb(r, g, b)

# ---------------------------------------------------------------------
# PARTÍCULAS ESTELARES DE FUNDO
# ---------------------------------------------------------------------
class Particle:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.x = random.randint(0, w - 1)
        self.y = random.randint(0, h - 1)
        self.char = random.choice(["✦", "✧", "⋆", "｡", "*", "•"])
        self.speed = random.uniform(0.3, 0.8)

    def update(self):
        self.y += self.speed
        if self.y >= self.h:
            self.y = 0.0
            self.x = random.randint(0, self.w - 1)

# ---------------------------------------------------------------------
# MOTOR GRÁFICO: CORAÇÃO MATEMÁTICO E TRIBUTO
# ---------------------------------------------------------------------
class ViviEngine:
    def __init__(self, w: int = 80, h: int = 30):
        self.w, self.h = w, h
        self.stars = [Particle(w, h) for _ in range(45)]
        self.msg1 = "♛  V I V I   É   G O S T O S A  ♛"
        self.msg2 = "✦ FATO UNIVERSALMENTE COMPROVADO ✦"

    def draw_frame(self, t: float) -> str:
        pulse = 1.0 + 0.12 * math.sin(t * 4.5)
        buf = [[" " for _ in range(self.w)] for _ in range(self.h)]
        color = [["" for _ in range(self.w)] for _ in range(self.h)]

        for s in self.stars:
            s.update()
            sy, sx = int(s.y), int(s.x)
            if 0 <= sy < self.h and 0 <= sx < self.w:
                buf[sy][sx], color[sy][sx] = s.char, rgb(95, 105, 150)

        for y in range(self.h):
            for x in range(self.w):
                nx = (x - self.w / 2) / (19.0 * pulse)
                ny = -(y - self.h / 2 + 1) / (9.5 * pulse)
                if (nx * nx + ny * ny - 1) ** 3 - (nx * nx) * (ny ** 3) <= 0:
                    buf[y][x] = "█"
                    color[y][x] = neon_wave(t * 2.0, (nx + ny) * 1.5)

        m1_x, m1_y = max(0, (self.w - len(self.msg1)) // 2), self.h // 2 - 1
        for i, ch in enumerate(self.msg1):
            buf[m1_y][m1_x + i] = ch
            color[m1_y][m1_x + i] = f"{BOLD}{rgb(255, 255, 255)}"

        m2_x, m2_y = max(0, (self.w - len(self.msg2)) // 2), self.h // 2 + 1
        for i, ch in enumerate(self.msg2):
            buf[m2_y][m2_x + i] = ch
            color[m2_y][m2_x + i] = f"{BOLD}{neon_wave(t * 3.2)}"

        rows = ["".join(f"{color[y][x]}{buf[y][x]}{RESET}" for x in range(self.w)) for y in range(self.h)]
        return CLEAR + "\n".join(rows)

    def run(self):
        os.system("")
        sys.stdout.write(HIDE)
        start = time.time()
        try:
            while True:
                sys.stdout.write(self.draw_frame(time.time() - start))
                sys.stdout.flush()
                time.sleep(0.035)
        except KeyboardInterrupt:
            pass
        finally:
            sys.stdout.write(SHOW + CLEAR + RESET)
            print(f"\n{BOLD}{rgb(255, 80, 130)}[!] Axioma finalizado com sucesso.{RESET}\n")

if __name__ == "__main__":
    ViviEngine().run()