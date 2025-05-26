// Interactive canvas-based component
import { h } from 'vue'
// Should implement: mousemove, mouseout, mouseup, mousedown, click

import Utils from '../stuff/utils.js'

export default {
    methods: {
        setup() {
            const id = `${this.$props.tv_id}-${this._id}-canvas`
            const canvas = document.getElementById(id)
            if (!canvas) return; // Prevent runtime error if not found
            let dpr = window.devicePixelRatio || 1
            canvas.style.width = `${this._attrs.width}px`
            canvas.style.height = `${this._attrs.height}px`
            if (dpr < 1) dpr = 1 // Realy ? That's it? Issue #63
            this.$nextTick(() => {
                var rect = canvas.getBoundingClientRect()
                canvas.width = rect.width * dpr
                canvas.height = rect.height * dpr
                const ctx = canvas.getContext('2d', {
                    // TODO: test the boost:
                    //alpha: false,
                    //desynchronized: true,
                    //preserveDrawingBuffer: false
                })
                ctx.scale(dpr, dpr)
                this.redraw()
                // Fallback fix for Brave browser
                // https://github.com/brave/brave-browser/issues/1738
                if (!ctx.measureTextOrg) {
                    ctx.measureTextOrg = ctx.measureText
                }
                ctx.measureText = text =>
                    Utils.measureText(ctx, text, this.$props.tv_id)
            })
        },
        create_canvas(id, props) {
            this._id = id
            this._attrs = props.attrs
            // Vue 3: use import { h } from 'vue' and call h directly
            return h('div', {
                class: `trading-vue-${id}`,
                style: {
                    left: props.position.x + 'px',
                    top: props.position.y + 'px',
                    position: 'absolute',
                }
            }, [
                h('canvas', {
                    onMousemove: e => this.renderer.mousemove(e),
                    onMouseout: e => this.renderer.mouseout(e),
                    onMouseup: e => this.renderer.mouseup(e),
                    onMousedown: e => this.renderer.mousedown(e),
                    id: `${this.$props.tv_id}-${id}-canvas`,
                    ref: 'canvas',
                    style: props.style,
                    ...props.attrs
                })
            ].concat(props.hs || []))
        },
        redraw() {
            if (!this.renderer) return
            this.renderer.update()
        }
    },
    watch: {
        width(val) {
            this._attrs.width = val
            this.setup()
        },
        height(val) {
            this._attrs.height = val
            this.setup()
        }
    }
}
