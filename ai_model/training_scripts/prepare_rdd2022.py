import argparse
import random
import shutil
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from env_paths import configure_project_caches

configure_project_caches()

RDD_CLASS_MAP = {
    "D00": 0,  # longitudinal crack
    "D10": 1,  # transverse crack
    "D20": 2,  # alligator crack
    "D40": 3,  # pothole
}

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp"}


def find_first_existing(root: Path, names: list[str]) -> Path | None:
    lowered = {name.lower() for name in names}
    for path in root.rglob("*"):
        if path.is_dir() and path.name.lower() in lowered:
            return path
    return None


def convert_box(size: tuple[int, int], box: tuple[float, float, float, float]) -> tuple[float, float, float, float]:
    image_width, image_height = size
    xmin, ymin, xmax, ymax = box
    x_center = ((xmin + xmax) / 2) / image_width
    y_center = ((ymin + ymax) / 2) / image_height
    width = (xmax - xmin) / image_width
    height = (ymax - ymin) / image_height
    return x_center, y_center, width, height


def parse_xml(xml_path: Path) -> tuple[str, list[str]] | None:
    root = ET.parse(xml_path).getroot()
    filename_node = root.find("filename")
    size_node = root.find("size")

    if filename_node is None or size_node is None:
        return None

    width_node = size_node.find("width")
    height_node = size_node.find("height")
    if width_node is None or height_node is None:
        return None

    image_width = int(float(width_node.text or 0))
    image_height = int(float(height_node.text or 0))
    if image_width <= 0 or image_height <= 0:
        return None

    labels: list[str] = []
    for obj in root.findall("object"):
        name_node = obj.find("name")
        bndbox = obj.find("bndbox")
        if name_node is None or bndbox is None:
            continue

        class_name = (name_node.text or "").strip()
        if class_name not in RDD_CLASS_MAP:
            continue

        coords = []
        for key in ("xmin", "ymin", "xmax", "ymax"):
            node = bndbox.find(key)
            if node is None or node.text is None:
                break
            coords.append(float(node.text))
        else:
            x_center, y_center, width, height = convert_box((image_width, image_height), tuple(coords))
            labels.append(f"{RDD_CLASS_MAP[class_name]} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}")

    return filename_node.text or "", labels


def prepare(zip_path: Path, output_dir: Path, extract_dir: Path, seed: int, val_ratio: float, test_ratio: float) -> None:
    if not zip_path.exists():
        raise FileNotFoundError(f"Zip not found: {zip_path}")

    extract_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)

    marker = extract_dir / ".extracted"
    if not marker.exists():
        print(f"Extracting {zip_path} to {extract_dir}")
        with zipfile.ZipFile(zip_path) as archive:
            archive.extractall(extract_dir)
        marker.write_text("ok", encoding="utf-8")

    annotations_dir = find_first_existing(extract_dir, ["annotations", "xmls", "xml"])
    images_dir = find_first_existing(extract_dir, ["images", "jpegimages", "jpeg_images"])

    if annotations_dir is None:
        raise FileNotFoundError("Could not find annotations/xml folder inside extracted RDD2022 data")
    if images_dir is None:
        raise FileNotFoundError("Could not find images folder inside extracted RDD2022 data")

    image_lookup = {path.name: path for path in images_dir.rglob("*") if path.suffix.lower() in IMAGE_EXTS}
    samples: list[tuple[Path, list[str]]] = []

    for xml_path in annotations_dir.rglob("*.xml"):
        parsed = parse_xml(xml_path)
        if parsed is None:
            continue
        filename, labels = parsed
        if not labels:
            continue
        image_path = image_lookup.get(filename)
        if image_path is None:
            stem_matches = [path for path in image_lookup.values() if path.stem == xml_path.stem]
            image_path = stem_matches[0] if stem_matches else None
        if image_path is not None:
            samples.append((image_path, labels))

    if not samples:
        raise RuntimeError("No labeled RDD2022 samples were found after conversion")

    random.seed(seed)
    random.shuffle(samples)

    test_count = int(len(samples) * test_ratio)
    val_count = int(len(samples) * val_ratio)
    splits = {
        "test": samples[:test_count],
        "val": samples[test_count:test_count + val_count],
        "train": samples[test_count + val_count:],
    }

    for split, items in splits.items():
        image_out = output_dir / "images" / split
        label_out = output_dir / "labels" / split
        image_out.mkdir(parents=True, exist_ok=True)
        label_out.mkdir(parents=True, exist_ok=True)

        for image_path, labels in items:
            target_image = image_out / image_path.name
            target_label = label_out / f"{image_path.stem}.txt"
            shutil.copy2(image_path, target_image)
            target_label.write_text("\n".join(labels) + "\n", encoding="utf-8")

        print(f"{split}: {len(items)} images")

    print(f"Prepared YOLO dataset at: {output_dir}")


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="Convert RDD2022 Pascal VOC annotations into YOLO format.")
    parser.add_argument("--zip", default=str(project_root / "datasets" / "raw" / "RDD2022_China_Drone.zip"))
    parser.add_argument("--extract-dir", default=str(project_root / "datasets" / "raw" / "RDD2022_China_Drone"))
    parser.add_argument("--output", default=str(project_root / "datasets" / "roadsense"))
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--val-ratio", type=float, default=0.2)
    parser.add_argument("--test-ratio", type=float, default=0.1)
    args = parser.parse_args()

    prepare(
        zip_path=Path(args.zip),
        output_dir=Path(args.output),
        extract_dir=Path(args.extract_dir),
        seed=args.seed,
        val_ratio=args.val_ratio,
        test_ratio=args.test_ratio,
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
