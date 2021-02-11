const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(
        // results.image, 0, 0, canvasElement.width, canvasElement.height);
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
    
    // detect hand raising
    // var angleRadians1 = -Math.atan2(results.poseLandmarks[15].y - results.poseLandmarks[13].y, results.poseLandmarks[15].x - results.poseLandmarks[13].x) * 180 / Math.PI;
    // var angleRadians2 = -Math.atan2(results.poseLandmarks[16].y - results.poseLandmarks[14].y, results.poseLandmarks[16].x - results.poseLandmarks[14].x) * 180 / Math.PI;
    // if ((60<=angleRadians2 && angleRadians2<=130) || (60<=angleRadians1 && angleRadians1<=130)  ){
    // canvasCtx.strokeText("handRising", 10, 240)
    // }
    
    canvasCtx.restore();
}

const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
    upperBodyOnly: false,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
    await pose.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();