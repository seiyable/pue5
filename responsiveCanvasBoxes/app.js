// ======================================
// canvas wrapper component
// ======================================
Vue.component('canvas-wrapper', {
  template: `
    <li
      class="canvas-wrapper"
      :style="getStyle"
      :id="getId"
      @click="onClick">
      <p></p>
    </li>
    `,
  data: function () {
    return {
      size : { w: 0, h: 0 },
      pos  : { x: 0, y: 0 },
      p5Instance: null
    }
  },
  props: {
    'canvasIndex':  { type: Number },
    'canvasNum':    { type: Number },
    'canvasMargin': { type: Number },
    'pagePadding':  { type: Number }
  },
  created: function () {
    this.setSizeAndPos();

    // set event listener for resizing window
    window.addEventListener('resize', this.onResize);

  },
  methods: {
    setSizeAndPos: function () {
      // size
      var innerActiveWidth = window.innerWidth * (1.0 - this.pagePadding*2);
      this.size.w = (innerActiveWidth / this.canvasNum) * (1.0 - this.canvasMargin*2);
      this.size.h = this.size.w; // square

      // pos
      var canvasMarginPx = this.size.w * this.canvasMargin;
      var leftEdge = window.innerWidth * this.pagePadding + canvasMarginPx;
      this.pos.x = leftEdge + (this.size.w + canvasMarginPx*2) * this.canvasIndex;
      this.pos.y = (window.innerHeight - this.size.h) / 2;
    },
    onResize: function () {
      this.setSizeAndPos();
      this.p5Instance.resizeCanvas(this.size.w, this.size.h);
    },
    onClick: function (event) {
      // add a ripple
      this.p5Instance.addRipple();
    }

  },
  computed: {
    getStyle: function () {
      return {
        width:  this.size.w + 'px',
        height: this.size.h + 'px',
        top:    this.pos.y  + 'px',
        left:   this.pos.x  + 'px'
      }
    },
    getId: function () {
      return 'canvas-' + this.canvasIndex;
    }
  },
  mounted: function () {
    var props = this.$props;
    var el    = this.$el;
    var data  = this.$data;

    // p5 instance setup
    // *********************************************************************
    var sketch = function (p) {
      var ripples = []; // storing ripple instances
      var bgColor; // canvas' background color

      // define ripple object
      var Ripple = function (center, fill) {
        this.center = center;
        this.fill   = fill;
        this.radius = 0;
        this.speed  = 10.0;
      };

      // define member methods
      Ripple.prototype.display = function () {
        // increase the size
        this.radius += this.speed;

        // draw the circle
        p.fill(this.fill);
        p.noStroke();
        // p.ellipse(p.width/2, p.height/2, radius, radius);
        p.ellipse(this.center.x, this.center.y, this.radius, this.radius);

        if (this.radius > data.size.w * 3) {
          // when the circle becomes large enough to cover the canvas, stop drawing the circle
          bgColor = this.fill;
          return true; // remove this ripple
        }
      }

      // ============ setup() ============
      p.setup = function () {
        p.createCanvas(data.size.w, data.size.h);
        // console.log('Hi, this is a p5 canvas: ' + props.canvasIndex);
        p.colorMode(p.HSB, 360, 100, 100, 1.0);

        var hue = 360 * (props.canvasIndex/props.canvasNum);
        bgColor = p.color(hue, 80, 100);
      };

      // ============ draw() ============
      p.draw = function () {
        p.background(bgColor);

        var removeIndex = -1;
        for (var i = 0; i < ripples.length; i++) {
          // draw ripple and remove it if it becomes large enough to cover the parent canvas
          var isDead = ripples[i].display();
          if (isDead) removeIndex = i;
        }
        // remove the dead ripple
        if (removeIndex >= 0) ripples.splice(removeIndex, 1);
      };

      // ============ addRipple() ============
      p.addRipple = function () {
        var center = {};
        center.x = p.mouseX;
        center.y = p.mouseY;

        // set a new color for the circle's fill
        var hue = 360 * p.random(1.0);
        var fill = p.color(hue, 80, 100);
        ripples.push(new Ripple(center, fill));
      }
     };
     // *********************************************************************

    // append canvas tag under this component
    this.p5Instance = new p5(sketch, this.getId);
  }
})

// ======================================
// root component
// ======================================
new Vue({
  el: '#app',
  data: function () {
    return {
      canvasNum: 3,
      canvasMargin: 0.1,
      pagePadding: 0.05
    }
  },
  template: `
    <ul>
      <canvas-wrapper
        v-for="(n, index) in canvasNum"
        :canvas-index="index"
        :canvas-num="canvasNum"
        :canvas-margin="canvasMargin"
        :page-padding="pagePadding">
      </canvas-wrapper>
    </ul>
    `
})
