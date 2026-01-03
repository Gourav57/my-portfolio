import {
  ObjectDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const startScreen = document.getElementById("startScreen");

let objectDetector;
let runningMode = "VIDEO";
let lastVideoTime = -1;

// 1. LOAD THE SMART MODEL
const initializeObjectDetector = async () => {
  try {
      statusText.innerText = "LOADING EFFICIENT-DET BRAIN...";
      
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
      );

      objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite2/float32/1/efficientdet_lite2.tflite",
          delegate: "GPU"
        },
        scoreThreshold: 0.30, 
        runningMode: runningMode
      });
      
      statusText.innerText = "SYSTEM READY // AWAITING INPUT";
      // Enable the button once model is ready
      document.querySelector("button").innerText = "INITIALIZE SYSTEM";
      document.querySelector("button").disabled = false;
      
  } catch(e) {
      alert("Model failed to load: " + e.message);
  }
};

initializeObjectDetector();

// 2. START CAMERA (THE FIX IS HERE)
window.enableCam = async function() {
  if (!objectDetector) {
    alert("AI Brain is still loading... please wait 5 seconds.");
    return;
  }

  startScreen.style.display = "none";
  statusText.innerText = "STARTING OPTICAL SENSORS...";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false
    });
    
    video.srcObject = stream;
    
    // --- FORCE PLAY FIX ---
    // We explicitly tell the browser "PLAY NOW"
    await video.play(); 
    
    // Set canvas size immediately
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    statusText.innerText = "SEARCHING FOR TARGETS...";
    
    // Start loop
    window.requestAnimationFrame(predictWebcam);
    
  } catch (err) {
    console.error(err);
    alert("Camera Error: " + err.message);
  }
};

// 3. PREDICTION LOOP
async function predictWebcam() {
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    
    // A. Detect
    const startTimeMs = performance.now();
    const detections = objectDetector.detectForVideo(video, startTimeMs);
    
    // B. Draw Video & HUD
    drawHUD(detections.detections);
  }
  
  window.requestAnimationFrame(predictWebcam);
}

// 4. DRAW HUD
function drawHUD(detections) {
  // Ensure canvas matches video size exactly
  if(canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  }

  // Draw Raw Video
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw Objects
  for (const detection of detections) {
    const box = detection.boundingBox;
    const category = detection.categories[0];
    const score = Math.round(category.score * 100);
    const label = category.categoryName.toUpperCase();

    // Box
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 4;
    ctx.strokeRect(box.originX, box.originY, box.width, box.height);

    // Label
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(box.originX, box.originY - 30, box.width, 30);

    // Text
    ctx.fillStyle = "white";
    ctx.font = 'bold 18px "Share Tech Mono", monospace';
    ctx.fillText(`${label} [${score}%]`, box.originX + 5, box.originY - 8);
    
    statusText.innerText = `LOCKED: ${label}`;
  }
}