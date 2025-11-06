import cv2
import numpy as np
import argparse

def analyze_color_grid(image_path, rows, cols, visualize=True, threshold=None):
    # 读取图像
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"无法读取图像：{image_path}")
    h, w, _ = img.shape

    # 分割每个格子的区域
    cell_h, cell_w = h // rows, w // cols
    avg_colors = []
    for r in range(rows):
        for c in range(cols):
            y1 = r * cell_h
            y2 = (r+1) * cell_h if r < rows-1 else h
            x1 = c * cell_w
            x2 = (c+1) * cell_w if c < cols-1 else w
            cell = img[y1:y2, x1:x2]
            avg_color = np.mean(cell.reshape(-1, 3), axis=0)
            avg_colors.append(((r+1, c+1), avg_color))  # 1-based index

    # 计算整体平均颜色
    all_colors = np.array([x[1] for x in avg_colors])
    mean_color = np.mean(all_colors, axis=0)

    # 计算每个格子的颜色差
    diffs = []
    for (r, c), color in avg_colors:
        diff = np.linalg.norm(color - mean_color)
        diffs.append(((r, c), diff))

    # 排序
    diffs.sort(key=lambda x: x[1], reverse=True)
    # 自动判定异常格子（色差远高于其它格子）
    if threshold is None:
        if len(diffs) > 1:
            # 取最大和次大色差，若最大远大于次大则只输出最大
            max_diff = diffs[0][1]
            second_diff = diffs[1][1]
            if max_diff > second_diff * 1.5:
                top_cells = [diffs[0]]
            else:
                top_cells = diffs[:10]
        else:
            top_cells = diffs[:1]
    else:
        top_cells = [d for d in diffs if d[1] >= threshold]

    print(f"全图平均颜色：{mean_color}")
    print(f"异常格子：")
    for (r, c), d in top_cells:
        print(f"格子({r},{c}) 差异值: {d:.2f}")

    # 可视化
    if visualize:
        vis = img.copy()
        for (r, c), _ in top_cells:
            y1 = (r-1) * cell_h
            y2 = r * cell_h if r < rows else h
            x1 = (c-1) * cell_w
            x2 = c * cell_w if c < cols else w
            cv2.rectangle(vis, (x1, y1), (x2-1, y2-1), (0, 0, 255), 2)
        cv2.imwrite("result.png", vis)
        print("检测结果已保存为 result.png")

    return top_cells

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="检测方格图片中的颜色差异")
    parser.add_argument("--image", type=str, required=True, help="图片路径")
    parser.add_argument("--rows", type=int, required=True, help="网格行数")
    parser.add_argument("--cols", type=int, required=True, help="网格列数")
    parser.add_argument("--threshold", type=float, default=None, help="色差阈值（可选）")
    args = parser.parse_args()

    analyze_color_grid(args.image, args.rows, args.cols, threshold=args.threshold)
