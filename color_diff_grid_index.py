# color_diff_grid_index.py
import cv2
import numpy as np
import argparse
import os

def get_grid_boxes(img, grid_size, offset_x=0, offset_y=0, rows=26, cols=26):
    boxes = []
    for row in range(rows):
        for col in range(cols):
            x = offset_x + col * grid_size
            y = offset_y + row * grid_size
            boxes.append({'row': row+1, 'col': col+1, 'x': x, 'y': y, 'w': grid_size, 'h': grid_size})
    return boxes

def box_mean_color(img, box):
    x, y, w, h = box['x'], box['y'], box['w'], box['h']
    roi = img[y:y+h, x:x+w]
    mean = np.mean(roi.reshape(-1, 3), axis=0)
    return mean

def find_subtle_outlier_box(img, boxes):
    colors = np.array([box_mean_color(img, b) for b in boxes])
    mean_color = np.mean(colors, axis=0)
    diffs = np.linalg.norm(colors - mean_color, axis=1)
    # 找出色差略大的方块（排除极端异常，选最大但在合理范围内）
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
    parser = argparse.ArgumentParser(description='Find the subtly different color grid and output its row/col index.')
    parser.add_argument('img', help='Path to image file')
    parser.add_argument('--grid', type=int, default=27, help='Grid size (pixels), default 27')
    parser.add_argument('--offset_x', type=int, default=27, help='Left offset (pixels), default 27')
    parser.add_argument('--offset_y', type=int, default=27, help='Top offset (pixels), default 27')
    parser.add_argument('--rows', type=int, default=26, help='Number of rows, default 26')
    parser.add_argument('--cols', type=int, default=26, help='Number of columns, default 26')
    parser.add_argument('--out', default='color_outlier_grid_vis.png', help='Output visualization filename')
    args = parser.parse_args()

    img = cv2.imread(args.img, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f'Cannot read image: {args.img}')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    boxes = get_grid_boxes(img, args.grid, args.offset_x, args.offset_y, args.rows, args.cols)
    outlier_box, diff_val = find_subtle_outlier_box(img, boxes)
    print(f'颜色差异最大方块：第{outlier_box["row"]}行，第{outlier_box["col"]}列')
    print(f'左上像素坐标: ({outlier_box["x"]},{outlier_box["y"]}), 色差值: {diff_val:.2f}')
    visualize(img, outlier_box, args.out)
    print(f'已生成标注图片: {args.out}')

if __name__ == '__main__':
    main()
