//src/utils/faceRecognition.ts
import * as faceapi from 'face-api.js';
import { API_URL } from '../config';

let modelsLoaded = false;

export const loadModels = async () => {
  try {
    if (!modelsLoaded) {
      console.log('Loading face-api models...');
      const uri = `${API_URL}/models`;
      
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
        faceapi.nets.faceLandmark68Net.loadFromUri(uri),
        faceapi.nets.faceRecognitionNet.loadFromUri(uri),
      ]);
      
      modelsLoaded = true;
      console.log('Face-api models loaded successfully');
    }
  } catch (err) {
    console.error('Model loading error:', err);
    throw err;
  }
};

export const getFaceDescriptor = async (videoElement: HTMLVideoElement) => {
  try {
    const detections = await faceapi
      .detectSingleFace(videoElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      throw new Error('No face detected');
    }

    return detections.descriptor;
  } catch (error) {
    console.error('Error getting face descriptor:', error);
    throw error;
  }
};

export const compareFaceDescriptors = (
  descriptor1: Float32Array,
  descriptor2: Float32Array
): boolean => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance < 0.6; // Adjust threshold as needed
};
