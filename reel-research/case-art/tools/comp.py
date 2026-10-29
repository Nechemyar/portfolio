"""python comp.py <raw.png> <out.png> g=<screenshot> [c=<screenshot>]
Finds each chroma screen (g = #00FF00, c = #00FFFF), fits its quad, warps the real screenshot
into it and uses the chroma mask as alpha so bezels, the Dynamic Island and overlaps stay on top."""
import sys, cv2, numpy as np

HUE = {"g": (45, 75), "c": (82, 98)}  # OpenCV hue (0-180)


def mask_for(hsv, k):
    lo, hi = HUE[k]
    m = cv2.inRange(hsv, (lo, 110, 90), (hi, 255, 255))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n < 2:
        return None
    big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    return (lab == big).astype(np.uint8) * 255


def line_fit(pts):
    vx, vy, x0, y0 = cv2.fitLine(pts.astype(np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    return np.array([x0, y0]), np.array([vx, vy])


def intersect(a, b):
    (p, d), (q, e) = a, b
    t = np.linalg.solve(np.array([d, -e]).T, q - p)[0]
    return p + t * d


def quad(m):
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea).reshape(-1, 2)
    hull = cv2.convexHull(c).reshape(-1, 2)
    # rough corners: extreme points along the four diagonals
    s, d = c.sum(1), c[:, 0] - c[:, 1]
    rough = np.array([c[s.argmin()], c[d.argmax()], c[s.argmax()], c[d.argmin()]], float)  # tl tr br bl
    # refine: fit a line to the middle 60% of contour points nearest each side, intersect
    lines = []
    for i in range(4):
        a, b = rough[i], rough[(i + 1) % 4]
        ab = b - a; L = np.linalg.norm(ab); u = ab / L; nrm = np.array([-u[1], u[0]])
        rel = c - a; t = rel @ u / L; dist = np.abs(rel @ nrm)
        sel = c[(t > .2) & (t < .8) & (dist < max(6, .03 * L))]
        lines.append(line_fit(sel) if len(sel) > 10 else (a, u))
    return np.array([intersect(lines[i - 1], lines[i]) for i in range(4)], np.float32)[[0, 1, 2, 3]], rough


def place(img, m, shot_path):
    q, _ = quad(m)
    # order is tl, tr, br, bl but intersect(lines[i-1], lines[i]) yields corner i shared by sides i-1,i
    shot = cv2.imread(shot_path)
    w_q = (np.linalg.norm(q[1] - q[0]) + np.linalg.norm(q[2] - q[3])) / 2
    h_q = (np.linalg.norm(q[3] - q[0]) + np.linalg.norm(q[2] - q[1])) / 2
    ar = w_q / h_q
    H, W = shot.shape[:2]
    if W / H > ar:  # crop width from the centre
        nw = int(H * ar); x = (W - nw) // 2; shot = shot[:, x:x + nw]
    else:  # crop height from the bottom, keep the top of the page
        shot = shot[:int(W / ar), :]
    H, W = shot.shape[:2]
    src = np.float32([[0, 0], [W, 0], [W, H], [0, H]])
    M = cv2.getPerspectiveTransform(src, q)
    warped = cv2.warpPerspective(shot, M, (img.shape[1], img.shape[0]), flags=cv2.INTER_AREA)
    a = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=1)
    a = cv2.GaussianBlur(a, (3, 3), 0).astype(np.float32)[..., None] / 255
    return (img * (1 - a) + warped * a).astype(np.uint8), q


def despill(img, band):
    b, g, r = cv2.split(img.astype(np.int16))
    g2 = np.where(band > 0, np.minimum(g, np.maximum(r, b) + 10), g)  # only the fringe ring around each screen
    return cv2.merge([b, g2, r]).clip(0, 255).astype(np.uint8)


if __name__ == "__main__":
    raw, out, *pairs = sys.argv[1:]
    img = cv2.imread(raw)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    band = np.zeros(img.shape[:2], np.uint8)
    for pr in pairs:
        k, path = pr.split("=", 1)
        m = mask_for(hsv, k)
        if m is None:
            print("NO SCREEN FOUND for", k); sys.exit(3)
        img, q = place(img, m, path)
        k9 = np.ones((9, 9), np.uint8)
        band |= cv2.dilate(m, k9) & ~cv2.dilate(m, np.ones((3, 3), np.uint8))  # just outside the screen
        print(k, "quad", q.round(1).tolist(), "area", int(m.sum() / 255))
    img = despill(img, band)
    left = sum(int(cv2.countNonZero(cv2.inRange(cv2.cvtColor(img, cv2.COLOR_BGR2HSV), (HUE[k][0], 110, 90), (HUE[k][1], 255, 255)))) for k in HUE)
    print("chroma px left", left)
    cv2.imwrite(out, img)
