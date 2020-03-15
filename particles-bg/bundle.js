(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('proton-engine'), require('raf-manager')) :
	typeof define === 'function' && define.amd ? define(['exports', 'proton-engine', 'raf-manager'], factory) :
	(factory((global.VueParticles = global.VueParticles || {}),global.Proton,global.RAFManager));
}(this, (function (exports,Proton,RAFManager) { 'use strict';

Proton = 'default' in Proton ? Proton['default'] : Proton;
RAFManager = 'default' in RAFManager ? RAFManager['default'] : RAFManager;

// Code source from here, thanks author
// https://github.com/drawcall/Proton/blob/gh-pages/source/src/utils/Rand.js
class Rand {

  constructor() {
      this.list = [];
  }

  set(probability, target) {
      this.list.push({
          probability,
          target,
          a: 0,
          b: 1
      });

      this.calculation();
  }

  calculation() {
      let total = 0;
      for (let i = 0; i < this.list.length; i++) {
          total += this.list[i].probability;
      }

      for (let i = 0; i < this.list.length; i++) {
          const obj = this.list[i];
          const val = obj.probability / total;

          obj.a = i === 0 ? 0 : this.list[i - 1].b;
          obj.b = obj.a + val;
      }
  }

  getResult() {
      const val = Math.random();
      for (let i = 0; i < this.list.length; i++) {
          const obj = this.list[i];

          if (val <= obj.b && val > obj.a) {
              return obj.target;
          }
      }

      return this.list[0].target;
  }
}

//
//
//
//
//
//
//
//
//
//

var script$2 = {
  name: "CanvasComp",
  props: {
    canvas: Object,
    bg: Boolean,
    globalCompositeOperation: String
  },
  data: function() {
    return {
      styleObject: {
        width: "100%",
        height: "100%"
      }
    };
  },
  methods: {
    initCanvas: function() {
      const canvas = this.$refs.canvasRef;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      if (this.globalCompositeOperation) {
        const context = canvas.getContext("2d");
        context.globalCompositeOperation = this.globalCompositeOperation;
      }

      this.$emit("canvasInited", canvas);
    },
    resize: function() {
      const canvas = this.$refs.canvasRef;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      this.$emit("canvasResize", { width, height });
    },

    handleMouseDown: function(e) {
      this.$emit("canvasMouseDown", e);
    },

    handleMouseMove: function(e) {
      this.$emit("canvasMouseMove", e);
    }
  },
  created() {
    if (this.bg) {
      this.styleObject = Object.assign(this.styleObject, {
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0
      });
    }

    if(this.canvas){
      this.styleObject = Object.assign(this.styleObject, this.canvas);
    }
  },
  mounted() {
    this.initCanvas();
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  },
  beforeDestory() {
    window.removeEventListener("resize", this.resize);
  }
};

function normalizeComponent$1(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas", {
    ref: "canvasRef",
    staticClass: "canvas",
    style: _vm.styleObject,
    on: { mousedown: _vm.handleMouseDown, mousemove: _vm.handleMouseMove }
  })
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-0bea0318_0", { source: "\n.canvas[data-v-0bea0318] {\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n", map: {"version":3,"sources":["/Users/jonasniestroj/source/particles-bg-vue/src/particles-bg/particles/CanvasComp.vue"],"names":[],"mappings":";AAqFA;EACA,WAAA;EACA,YAAA;EACA,cAAA;AACA","file":"CanvasComp.vue","sourcesContent":["<template>\n  <canvas\n    class=\"canvas\"\n    ref=\"canvasRef\"\n    v-bind:style=\"styleObject\"\n    v-on:mousedown=\"handleMouseDown\"\n    v-on:mousemove=\"handleMouseMove\"\n  />\n</template>\n\n<script>\nexport default {\n  name: \"CanvasComp\",\n  props: {\n    canvas: Object,\n    bg: Boolean,\n    globalCompositeOperation: String\n  },\n  data: function() {\n    return {\n      styleObject: {\n        width: \"100%\",\n        height: \"100%\"\n      }\n    };\n  },\n  methods: {\n    initCanvas: function() {\n      const canvas = this.$refs.canvasRef;\n      const width = window.innerWidth;\n      const height = window.innerHeight;\n      canvas.width = width;\n      canvas.height = height;\n\n      if (this.globalCompositeOperation) {\n        const context = canvas.getContext(\"2d\");\n        context.globalCompositeOperation = this.globalCompositeOperation;\n      }\n\n      this.$emit(\"canvasInited\", canvas);\n    },\n    resize: function() {\n      const canvas = this.$refs.canvasRef;\n      const width = window.innerWidth;\n      const height = window.innerHeight;\n      canvas.width = width;\n      canvas.height = height;\n      this.$emit(\"canvasResize\", { width, height });\n    },\n\n    handleMouseDown: function(e) {\n      this.$emit(\"canvasMouseDown\", e);\n    },\n\n    handleMouseMove: function(e) {\n      this.$emit(\"canvasMouseMove\", e);\n    }\n  },\n  created() {\n    if (this.bg) {\n      this.styleObject = Object.assign(this.styleObject, {\n        position: \"absolute\",\n        zIndex: -1,\n        top: 0,\n        left: 0\n      });\n    }\n\n    if(this.canvas){\n      this.styleObject = Object.assign(this.styleObject, this.canvas);\n    }\n  },\n  mounted() {\n    this.initCanvas();\n    this.resize = this.resize.bind(this);\n    window.addEventListener(\"resize\", this.resize);\n  },\n  beforeDestory() {\n    window.removeEventListener(\"resize\", this.resize);\n  }\n};\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n.canvas {\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = "data-v-0bea0318";
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* component normalizer */
  /* style inject */
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = normalizeComponent$1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {};
}

function getColor(color, a) {
    let c;
    if (color) {
        c = hexToRgb(color);
        return `rgba(${c.r},${c.g},${c.b}, ${a})`;
    } else {
        return null;
    }
}

//
//
//
//
//
//
//
//
//
//
//

var script$1 = {
  name: "BallParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    num: Number,
    color: String,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      this.createMiniEmitter(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const context = canvas.getContext("2d");
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(
        this.num ? new Proton.Span(this.num) : new Proton.Span(4, 9),
        new Proton.Span(0.8, 1.3)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(1, 50));
      emitter.addInitialize(new Proton.Life(5, 6));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(5, 8),
          new Proton.Span(30, 70),
          "polar"
        )
      );

      emitter.addBehaviour(new Proton.Alpha(1, 0));
      emitter.addBehaviour(
        new Proton.Color([
          "#36aaf3",
          "#fd769c",
          "#94ff22",
          "#ffa545",
          "#ffffff"
        ])
      );
      emitter.addBehaviour(new Proton.Scale(0.7, 1));
      emitter.addBehaviour(new Proton.Gravity(3));
      emitter.addBehaviour(new Proton.Collision(emitter));
      emitter.addBehaviour(this.customDeadBehaviour(canvas));
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "bound"
      );
      emitter.addBehaviour(crossZoneBehaviour);

      emitter.p.x = Math.min(500, Math.max(canvas.width / 2 - 400, 50));
      emitter.p.y = canvas.height / 2 + 50;
      emitter.emit();
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      renderer.onProtonUpdate = () => {
        context.fillStyle =
          getColor(this.color, 0.2) || "rgba(255, 255, 255, 0.2)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };
      this.proton.addRenderer(renderer);

      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    customDeadBehaviour(canvas) {
      return {
        initialize(particle) {},
        applyBehaviour: particle => {
          if (particle.p.y + particle.radius >= canvas.height) {
            if (particle.radius > 9) {
              this.miniEmitteing(particle);
              particle.dead = true;
            }
          }
        }
      };
    },

    createMiniEmitter(canvas) {
      const miniEmitter = new Proton.Emitter();
      miniEmitter.rate = new Proton.Rate(
        new Proton.Span(3, 6),
        new Proton.Span(1, 2)
      );

      miniEmitter.addInitialize(new Proton.Mass(1));
      miniEmitter.radiusInitialize = new Proton.Radius();
      miniEmitter.addInitialize(miniEmitter.radiusInitialize);
      miniEmitter.addInitialize(new Proton.Life(0.5, 1));
      miniEmitter.addInitialize(
        new Proton.V(
          new Proton.Span(1.5, 3),
          new Proton.Span(0, 70, true),
          "polar"
        )
      );

      miniEmitter.colorBehaviour = new Proton.Color("#ffffff");
      miniEmitter.addBehaviour(new Proton.Alpha(1, 0));
      miniEmitter.addBehaviour(miniEmitter.colorBehaviour);
      miniEmitter.addBehaviour(new Proton.Gravity(4));
      miniEmitter.addBehaviour(new Proton.Collision(miniEmitter));
      miniEmitter.addBehaviour(
        new Proton.CrossZone(
          new Proton.RectZone(0, 0, canvas.width, canvas.height),
          "bound"
        )
      );
      this.proton.addEmitter(miniEmitter);

      this.miniEmitter = miniEmitter;
    },
    miniEmitteing(particle) {
      const miniEmitter = this.miniEmitter;
      miniEmitter.radiusInitialize.reset(
        particle.radius * 0.05,
        particle.radius * 0.2
      );
      miniEmitter.colorBehaviour.reset(particle.color);
      miniEmitter.p.x = particle.p.x;
      miniEmitter.p.y = particle.p.y;
      miniEmitter.emit("once");
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "source-over"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

const colors = [
  "#529B88",
  "#CDD180",
  "#FFFA32",
  "#FB6255",
  "#FB4A53",
  "#FF4E50",
  "#F9D423"
];

var script$3 = {
  name: "ColorParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(
        this.num ? new Proton.Span(this.num) : new Proton.Span(5, 8),
        new Proton.Span(0.1, 0.25)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(20, 200));
      emitter.addInitialize(new Proton.Life(2, 4));
      emitter.addInitialize(
        new Proton.Position(new Proton.RectZone(0, 0, width, height))
      );

      emitter.addBehaviour(
        new Proton.Alpha(0, 1, Infinity, Proton.easeOutCubic)
      );
      emitter.addBehaviour(
        new Proton.Scale(1, 0, Infinity, Proton.easeOutCubic)
      );
      emitter.addBehaviour(new Proton.Color(colors, "random"));

      emitter.emit();
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "source-over"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = normalizeComponent$1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

const colors$1 = [
  "#529B88",
  "#CDD180",
  "#FFFA32",
  "#FB6255",
  "#FB4A53",
  "#FF4E50",
  "#F9D423"
];

var script$4 = {
  name: "ColorParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.num || 20);
      emitter.damping = 0.008;

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(30, 600));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(0.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      emitter.addInitialize(
        new Proton.Position(
          new Proton.RectZone(0, 0, canvas.width, canvas.height)
        )
      );
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "cross"
      );
      emitter.addBehaviour(crossZoneBehaviour);
      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.35, 0.55)));
      emitter.addBehaviour(new Proton.Color(this.getColor()));
      emitter.addBehaviour(new Proton.RandomDrift(50, 50, 0.5));
      emitter.emit("once");
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    getColor() {
      let c = colors$1;
      if (this.color) {
        if (Array.isArray(this.color)) {
          c = this.color;
        } else {
          c = [this.color];
        }
      }

      return c;
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "source-over"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$4 = normalizeComponent$1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

var script$5 = {
  name: "CobwebParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(
        this.num ? new Proton.Span(this.num) : new Proton.Span(100),
        new Proton.Span(0.05, 0.2)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(1, 4));
      emitter.addInitialize(new Proton.Life(Infinity));
      const pointZone = new Proton.Position(
        new Proton.RectZone(0, 0, width, height)
      );
      emitter.addInitialize(pointZone);
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(0.3, 0.6),
          new Proton.Span(0, 360),
          "polar"
        )
      );

      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.2, 0.9)));
      emitter.addBehaviour(new Proton.Color(this.color || "#333"));
      this.crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, width, height),
        "cross"
      );
      emitter.addBehaviour(this.crossZoneBehaviour);

      emitter.emit("once");
      emitter.damping = 0;
      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas, emitter));
    },
    createRenderer(canvas, emitter) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);
      const R = 140;

      renderer.onProtonUpdateAfter = () => {
        let particles = emitter.particles;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            let pA = particles[i];
            let pB = particles[j];
            let dis = pA.p.distanceTo(pB.p);

            if (dis < R) {
              let alpha = (1 - dis / R) * 0.5;
              context.strokeStyle =
                getColor(this.color, alpha) || `rgba(3, 3, 3, ${alpha})`;
              context.beginPath();
              context.moveTo(pA.p.x, pA.p.y);
              context.lineTo(pB.p.x, pB.p.y);
              context.closePath();
              context.stroke();
            }
          }
        }
      };

      return renderer;
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "source-over"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$5 = normalizeComponent$1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

var script$6 = {
  name: "ThickParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.canvasDom = canvas;
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
      if (this.color) {
        canvas.style.backgroundColor = this.color;
      }
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const emitter = new Proton.Emitter();
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.num ? this.num : 150);

      // Initialize
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(8));
      emitter.addInitialize(
        new Proton.V(
          new Proton.Span(0.1, 0.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      emitter.addInitialize(
        new Proton.Position(
          new Proton.CircleZone(canvas.width / 2, canvas.height / 2, 100)
        )
      );

      // Behaviour
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "cross"
      );
      emitter.addBehaviour(crossZoneBehaviour);
      this.repulsion = new Proton.Repulsion(
        {
          x: canvas.width / 2,
          y: canvas.height / 2 - 100
        },
        3,
        300
      );

      this.attraction = new Proton.Attraction(
        {
          x: canvas.width / 2,
          y: canvas.height / 2
        },
        3,
        200
      );
      emitter.addBehaviour(this.attraction, this.repulsion);
      emitter.addBehaviour(new Proton.Color("random"));
      emitter.addBehaviour(new Proton.RandomDrift(20, 15, 0.15));

      emitter.emit("once");
      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    createRenderer(canvas) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);

      renderer.onProtonUpdate = () => {
        this.hue += 1;
        context.fillStyle = getColor(this.color, 0.02) || "rgba(0, 0, 0, 0.02)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = particle => {
        particle.data.begin = Proton.MathUtil.randomAToB(1, 120);
        particle.data.tha = Proton.MathUtil.randomAToB(0, Math.PI * 2);
      };

      renderer.onParticleUpdate = particle => {
        const hue = particle.data.begin + this.hue;
        particle.color = this.colorTemplate.replace("hue", hue % 360);

        const ratio = 3 / 4;
        const radius =
          particle.radius *
            (1 - ratio) *
            Math.cos((particle.data.tha += 0.01)) +
          particle.radius * ratio;

        context.beginPath();
        context.fillStyle = particle.color;
        context.arc(particle.p.x, particle.p.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
      };

      return renderer;
    },
    renderProton() {
      const canvas = this.canvasDom;
      this.proton.update();
      if (this.index % 200 === 0) {
        this.attraction.targetPosition.x = Math.random() * canvas.width;
        this.attraction.targetPosition.y = Math.random() * canvas.height;

        this.repulsion.targetPosition.x = Math.random() * canvas.width;
        this.repulsion.targetPosition.y = Math.random() * canvas.height;
      }

      this.index++;
    }
  },
  created() {
    this.hue = 0;
    this.index = 0;
    this.colorTemplate = `hsla(hue,80%,50%, 0.75)`;
    this.renderProton = this.renderProton.bind(this);
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "source-over"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$6 = normalizeComponent$1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

var script$7 = {
  name: "CustomParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    num: Number,
    color: String,
    globalCompositeOperation: String,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    getCompositeOperation() {
      const globalCompositeOperation =
        this.globalCompositeOperation || this.operation || "source-over";
      return globalCompositeOperation;
    },

    getProp(key, defaultVal) {
      const config = this.config || {};
      const val = config[key] || defaultVal;
      
      if (Array.isArray(val)) {
        return new Proton.Span(val[0], val[1]);
      } else {
        return val;
      }
    },

    getArrProp(key, defaultVal) {
      const config = this.config || {};
      const val = config[key] || defaultVal;
      if (!val) return null;

      if (Array.isArray(val)) {
        return val;
      } else {
        return [val, val];
      }
    },

    createProton(canvas, width, height) {
      const num = this.getProp("num", [5, 8]);
      const rps = this.getProp("rps", [0.1, 0.2]);
      const mass = this.getProp("mass", 1);
      const radius = this.getProp("radius", [10, 30]);
      const life = this.getProp("life", [2, 3]);
      const body = this.getProp("body");
      const position = this.getProp("position");
      const v = this.getProp("v", [2, 3]);
      const tha = this.getProp("tha", [-15, 15]);
      const alpha = this.getArrProp("alpha");
      const scale = this.getArrProp("scale");
      const color = this.getArrProp("color");
      const cross = this.getProp("cross", "dead");
      const random = this.getProp("random");
      const rotate = this.getArrProp("rotate");
      const g = this.getProp("g");
      const f = this.getArrProp("f");
      const emitterV = this.getProp("emitter");

      this.proton = new Proton();
      let emitter;
      if (emitterV === "follow") {
        emitter = new Proton.FollowEmitter();
      } else {
        emitter = new Proton.Emitter();
      }
      emitter.rate = new Proton.Rate(num, rps);

      emitter.addInitialize(new Proton.Mass(mass));
      emitter.addInitialize(new Proton.Radius(radius));
      emitter.addInitialize(new Proton.Life(life));
      emitter.addInitialize(new Proton.Velocity(v, tha, "polar"));
      if (body) emitter.addInitialize(new Proton.Body(body));

      let pos;
      if (position === "all" || position === "screen") {
        pos = new Proton.Position(
          new Proton.RectZone(0, 0, canvas.width, canvas.height)
        );
      } else if (typeof position === "object") {
        pos = new Proton.Position(
          new Proton.RectZone(
            position.x,
            position.y,
            position.width,
            position.height
          )
        );
      } else {
        emitter.p.x = canvas.width / 2;
        emitter.p.y = canvas.height / 2;
      }

      emitter.addInitialize(pos);

      /// behaviour
      const alphaB = alpha
        ? new Proton.Alpha(alpha[0], alpha[1])
        : new Proton.Alpha(0, 1);
      const scaleB = scale
        ? new Proton.Scale(scale[0], scale[1])
        : new Proton.Scale(1, 0.2);
      const colorB = new Proton.Color(color);

      emitter.addBehaviour(alphaB);
      emitter.addBehaviour(scaleB);
      if (!body) emitter.addBehaviour(colorB);

      if (rotate) {
        if (rotate[0] === true || rotate[0] === "rotate") {
          emitter.addBehaviour(new Proton.Rotate());
        } else {
          emitter.addBehaviour(new Proton.Rotate(rotate[0], rotate[1]));
        }
      }

      const zone = new Proton.RectZone(0, 0, canvas.width, canvas.height);
      const crossZoneBehaviour = new Proton.CrossZone(zone, cross);
      emitter.addBehaviour(crossZoneBehaviour);

      random &&
        emitter.addBehaviour(new Proton.RandomDrift(random, random, 0.05));
      g && emitter.addBehaviour(new Proton.G(g));
      f && emitter.addBehaviour(new Proton.F(f[0], f[1]));

      emitter.emit();
      this.proton.addEmitter(emitter);

      const renderer = this.createRenderer(canvas);
      this.proton.addRenderer(renderer);

      this.emitter = emitter;
      this.crossZoneBehaviour = crossZoneBehaviour;
    },

    createRenderer(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);

      const onUpdate = this.getProp("onUpdate");
      if (onUpdate) {
        renderer.onProtonUpdate = () => {
          onUpdate(context, width, height);
        };
      }

      const onParticleCreated = this.getProp("onParticleCreated");
      if (onParticleCreated) {
        renderer.onParticleCreated = particle => {
          onParticleCreated(context, particle);
        };
      }

      const onParticleUpdate = this.getProp("onParticleUpdate");
      if (onParticleUpdate) {
        renderer.onParticleUpdate = particle => {
          onParticleUpdate(context, particle);
        };
      }

      return renderer;
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$7 = script$7;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "getCompositeOperation()"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$7 = normalizeComponent$1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

var script$8 = {
  name: "LinesParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
      if (this.color) {
        canvas.style.backgroundColor = this.color;
      }
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const emitter = new Proton.Emitter();
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.num ? this.num : 250);
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(4));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(1.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      
      const mouseObj = {
        x: width / 2,
        y: height / 2
      };
      const attractionBehaviour = new Proton.Attraction(mouseObj, 0, 0);
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "cross"
      );
      emitter.addBehaviour(new Proton.Color("random"));
      emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
      emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
      emitter.p.x = canvas.width / 2;
      emitter.p.y = canvas.height / 2;
      emitter.emit("once");

      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    createRenderer(canvas) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);
      renderer.onProtonUpdate = () => {
        context.fillStyle =
          getColor(this.color, 0.02) || "rgba(0, 0, 0, 0.02)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleUpdate = function(particle) {
        context.beginPath();
        context.strokeStyle = particle.color;
        context.lineWidth = 1;
        context.moveTo(particle.old.p.x, particle.old.p.y);
        context.lineTo(particle.p.x, particle.p.y);
        context.closePath();
        context.stroke();
      };

      return renderer;
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$8 = script$8;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "source-over"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$8 = normalizeComponent$1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

const COLOR = [
  "#f6b93b",
  "#18dcff",
  "#cd84f1",
  "#ED4C67",
  "#ffffff",
  "#b71540",
  "#32ff7e",
  "#ff3838"
];

var script$9 = {
  name: "PolygonParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.createProton(canvas);
      this.createEmitter({
        canvas,
        x: width / 2,
        y: height / 2,
        mainEmitter: true,
        zone: "bound"
      });

      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      this.proton = new Proton();
      const renderer = this.createRenderer(canvas);
      this.proton.addRenderer(renderer);
    },

    createRenderer(canvas) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CustomRenderer();
      renderer.onProtonUpdate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = particle => {
        particle.data.count = Proton.MathUtil.randomAToB(3, 10, true);
      };

      renderer.onParticleUpdate = particle => {
        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;

        context.translate(particle.p.x, particle.p.y);
        context.rotate(Proton.MathUtil.degreeTransform(particle.rotation));
        context.translate(-particle.p.x, -particle.p.y);

        context.beginPath();
        drawPolygon(particle, particle.data.count);

        context.closePath();
        context.fill();
        context.globalAlpha = 1;
        context.restore();
      };

      renderer.onParticleDead = particle => {};

      const drawPolygon = (particle, count) => {
        if (count >= 7) {
          context.arc(
            particle.p.x,
            particle.p.y,
            particle.radius,
            0,
            Math.PI * 2,
            true
          );
        } else {
          const radius = particle.radius;

          for (let i = 0; i <= count; i++) {
            let x =
              particle.p.x +
              radius * Math.cos((((Math.PI / 180) * 360) / count) * i);
            let y =
              particle.p.y +
              radius * Math.sin((((Math.PI / 180) * 360) / count) * i);

            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
        }
      };

      return renderer;
    },

    createEmitter({
      mainEmitter,
      canvas,
      x,
      y,
      radius,
      color = COLOR,
      zone = "dead",
      once = "all",
      alpha = 0.85,
      gravity = 3.5
    }) {
      const emitter = this.proton.pool.get(Proton.Emitter);

      if (!emitter.completed) {
        emitter.rate = new Proton.Rate(
          this.num ? new Proton.Span(this.num) : new Proton.Span(4, 9),
          new Proton.Span(1.6, 2.2)
        );

        const radiusInit = mainEmitter
          ? new Proton.Radius(10, 110)
          : new Proton.Radius(3, radius);
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(radiusInit);
        emitter.addInitialize(new Proton.Life(3, 6));
        emitter.addInitialize(
          new Proton.Velocity(
            new Proton.Span(4, 6),
            new Proton.Span(-90, 90),
            "polar"
          )
        );

        emitter.addBehaviour(new Proton.Alpha(alpha, 0.2));
        emitter.addBehaviour(new Proton.Color(color));
        emitter.addBehaviour(new Proton.Scale(1, 0.3));
        emitter.addBehaviour(new Proton.Rotate());
        emitter.addBehaviour(new Proton.Gravity(gravity));

        emitter.addBehaviour(this.customDeadBehaviour(canvas));
        emitter.addBehaviour(
          new Proton.CrossZone(
            new Proton.RectZone(0, 0, canvas.width, canvas.height),
            zone
          )
        );
      }

      emitter.p.x = x;
      emitter.p.y = y;
      if (once === "once") emitter.emit("once");
      else emitter.emit();

      this.proton.addEmitter(emitter);
      //this.expireEmitter(emitter);
    },

    expireEmitter(emitter) {
      setTimeout(() => {
        emitter.completed = true;
        this.proton.pool.expire(emitter);
        this.proton.removeEmitter(emitter);
      }, 500);
    },

    customDeadBehaviour(canvas) {
      return {
        initialize: particle => {
          particle.data = particle.data || {};
          particle.data.oldRadius = particle.radius;
          particle.data.emitterCount = 0;
        },
        applyBehaviour: particle => {
          if (particle.radius < 5) return;
          if (particle.data.emitterCount >= 2) return;

          if (particle.radius <= (1 / 3) * particle.data.oldRadius) {
            particle.data.emitterCount++;
            this.createEmitter({
              canvas,
              x: particle.p.x,
              y: particle.p.y,
              radius: particle.radius * (1 / 2),
              alpha: 0.5,
              gravity: 5,
              color: particle.color,
              once: "once"
            });
          }
        }
      };
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$9 = script$9;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "xor"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$9 = normalizeComponent$1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

const colors$3 = [
  "#fad390",
  "#81ecec",
  "#ffffff",
  "#badc58",
  "#f9ca24",
  "#FEA47F"
];
var script$10 = {
  name: "SquareParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
      if (this.color) {
        canvas.style.backgroundColor = this.color;
      }
    },
    canvasResize({ width, height }) {
      const dis = 150;
      this.crossZoneBehaviour.zone.width = width + 2 * dis;
      this.crossZoneBehaviour.zone.height = height + 2 * dis;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.num ? this.num : 50);
      emitter.damping = 0;

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(4, 70));
      emitter.addInitialize(
        new Proton.Velocity(new Proton.Span(4, 12), 180, "polar")
      );
      emitter.addInitialize(
        new Proton.Position(new Proton.LineZone(0, 0, canvas.width, 0))
      );

      const dis = 150;
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(
          0 - dis,
          0 - dis,
          canvas.width + 2 * dis,
          canvas.height + 2 * dis
        ),
        "cross"
      );
      emitter.addBehaviour(crossZoneBehaviour);
      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.1, 0.55)));
      emitter.addBehaviour(new Proton.Color(colors$3));

      emitter.emit("once");
      this.proton.addEmitter(emitter);
      const renderer = this.createRenderer(canvas);
      this.proton.addRenderer(renderer);

      this.crossZoneBehaviour = crossZoneBehaviour;
      emitter.preEmit(2);
    },
    createRenderer(canvas) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CustomRenderer();

      renderer.onProtonUpdate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = particle => {
        const w = particle.radius || 60;
        const h = Proton.MathUtil.randomAToB(100, 200, "int");
        particle.data.w = w;
        particle.data.h = h;
      };

      renderer.onParticleUpdate = particle => {
        const w = particle.data.w;
        const h = particle.data.h;
        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;

        context.translate(particle.p.x, particle.p.y);
        context.rotate(Proton.MathUtil.degreeTransform(particle.rotation));
        context.translate(-particle.p.x, -particle.p.y);

        context.beginPath();
        context.rect(particle.p.x - w / 2, particle.p.y - h / 2, w, h);

        context.closePath();
        context.fill();
        context.globalAlpha = 1;
        context.restore();
      };

      return renderer;
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$10 = script$10;

/* template */
var __vue_render__$10 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "lighter"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$10 = [];
__vue_render__$10._withStripped = true;

  /* style */
  const __vue_inject_styles__$10 = undefined;
  /* scoped */
  const __vue_scope_id__$10 = undefined;
  /* module identifier */
  const __vue_module_identifier__$10 = undefined;
  /* functional template */
  const __vue_is_functional_template__$10 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$10 = normalizeComponent$1(
    { render: __vue_render__$10, staticRenderFns: __vue_staticRenderFns__$10 },
    __vue_inject_styles__$10,
    __vue_script__$10,
    __vue_scope_id__$10,
    __vue_is_functional_template__$10,
    __vue_module_identifier__$10,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

const colors$4 = [
  "#529B88",
  "#CDD180",
  "#FFFA32",
  "#FB6255",
  "#FB4A53",
  "#FF4E50",
  "#F9D423"
];

var script$11 = {
  name: "FountainParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
      if (this.color) {
        canvas.style.backgroundColor = this.color;
      }
    },
    canvasResize({ width, height }) {
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(
        this.num ? new Proton.Span(this.num) : new Proton.Span(4, 8),
        new Proton.Span(0.1, 0.25)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(20, 200));
      emitter.addInitialize(new Proton.Life(2, 4));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(4, 7),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      emitter.addInitialize(
        new Proton.Position(new Proton.CircleZone(width / 2, height / 2, 100))
      );

      emitter.addBehaviour(new Proton.Alpha(1, 0));
      emitter.addBehaviour(new Proton.Scale(0.2, 1));
      emitter.addBehaviour(this.createCustomBehaviour());
      emitter.addBehaviour(new Proton.Color(colors$4, "random"));
      emitter.emit();
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
    },
    createCustomBehaviour() {
      const f = 10 * 100;
      return {
        initialize: function(particle) {
          particle.f = new Proton.Vector2D(0, 0);
        },
        applyBehaviour: particle => {
          let length = particle.v.length() / 1000;
          let gradient = particle.v.getGradient();
          gradient += 3.14 / 2;

          particle.f.x = f * length * Math.cos(gradient);
          particle.f.y = f * length * Math.sin(gradient);
          particle.a.add(particle.f);
        }
      };
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$11 = script$11;

/* template */
var __vue_render__$11 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "xor"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$11 = [];
__vue_render__$11._withStripped = true;

  /* style */
  const __vue_inject_styles__$11 = undefined;
  /* scoped */
  const __vue_scope_id__$11 = undefined;
  /* module identifier */
  const __vue_module_identifier__$11 = undefined;
  /* functional template */
  const __vue_is_functional_template__$11 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$11 = normalizeComponent$1(
    { render: __vue_render__$11, staticRenderFns: __vue_staticRenderFns__$11 },
    __vue_inject_styles__$11,
    __vue_script__$11,
    __vue_scope_id__$11,
    __vue_is_functional_template__$11,
    __vue_module_identifier__$11,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

var script$12 = {
  name: "TadpoleParticles",
  components: {
    CanvasComp: __vue_component__$2
  },
  props: {
    canvas: Object,
    bg: Boolean,
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const emitter = new Proton.Emitter();
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.num ? this.num : 50);
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(5, 9));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(1.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      emitter.addInitialize(
        new Proton.Position(new Proton.RectZone(0, 0, width, height))
      );

      const mouseInfo = {
        x: width / 2,
        y: height / 2
      };

      const attractionBehaviour = new Proton.Attraction(mouseInfo, 0, 0);
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "bound"
      );
      emitter.addBehaviour(new Proton.Color(this.color || "#bbbbbb"));
      //emitter.addBehaviour(new Proton.Alpha(new Proton.Span(0.5, 1)));
      emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
      emitter.addBehaviour(new Proton.RandomDrift(15, 15, 0.05));
      emitter.emit("once");

      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    createRenderer(canvas) {
      const jointCount = 12;
      const delayTime = 6;
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);

      renderer.onProtonUpdate = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = particle => {
        particle.data.points = [];
        particle.data.index = 0;
      };

      renderer.onParticleUpdate = function(particle) {
        drawTadpoleTail(particle);
        if (particle.data.index % delayTime === 0) fillPointsData(particle);
        drawTadpoleHead(particle);
        particle.data.index++;
      };

      const fillPointsData = particle => {
        particle.data.points.unshift(particle.p.y);
        particle.data.points.unshift(particle.p.x);

        if (particle.data.points.length > jointCount) {
          particle.data.points.pop();
          particle.data.points.pop();
        }
      };

      const drawTadpoleHead = particle => {
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(
          particle.p.x,
          particle.p.y,
          particle.radius,
          0,
          Math.PI * 2,
          true
        );
        context.closePath();
        context.fill();
      };

      const drawTadpoleTail = particle => {
        context.beginPath();
        context.strokeStyle = particle.color;

        context.moveTo(particle.p.x, particle.p.y);

        const l = particle.data.points.length;
        for (let i = 0; i < l; i += 2) {
          const x = particle.data.points[i];
          const y = particle.data.points[i + 1];

          context.lineWidth = linearEvaluation(i, l);
          context.lineTo(x, y);
          context.stroke();
        }
      };

      const linearEvaluation = (i, l) => {
        if (l <= 2) return 1;

        const max = 6;
        const A = (max - 1) / (2 / l - 1);
        const B = 1 - A;
        const X = (i + 2) / l;
        let val = A * X + B;
        val = val >> 0;

        return val;
      };

      return renderer;
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestory() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};

/* script */
const __vue_script__$12 = script$12;

/* template */
var __vue_render__$12 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("canvas-comp", {
    attrs: {
      bg: _vm.bg,
      canvas: _vm.canvas,
      "global-composite-operation": "xor"
    },
    on: {
      canvasInited: _vm.canvasInited,
      canvasResize: _vm.canvasResize,
      canvasMouseDown: _vm.canvasMouseDown
    }
  })
};
var __vue_staticRenderFns__$12 = [];
__vue_render__$12._withStripped = true;

  /* style */
  const __vue_inject_styles__$12 = undefined;
  /* scoped */
  const __vue_scope_id__$12 = undefined;
  /* module identifier */
  const __vue_module_identifier__$12 = undefined;
  /* functional template */
  const __vue_is_functional_template__$12 = false;
  /* component normalizer */
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$12 = normalizeComponent$1(
    { render: __vue_render__$12, staticRenderFns: __vue_staticRenderFns__$12 },
    __vue_inject_styles__$12,
    __vue_script__$12,
    __vue_scope_id__$12,
    __vue_is_functional_template__$12,
    __vue_module_identifier__$12,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  name: "ParticlesBg",
  components: {
    ColorParticles: __vue_component__$3,
    CircleParticles: __vue_component__$4,
    CobwebParticles: __vue_component__$5,
    ThickParticles: __vue_component__$6,
    LinesParticles: __vue_component__$8,
    FountainParticles: __vue_component__$11,
    CustomParticles: __vue_component__$7,
    PolygonParticles: __vue_component__$9,
    SquareParticles: __vue_component__$10,
    TadpoleParticles: __vue_component__$12,
    BallParticles: __vue_component__$1
  },
  props: {
    type: {
      type: String,
      required: false,
      default: "random"
    },
    num: [String, Number],
    bg: Boolean,
    color: String,
    config: Object,
    canvas: Object,
    list: Array,
    globalCompositeOperation: String
  },
  data() {
    return {
      particles: "color-particles"
    };
  },
  methods: {
    getNum() {
      return +this.num;
    },
    getRandom() {
      if (!this.random) {
        // Code source from here, thanks author
        // https://github.com/drawcall/Proton/blob/gh-pages/source/src/utils/Rand.js
        this.random = new Rand();
        this.random.set(0.25, "color-particles");
        this.random.set(0.2, "ball-particles");
        this.random.set(0.2, "circle-particles");
        this.random.set(0.2, "cobweb-particles");
        this.random.set(0.2, "thick-particles");
        this.random.set(0.2, "lines-particles");
        this.random.set(0.2, "fountain-particles");
        this.random.set(0.2, "polygon-particles");
        this.random.set(0.2, "square-particles");
        this.random.set(0.2, "tadpole-particles");
      }
      return this.random.getResult();
    },

    getFromList(){
      if(!this.list) return this.getRandom();
      let item = this.list[Math.floor(Math.random() * this.list.length)];
      item = this.transformName(item);

      return item;
    },

    transformName(name){
      name = String(name).toLowerCase() || "random";
      if (name.indexOf("-") <= 0) name += "-particles";
      return name;
    },

    setParticles() {
      this.particles = this.transformName(this.type);
      if (this.particles.indexOf("random") === 0) {
        this.particles = this.getRandom();
      }

      if (this.particles.indexOf("list") === 0) {
        this.particles = this.getFromList();
      }
    }
  },
  created() {
    this.setParticles();
  },
  beforeMount() {}
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(_vm.particles, {
    tag: "component",
    attrs: {
      globalCompositeOperation: _vm.globalCompositeOperation,
      num: _vm.getNum(),
      bg: _vm.bg,
      color: _vm.color,
      canvas: _vm.canvas,
      config: _vm.config
    }
  })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-06308af2_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"ParticlesBg.vue"}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-06308af2";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  /* style inject */
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent$1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

const components = {
  ParticlesBg: __vue_component__
};

const install = function(Vue) {
  if (install.installed) return;

  for (let key in components) {
    Vue.component(components[key].name, components[key]);
  }
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const VueParticlesBg = {
  install,
  ParticlesBg: __vue_component__
};

exports.ParticlesBg = __vue_component__;
exports['default'] = VueParticlesBg;

Object.defineProperty(exports, '__esModule', { value: true });

})));
