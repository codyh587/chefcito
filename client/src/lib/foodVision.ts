import { FilesetResolver, ImageClassifier } from "@mediapipe/tasks-vision";

let classifierPromise: Promise<ImageClassifier> | null = null;

function getClassifier(): Promise<ImageClassifier> {
  if (!classifierPromise) {
    classifierPromise = FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    ).then((vision) =>
      ImageClassifier.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/image_classifier/efficientnet_lite0/float32/latest/efficientnet_lite0.tflite",
        },
        runningMode: "IMAGE",
        maxResults: 10,
        categoryDenylist: [
          "refrigerator",
          "shopping basket",
          "hamper",
          "shopping cart",
          "grocery store",
          "tennis ball",
          "bakery",
          "medicine chest",
          "plate rack",
          "butcher shop",
          "crate",
        ],
      }),
    );
  }

  return classifierPromise;
}

export async function foodVision(imageElement: HTMLImageElement) {
  const classifier = await getClassifier();
  const result =
    classifier.classify(imageElement).classifications[0].categories;

  const aboveThreshold = result.filter((c) => c.score >= 0.2);
  if (aboveThreshold.length > 0) {
    return aboveThreshold.map((c) => c.categoryName);
  }

  return result.filter((c) => c.score > 0.01).map((c) => c.categoryName);
}
