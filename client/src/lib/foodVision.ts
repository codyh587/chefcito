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
            "https://storage.googleapis.com/mediapipe-models/image_classifier/efficientnet_lite0/int8/latest/efficientnet_lite0.tflite",
        },
        runningMode: "IMAGE",
        maxResults: 10,
        // scoreThreshold: 0.25,
      }),
    );
  }

  return classifierPromise;
}

export async function foodVision(imageElement: HTMLImageElement) {
  const classifier = await getClassifier();
  const result = classifier.classify(imageElement);
  console.log(result);

  return result.classifications[0].categories.map((c) => c.categoryName);
}
