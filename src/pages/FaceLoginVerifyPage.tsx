//src/pages/FaceLoginVerifyPage.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';
import { computeAverageLuminance } from '../utils/imageUtils';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import * as faceapi from 'face-api.js';
import { loadModels } from '../utils/faceRecognition';

function FaceLoginVerifyPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { error, setUser } = useAuth();
  // We'll just use our own captureError state:
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [captureError, setCaptureError] = useState<string>('');
  const [email, setEmail] = useState('');


  
  
  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setCaptureError('Unable to access camera. Please ensure camera permissions are granted.');
      }
    };

    initCamera();

    return () => {
      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Load face-api models
  useEffect(() => {
    const initModels = async () => {
      try {
        await loadModels();
        setModelsReady(true);
        console.log('Face recognition models loaded');
      } catch (err) {
        console.error('Failed to load models:', err);
        setCaptureError('Failed to load face recognition models. Please refresh and try again.');
      }
    };

    initModels();
  }, []);

  const handleCapture = async () => {
    console.log('🟡 Capture button clicked');

    if (!videoRef.current || !modelsReady) {
      setCaptureError('Camera or models not ready. Please wait and try again.');
      return;
    }

    if (!email) {
      setCaptureError('Please enter your email before capturing.');
      return;
    }

    setIsCapturing(true);
    setCaptureError('');

    try {
      const video = videoRef.current;
      
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      const width = 320;
      const height = (video.videoHeight / video.videoWidth) * width;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(video, 0, 0, width, height);

      // Check lighting conditions
      const luminance = computeAverageLuminance(ctx, width, height);
      if (luminance < 40) {
        throw new Error('Too dark—please increase lighting or move to a brighter area.');
      }

      // Detect face and get descriptor
      console.log('Detecting face...');
      const detection = await faceapi
        .detectSingleFace(canvas)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No face detected. Please align your face in the frame and try again.');
      }

      // Check face size
      const { box } = detection.detection;
      const faceArea = box.width * box.height;
      const frameArea = width * height;
      if (faceArea / frameArea < 0.10) {
        throw new Error('Move closer so your face fills more of the frame.');
      }

      if (!detection.descriptor) {
        throw new Error('Failed to extract face features. Please try again.');
      }

      // Convert Float32Array to regular array for JSON serialization
      const descriptorArray = Array.from(detection.descriptor);
      
      console.log('Face descriptor extracted, logging in user...');

      // Login user with face data
      const response = await fetch(`${API_URL}/api/auth/face-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          descriptor: descriptorArray,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Face login failed');
      }

      console.log('Face login successful (cookie set)');
     // ✅ Update the auth state so protected routes recognize user as logged in
     if (result.user) {
       setUser(result.user);
     }
      navigate('/dashboard');

    } catch (err: any) {
      console.error('Capture error:', err);
      setCaptureError(err.message || 'Face capture failed. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="py-8 px-4 sm:px-10">
          <div className="mb-6">
            <Link to="/login" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Face Login Verification
            </motion.h2>
            <motion.p 
              className="mt-2 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Position your face in the frame and capture to login
            </motion.p>
          </div>

          {(error || captureError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error || captureError}</span>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Camera Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-auto max-h-96 object-cover"
              />
              
              {/* Face detection overlay */}
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-50 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-full opacity-70"></div>
              </div>
              
              {/* Status indicators */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${modelsReady ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-white text-sm">
                  {modelsReady ? 'Ready' : 'Loading...'}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Position your face within the circle</li>
                <li>• Ensure good lighting</li>
                <li>• Look directly at the camera</li>
                <li>• Keep your face steady</li>
              </ul>
            </div>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full border rounded px-3 py-2 mb-3"
            />

            
            {/* Capture Button */}
            <Button
              type="button"
              fullWidth
              size="lg"
              onClick={handleCapture}
              //disabled={isCapturing || !modelsReady}
              className="flex items-center justify-center"
            >
              {isCapturing ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Face
                </>
              )}
            </Button>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-gray-600">
              Having trouble?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to password login
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FaceLoginVerifyPage;
