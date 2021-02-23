const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;


// create an engine
var engine = Engine.create();
var render = Render.create({
  element: document.body,
  engine: engine
});


// create two boxes and a ground
var boxA = Bodies.rectangle(150, 0, 5, 5, { isStatic: true });
var boxB = Bodies.rectangle(450, 100, 150, 400);


var options = {
  bodyA: boxA,
  bodyB: boxB,
  pointA: {
    x: 0,
    y: -100
  }
}
var PunchBag = Matter.Constraint.create(options);




// add all of the bodies to the world
World.add(engine.world, [boxA, boxB,  PunchBag]);

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


function Rendering() {
  var bodies = Matter.Composite.allBodies(engine.world);
  console.log(bodies);
  canvasCtx.fillStyle = 'red';
  canvasCtx.beginPath();
  for (var i = 0; i < bodies.length; i += 1) {
      var vertices = bodies[i].vertices;
      canvasCtx.moveTo(vertices[0].x, vertices[0].y);
      for (var j = 1; j < vertices.length; j += 1) {
        canvasCtx.lineTo(vertices[j].x, vertices[j].y);
      }
      canvasCtx.fillStyle = 'red';
      canvasCtx.lineTo(vertices[0].x, vertices[0].y);
  }
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = '#ff0000';
  canvasCtx.stroke();
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
  
  Rendering(); 
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
