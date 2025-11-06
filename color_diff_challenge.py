# color_diff_challenge.py
import cv2
import numpy as np
import argparse
import os

def detect_grid(img, grid_size=None):
    h, w, _ = img.shape
    # 自动估算方格数（假设为正方形且分布均匀）
    if grid_size is None:
        # 尝试用边缘检测和轮廓找方格
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        rects = [cv2.boundingRect(c) for c in contours if cv2.contourArea(c) > 100]
        # 过滤出近似正方形的区域
        squares = [r for r in rects if abs(r[2]-r[3]) < 5]
        if squares:
            grid_size = min(squares[0][2], squares[0][3])
        else:
            grid_size = min(h, w) // 10  # 默认10行/列
    return grid_size

def get_grid_boxes(img, grid_size):
    h, w, _ = img.shape
    boxes = []
    for y in range(0, h-grid_size+1, grid_size):
        for x in range(0, w-grid_size+1, grid_size):
            boxes.append((x, y, grid_size, grid_size))
    return boxes

def box_mean_color(img, box):
    x, y, w, h = box
    roi = img[y:y+h, x:x+w]
    mean = np.mean(roi.reshape(-1, 3), axis=0)
    return mean

def find_outlier_box(img, boxes):
    colors = np.array([box_mean_color(img, b) for b in boxes])
    # 计算每个方格与其它方格的平均色差
    diffs = []
    for i, c in enumerate(colors):
        others = np.delete(colors, i, axis=0)
        diff = np.mean(np.linalg.norm(others - c, axis=1))
        diffs.append(diff)
    idx = np.argmax(diffs)
    return boxes[idx], diffs[idx]

def visualize(img, box, out_path):
    vis = img.copy()
    x, y, w, h = box
    cv2.rectangle(vis, (x, y), (x+w, y+h), (255,0,0), 3)
    cx, cy = x+w//2, y+h//2
    cv2.circle(vis, (cx, cy), 5, (0,255,0), -1)
    cv2.imwrite(out_path, cv2.cvtColor(vis, cv2.COLOR_RGB2BGR))

def main():
    parser = argparse.ArgumentParser(description='Find the color outlier grid in an image.')
    parser.add_argument('img', help='Path to image file')
    parser.add_argument('--grid', type=int, default=None, help='Grid size (pixels), auto if not set')
    parser.add_argument('--out', default='color_outlier_vis.png', help='Output visualization filename')
    args = parser.parse_args()

    img = cv2.imread(args.img, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f'Cannot read image: {args.img}')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    grid_size = detect_grid(img, args.grid)
    boxes = get_grid_boxes(img, grid_size)
    outlier_box, diff_val = find_outlier_box(img, boxes)
    x, y, w, h = outlier_box
    cx, cy = x+w//2, y+h//2
    print(f'最明显颜色差异方格坐标: 左上({x},{y}), 中心({cx},{cy}), 方格大小: {w}x{h}, 色差值: {diff_val:.2f}')
    visualize(img, outlier_box, args.out)
    print(f'已生成标注图片: {args.out}')

if __name__ == '__main__':
    main()
