# color_diff_auto_grid.py
import cv2
import numpy as np
import argparse
import os

def auto_detect_grid(img):
    h, w, _ = img.shape
    # 灰度化+自适应阈值，适应浅色背景
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 21, 10)
    # 形态学开运算去除小噪点
    kernel = np.ones((3,3), np.uint8)
    clean = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=2)
    # 查找所有方块轮廓
    contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    rects = [cv2.boundingRect(c) for c in contours if cv2.contourArea(c) > 50]
    # 按左上坐标排序
    rects.sort(key=lambda r: (r[1], r[0]))
    # 估算行列数
    ys = sorted(set([r[1] for r in rects]))
    xs = sorted(set([r[0] for r in rects]))
    rows = len(ys)
    cols = len(xs)
    # 生成所有方块信息
    boxes = []
    for i, r in enumerate(rects):
        x, y, w, h = r
        row = ys.index(y) + 1
        col = xs.index(x) + 1
        boxes.append({'row': row, 'col': col, 'x': x, 'y': y, 'w': w, 'h': h})
    return boxes, rows, cols

def box_mean_color(img, box):
    x, y, w, h = box['x'], box['y'], box['w'], box['h']
    roi = img[y:y+h, x:x+w]
    mean = np.mean(roi.reshape(-1, 3), axis=0)
    return mean

def find_subtle_outlier_box(img, boxes):
    colors = np.array([box_mean_color(img, b) for b in boxes])
    mean_color = np.mean(colors, axis=0)
    diffs = np.linalg.norm(colors - mean_color, axis=1)
    idx = np.argmax(diffs)
    return boxes[idx], diffs[idx]

def visualize(img, box, out_path):
    vis = img.copy()
    x, y, w, h = box['x'], box['y'], box['w'], box['h']
    cv2.rectangle(vis, (x, y), (x+w, y+h), (255,0,0), 3)
    cx, cy = x+w//2, y+h//2
    cv2.circle(vis, (cx, cy), 5, (0,255,0), -1)
    cv2.imwrite(out_path, cv2.cvtColor(vis, cv2.COLOR_RGB2BGR))

def main():
    parser = argparse.ArgumentParser(description='Auto-detect grid and find the color outlier.')
    parser.add_argument('img', help='Path to image file')
    parser.add_argument('--out', default='color_outlier_auto_vis.png', help='Output visualization filename')
    args = parser.parse_args()

    img = cv2.imread(args.img, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f'Cannot read image: {args.img}')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    boxes, rows, cols = auto_detect_grid(img)
    print(f'自动检测到方块数：{rows}行 × {cols}列，总计 {len(boxes)} 个方块')
    outlier_box, diff_val = find_subtle_outlier_box(img, boxes)
    print(f'颜色差异最大方块：第{outlier_box["row"]}行，第{outlier_box["col"]}列')
    print(f'左上像素坐标: ({outlier_box["x"]},{outlier_box["y"]}), 色差值: {diff_val:.2f}')
    visualize(img, outlier_box, args.out)
    print(f'已生成标注图片: {args.out}')

if __name__ == '__main__':
    main()
