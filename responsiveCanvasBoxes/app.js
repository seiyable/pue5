// ======================================
// canvas wrapper component
// ======================================
Vue.component('canvas-wrapper', {
  template: `
    <li class="canvas-wrapper" :style="getStyle"></li>
    `,
  data: function () {
    return {
      size : {w: 0, h: 0},
      pos  : {x: 0, y: 0}
    }
  },
  props: ['canvasIndex', 'canvasNum', 'canvasMargin', 'pagePadding'],
  created: function () {
    this.setSize();
    this.setPos();
  },
  methods: {
    setSize: function () {
      var innerActiveWidth = window.innerWidth * (1.0 - this.pagePadding*2);
      this.size.w = (innerActiveWidth / this.canvasNum) * (1.0 - this.canvasMargin*2);
      this.size.h = this.size.w; // square
    },
    setPos: function () {
      var canvasMarginPx = this.size.w * this.canvasMargin;
      var leftEdge = window.innerWidth * this.pagePadding + canvasMarginPx;
      this.pos.x = leftEdge + (this.size.w + canvasMarginPx*2) * this.canvasIndex;

      this.pos.y = (window.innerHeight - this.size.h) / 2;
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
