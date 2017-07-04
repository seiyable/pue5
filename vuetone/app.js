// ======================================
// ToneListItem component
// ======================================
Vue.component('tone-list-item', {
  data: function () {
    return {
      p5Instance: null,
      recording: false,
      recorded: false,
      onMouse: false,
      triedToPlayButNoSound: false
    }
  },
  props: {
    mode:     String,
    toneId:   Number,
    toneName: String,
    toneFile: Object
  },
  template: `
    <li
      class="tone-list-item text-center-wrapper"
      :id="getId"
      @mousedown="mouseDown"
      @mouseup="mouseUp"
      @mouseover="mouseOver"
      @mouseleave="mouseLeave">
      <p class="text-center">{{ getMessage }}</p>
    </li>`,
  methods: {
    playback: function () {
      if (this.recorded) {
        console.log('playback sound of ' + this.toneName)
        this.p5Instance.playThisSound();
      } else {
        this.triedToPlayButNoSound = true;
      }
    },
    startRecording: function () {
      console.log('start recording for ' + this.toneName)
      this.p5Instance.startRecording();
      this.recording = true;
    },
    stopRecording: function () {
      console.log('stop recording for ' + this.toneName)
      this.p5Instance.stopRecording();
      this.recording = false;
      this.recorded  = true;
    },
    mouseDown: function () {
      if (this.mode === 'record') {
        this.startRecording();
      } else if (this.mode === 'play') {
        this.playback();
      }
    },
    mouseUp: function () {
      if (this.mode === 'record' && this.recording) {
        this.stopRecording();
      }
    },
    mouseOver: function () {
      this.onMouse = true;
    },
    mouseLeave: function () {
      this.onMouse = false;

      if (this.mode === 'record' && this.recording) {
        this.stopRecording();
      }

      if (this.mode === 'play') {
        this.triedToPlayButNoSound = false;
      }
    }
  },
  computed: {
    getId: function () {
      return 'item-' + this.toneId;
    },
    getMessage: function () {
      if (this.onMouse) {
        if (this.mode === 'record') {
          return 'Click and Hold to Record';
        } else if (this.mode === 'play') {
          if (this.recorded) {
            return 'Click to Play Sound';
          } else if (this.triedToPlayButNoSound) {
            return 'Sound is Not Recorded';
          }
        }
      }
      return '';
    }
  },
  mounted: function () {
    var props = this.$props;
    var el    = this.$el;
    var data  = this.$data;

    var sketch = function( p ) {
      var fft;
      var songSample;
      var tempSound = null;
      var spectrum;
      var bgColor;

      // ============ setup() ============
      p.setup = function() {
        p.createCanvas(el.clientWidth, el.clientHeight);
        // console.log('Hi, this is a p5 canvas in ' + props.toneName);
        p.colorMode(p.HSB, 360, 100, 100, 1.0);
        bgColor = p.color(props.toneId * 20, 50, 100, 1.0);

        fft = new p5.FFT();
      };

      // ============ draw() ============
      p.draw = function() {
        p.background(bgColor);

        if (data.recorded) {
          spectrum = fft.analyze();

          p.stroke(0);
          p.strokeWeight(2);
          p.noFill();
          p.beginShape();

          for (var i = 0; i < spectrum.length; i++) {
            var x = p.map(i, 0, spectrum.length-1, 0, p.width);
            var y = p.map(spectrum[i], 0, 255, p.height, 0);
            p.vertex(x, y);
          }

          p.endShape();
        }
      };

      // ============ playThisSound() ============
      p.playThisSound = function(){
        if (tempSound === null) {
          console.log('sound is not set');
        } else {
          console.log(tempSound)
          tempSound.play();
        }
      }

      // ============ startRecording() ============
      p.startRecording = function(){
        tempSound = new p5.SoundFile();
        recorder.record(tempSound);
        console.log('Recording...')
      }

      // ============ stopRecording() ============
      p.stopRecording = function(){
        recorder.stop();
        console.log('Recording done')
        fft.setInput(tempSound);
      }
     };

    // append canvas tag under this component
    this.p5Instance = new p5(sketch, this.getId);
  }
})

// ======================================
// ToneList component
// ======================================
Vue.component('tone-list', {
  data: function () {
    return {
      items: [
        {id: 1, name: 'item 1', tone: null},
        {id: 2, name: 'item 2', tone: null},
        {id: 3, name: 'item 3', tone: null},
        {id: 4, name: 'item 4', tone: null},
        {id: 5, name: 'item 5', tone: null},
        {id: 6, name: 'item 6', tone: null},
        {id: 7, name: 'item 7', tone: null},
        {id: 8, name: 'item 8', tone: null},
        {id: 9, name: 'item 9', tone: null},
        {id: 10, name: 'item 10', tone: null},
        {id: 11, name: 'item 11', tone: null},
        {id: 12, name: 'item 12', tone: null},
        {id: 13, name: 'item 13', tone: null},
        {id: 14, name: 'item 14', tone: null},
        {id: 15, name: 'item 15', tone: null}
      ]
    }
  },
  props: {
    mode: {
      type: String
    }
  },
  template: `<ul>
    <tone-list-item
      v-for="item in items"
      :key="item.id"
      :tone-id="item.id"
      :tone-name="item.name"
      :tone-file="item.tone"
      :mode=mode>
    </tone-list-item>
    </ul>`
})

// ======================================
// ToneList component
// ======================================
Vue.component('mode-selector', {
  props: {
    mode: {
      type: String
    }
  },
  template: `
    <div class="mode-selector">
      <div class="mode-selector-inner">
        <div class="mode-button record text-center-wrapper" @click="switchMode('record')" :class="{selected: mode==='record'}">
          <p class="text-center">RECORD</p>
        </div>
        <div class="mode-button play text-center-wrapper" @click="switchMode('play')" :class="{selected: mode==='play'}">
          <p class="text-center">PLAY</p>
        </div>
      </div>
    </div>
  `,
  methods: {
    switchMode: function (mode) {
      console.log('switch mode to ' + mode)
      this.$emit('switch-mode', mode)
    }
  }
})

// ======================================
// root component
// ======================================
new Vue({
  el: '#app',
  data: function () {
    return {
      mode: 'record'
    }
  },
  template: `
    <div class="wrapper">
      <tone-list :mode=mode></tone-list>
      <mode-selector :mode=mode @switch-mode="switchMode"></mode-selector>
    </div>
  `,
  methods: {
    switchMode: function (mode) {
      this.mode = mode;
    }
  }
})
