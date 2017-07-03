var mic, recorder;
var recordedSounds = [];

function setup(){
  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
}

var audioTracks = [];
var trackObj = {};
var tempSound;
var startRecordOn = function (trackID){
	tempSound = new p5.SoundFile();
	recorder.record(tempSound);
	console.log("Recording...")
}
var stopRecordOn = function (trackID){
	recorder.stop();
	recordedSounds[trackID] = tempSound;
	console.log("Recording done...")
}

var playBackTrackOn = function(trackID){
	recordedSounds[trackID].play();
}


// function keyPressed() {
//   console.log(keyCode);
//   if (keyCode === 49) {
//     console.log("wait for 2 sec")
//     setTimeout(function() {
//       console.log("recording starts");
//       sounds[counter] =  new p5.SoundFile();
//       recorder.record(sounds[counter]);
//       counter++;
//     }, 2000)
//   }
// }

// function keyReleased() {
//   if (keyCode === 49) {
//     console.log("recording stops");
//     recorder.stop();
//   }
// }
// function mousePressed(){
//   sounds[playCount].play(); 
// }
// function mouseReleased(){
//   sounds[0].stop(); 
//   playCount++;
// }
