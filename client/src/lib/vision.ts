import { FilesetResolver, ObjectDetector } from "@mediapipe/tasks-vision";
import { BarcodeDetector } from "barcode-detector";

export async function detectImage(imageElement: HTMLImageElement) {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  const detector = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite",
    },
    scoreThreshold: 0.5,
    runningMode: "IMAGE",
  });

  return detector.detect(imageElement);
}

export async function scanBarcode(imageElement: HTMLImageElement) {
  const barcodeDetector = new BarcodeDetector({
    formats: ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"],
  });

  try {
    const barcodes = await barcodeDetector.detect(imageElement);
    if (barcodes.length > 0) {
      return barcodes[0].rawValue;
    }
    return null;
  } catch (error) {
    console.error("Barcode detection error:", error);
    return null;
  }
}

export async function getProductNameFromBarcode(barcode: string) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
    );
    const data = await response.json();
    if (data.status === 1 && data.product) {
      return data.product.product_name || data.product.generic_name;
    }
    return null;
  } catch (err) {
    return null;
  }
}
