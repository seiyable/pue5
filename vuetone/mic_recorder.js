// p5 global instance

var mic, recorder;
function setup(){
  mic = new p5.AudioIn();
  mic.start();

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
}
