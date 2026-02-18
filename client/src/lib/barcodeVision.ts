import { BarcodeDetector } from "barcode-detector";

const barcodeDetector = new BarcodeDetector({
  formats: ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"],
});

export async function barcodeVision(imageElement: HTMLImageElement) {
  let barcodes = [];

  try {
    barcodes = await barcodeDetector.detect(imageElement);
    if (barcodes.length === 0) {
      return [];
    }
  } catch (error) {
    console.error("Barcode detection error:", error);
    return [];
  }

  const results = await Promise.all(
    barcodes.map(async ({ rawValue }) => {
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${rawValue}.json`,
        );
        const data = await response.json();
        return (data.product.product_name || data.product.generic_name) ?? null;
      } catch {
        return null;
      }
    }),
  );

  return results.filter((name): name is string => name !== null);
}
