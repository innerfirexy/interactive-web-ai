const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

Matter.use(
      'matter-attractors'
    );
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
var render = Render.create({
  element: document.body,
  engine: engine
});
// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });



// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine






function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  var angleRadians1 = -Math.atan2(results.poseLandmarks[15].y - results.poseLandmarks[13].y, results.poseLandmarks[15].x - results.poseLandmarks[13].x) * 180 / Math.PI;
  var angleRadians2 = -Math.atan2(results.poseLandmarks[16].y - results.poseLandmarks[14].y, results.poseLandmarks[16].x - results.poseLandmarks[14].x) * 180 / Math.PI;
  if ((60<=angleRadians2 && angleRadians2<=130) || (60<=angleRadians1 && angleRadians1<=130)  ){
    canvasCtx.strokeText("handRising", 10, 240)
 }


canvasCtx.restore();
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
  upperBodyOnly: false,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true
});

var rightHand = Bodies.rectangle(300, 300, 50, 50);
var lefttHand = Bodies.rectangle(300, 300, 50, 50);
World.add(engine.world, [rightHand,lefttHand]);
pose.onResults(results=>{
  onResults(results);
  Matter.Body.setPosition(rightHand, {x: results.poseLandmarks[19].x*1280, y: results.poseLandmarks[19].y*720});
  Matter.Body.setPosition(lefttHand, {x: results.poseLandmarks[20].x*1280, y: results.poseLandmarks[20].y*720});
  canvasCtx.fillRect(boxA.position.x, boxA.position.y, 100, 100);
  canvasCtx.fillRect(boxB.position.x, boxB.position.y, 100, 100);
  canvasCtx.fillRect(lefttHand.position.x, lefttHand.position.y, 50, 50);
  canvasCtx.fillRect(rightHand.position.x, rightHand.position.y, 50, 50);
  console.log(boxC.position.x);
});


const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

camera.start();
Engine.run(engine);