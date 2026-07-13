"""Merge the RDD2022 China Drone set (drone road images) with the Italy
Road Damage dataset (real GoPro/phone road images) into one combined
YOLO dataset with a shared, simplified 3-class scheme:

  0 crack     (merged from RDD2022 longitudinal/transverse/alligator crack
               and the Italy dataset's generic "crack" class)
  1 pothole
  2 manhole   (only present in the Italy dataset)

Output layout:

  datasets/roadsense-v2/images/{train,val,test}
  datasets/roadsense-v2/labels/{train,val,test}

Usage:
  python training_scripts\\prepare_combined_dataset.py
"""

import argparse
import json
import random
import shutil
from pathlib import Path

from env_paths import configure_project_caches

configure_project_caches()

PROJECT_ROOT = Path(__file__).resolve().parents[1]

RDD_SOURCE = PROJECT_ROOT / "datasets" / "roadsense"
ITALY_SOURCE = PROJECT_ROOT / "datasets" / "raw" / "road-damage-italy" / "data"
OUTPUT_ROOT = PROJECT_ROOT / "datasets" / "roadsense-v2"

# 0 longitudinal_crack, 1 transverse_crack, 2 alligator_crack, 3 pothole -> merged scheme
RDD_CLASS_REMAP = {0: 0, 1: 0, 2: 0, 3: 1}

# Italy COCO category id -> merged scheme (category names: 0 pothole, 1 crack, 2 manhole)
ITALY_CLASS_REMAP = {0: 1, 1: 0, 2: 2}

SPLIT_RATIOS = {"train": 0.8, "val": 0.1, "test": 0.1}


def remap_rdd2022(output_root: Path) -> int:
    count = 0
    for split in ("train", "val", "test"):
        images_dir = RDD_SOURCE / "images" / split
        labels_dir = RDD_SOURCE / "labels" / split
        out_images_dir = output_root / "images" / split
        out_labels_dir = output_root / "labels" / split
        out_images_dir.mkdir(parents=True, exist_ok=True)
        out_labels_dir.mkdir(parents=True, exist_ok=True)

        for image_path in sorted(images_dir.glob("*")):
            label_path = labels_dir / f"{image_path.stem}.txt"
            if not label_path.exists():
                continue

            remapped_lines = []
            for line in label_path.read_text(encoding="utf-8").splitlines():
                parts = line.strip().split()
                if not parts:
                    continue
                old_class = int(parts[0])
                new_class = RDD_CLASS_REMAP.get(old_class)
                if new_class is None:
                    continue
                remapped_lines.append(" ".join([str(new_class), *parts[1:]]))

            if not remapped_lines:
                continue

            dest_name = f"rdd_{image_path.name}"
            shutil.copy2(image_path, out_images_dir / dest_name)
            (out_labels_dir / f"rdd_{image_path.stem}.txt").write_text(
                "\n".join(remapped_lines) + "\n", encoding="utf-8"
            )
            count += 1

    return count


def convert_box(image_width: int, image_height: int, bbox: list[float]) -> tuple[float, float, float, float]:
    x, y, width, height = bbox
    x_center = (x + width / 2) / image_width
    y_center = (y + height / 2) / image_height
    return x_center, y_center, width / image_width, height / image_height


def remap_italy(output_root: Path, seed: int) -> int:
    annotations_path = ITALY_SOURCE / "annotations_coco.json"
    images_dir = ITALY_SOURCE / "images"
    data = json.loads(annotations_path.read_text(encoding="utf-8"))

    images_by_id = {image["id"]: image for image in data["images"]}
    labels_by_image: dict[int, list[str]] = {}

    for annotation in data["annotations"]:
        image_id = annotation["image_id"]
        category_id = annotation["category_id"]
        new_class = ITALY_CLASS_REMAP.get(category_id)
        if new_class is None:
            continue

        image = images_by_id[image_id]
        x_center, y_center, width, height = convert_box(image["width"], image["height"], annotation["bbox"])
        labels_by_image.setdefault(image_id, []).append(
            f"{new_class} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}"
        )

    image_ids = sorted(labels_by_image.keys())
    random.Random(seed).shuffle(image_ids)

    total = len(image_ids)
    train_end = int(total * SPLIT_RATIOS["train"])
    val_end = train_end + int(total * SPLIT_RATIOS["val"])

    split_assignment: dict[int, str] = {}
    for index, image_id in enumerate(image_ids):
        if index < train_end:
            split_assignment[image_id] = "train"
        elif index < val_end:
            split_assignment[image_id] = "val"
        else:
            split_assignment[image_id] = "test"

    count = 0
    for image_id, split in split_assignment.items():
        image = images_by_id[image_id]
        source_image = images_dir / image["file_name"]
        if not source_image.exists():
            continue

        out_images_dir = output_root / "images" / split
        out_labels_dir = output_root / "labels" / split
        out_images_dir.mkdir(parents=True, exist_ok=True)
        out_labels_dir.mkdir(parents=True, exist_ok=True)

        dest_stem = f"italy_{Path(image['file_name']).stem}"
        shutil.copy2(source_image, out_images_dir / f"{dest_stem}{Path(image['file_name']).suffix}")
        (out_labels_dir / f"{dest_stem}.txt").write_text(
            "\n".join(labels_by_image[image_id]) + "\n", encoding="utf-8"
        )
        count += 1

    return count


def write_data_yaml(output_root: Path) -> None:
    content = (
        f"path: ./datasets/{output_root.name}\n"
        "train: images/train\n"
        "val: images/val\n"
        "test: images/test\n"
        "\n"
        "names:\n"
        "  0: crack\n"
        "  1: pothole\n"
        "  2: manhole\n"
    )
    (PROJECT_ROOT / "data.yaml").write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=42, help="Random seed for the Italy dataset split.")
    args = parser.parse_args()

    if OUTPUT_ROOT.exists():
        shutil.rmtree(OUTPUT_ROOT)

    rdd_count = remap_rdd2022(OUTPUT_ROOT)
    italy_count = remap_italy(OUTPUT_ROOT, args.seed)
    write_data_yaml(OUTPUT_ROOT)

    for split in ("train", "val", "test"):
        image_count = len(list((OUTPUT_ROOT / "images" / split).glob("*")))
        print(f"{split}: {image_count} images")

    print(f"RDD2022 images copied: {rdd_count}")
    print(f"Italy images copied: {italy_count}")
    print(f"Combined dataset written to: {OUTPUT_ROOT}")
    print("data.yaml updated to point at the combined dataset with 3 classes (crack, pothole, manhole).")


if __name__ == "__main__":
    main()
