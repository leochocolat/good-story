// Vendor
import { Vector2, WebGLRenderer } from 'three';
import gsap from 'gsap';

// Utils
import bindAll from '@/utils/bindAll';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import Main from './scenes/Main';

export default class WebGLApplication {
    constructor(options) {
        this._options = options;
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;

        this._width = WindowResizeObserver.viewportWidth;
        this._height = WindowResizeObserver.viewportHeight;

        this._debugger = this._nuxtRoot.debugger;

        this._mousePosition = {
            screen: new Vector2(),
            normalized: new Vector2(),
        };

        this._bindAll();

        this._renderer = this._createRenderer();
        this._scene = this._createScene();

        this._setupEventListeners();
    }

    /**
     * Getters
     */
    get scene() {
        return this._scene;
    }

    /**
     * Setters
     */

    /**
     * Lifecycle
     */
    destroy() {
        this._removeEventListeners();
        this._scene.destroy();
    }

    /**
     * Public
     */

    /**
     * Private
     */
    _createRenderer() {
        const renderer = new WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
        });

        renderer.setSize(this._width, this._height, false);

        return renderer;
    }

    _createScene() {
        const scene = new Main({
            canvas: this._canvas,
            renderer: this._renderer,
            nuxtRoot: this._nuxtRoot,
            width: this._width,
            height: this._height,
            debugger: this._debugger,
            mousePosition: this._mousePosition,
        });

        return scene;
    }

    _render() {
        this._renderer.render(this._scene, this._scene.camera);
    }

    _update() {
        this._scene.update();
    }

    _resize({ width, height }) {
        this._width = width;
        this._height = height;

        this._renderer.setSize(this._width, this._height, false);
        this._scene.resize(this._width, this._height);
    }

    _bindAll() {
        bindAll(this, '_resizeHandler', '_tickHandler', '_mousemoveHandler');
    }

    _setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
        window.addEventListener('mousemove', this._mousemoveHandler);
        gsap.ticker.add(this._tickHandler);
    }

    _removeEventListeners() {
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
        window.removeEventListener('mousemove', this._mousemoveHandler);
        gsap.ticker.remove(this._tickHandler);
    }

    _tickHandler() {
        this._update();
        this._render();
    }

    _resizeHandler(e) {
        this._resize({ width: e.width, height: e.height });
    }

    _mousemoveHandler(e) {
        const x = (e.clientX / this._width) * 2 - 1;
        const y = -(e.clientY / this._height) * 2 + 1;

        this._mousePosition.screen.x = e.clientX;
        this._mousePosition.screen.y = e.clientY;

        this._mousePosition.normalized.x = x;
        this._mousePosition.normalized.y = y;

        this._scene.mousemove(this._mousePosition);
    }
}
