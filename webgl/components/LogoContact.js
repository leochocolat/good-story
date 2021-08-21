// Vendor
import gsap from 'gsap';
import { Box3, DoubleSide, MeshNormalMaterial, MeshStandardMaterial, Object3D, Vector2, Vector3 } from 'three';

// Utils
import math from '@/utils/math';
import ResourceLoader from '@/utils/ResourceLoader';

export default class LogoContact extends Object3D {
    constructor(options) {
        super();

        // Porps
        this._options = options;
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;
        this._mousePosition = options.mousePosition;

        // Custom props
        this._position = new Vector2(options.position.x, options.position.y);
        this._containerWidth = options.containerWidth;
        this._containerHeight = options.containerHeight;

        this._settings = {
            lerp: 0.1,
            rotateX: -90,
            rotateY: 90,
            opacity: 0,
        };

        this._rotation = {
            target: new Vector3(),
            current: new Vector3(),
        };

        this._material = this._createMaterial();
        this._model = this._createModel();

        this._originalSize = this._getOriginalSize();
        this._scaleValue = this._getScaleValue();

        this._debugFolder = this._createDebugFolder();

        this._resizeModel();
    }

    /**
     * Lifecycle
     */
    update() {
        this._updateRotation();
    }

    destroy() {

    }

    /**
     * Getters
     */

    /**
     * Setters
     */

    /**
     * Public
     */
    resize({ width, height, containerWidth, containerHeight, position }) {
        this._width = width;
        this._height = height;
        this._containerWidth = containerWidth;
        this._containerHeight = containerHeight;
        this._position = position;

        this._scaleValue = this._getScaleValue();
        this._resizeModel();
    }

    mousemove(position) {
        this._mousePosition = position;

        if (this._isTweening) return;

        this._rotation.target.x = this._mousePosition.normalized.y * this._settings.rotateX * (Math.PI / 180);
        this._rotation.target.y = this._mousePosition.normalized.x * this._settings.rotateY * (Math.PI / 180);
    }

    show() {
        this._isTweening = true;

        const timeline = new gsap.timeline({
            onComplete: () => { this._isTweening = false; },
        });

        timeline.call(() => { this.add(this._model); }, null, 0);
        timeline.to(this._material, { duration: 0.5, opacity: 1, ease: 'sine.out' }, 0.5);
        timeline.fromTo(this._rotation.target, { x: 0, y: 540 * (Math.PI / 180) }, { duration: 1.5, x: 0, y: 0, ease: 'power3.out' }, 0.3);

        return timeline;
    }

    hide() {
        this._isTweening = true;

        const timeline = new gsap.timeline({
            onComplete: () => { this._isTweening = false; },
        });

        timeline.to(this._material, { duration: 0.5, opacity: 0, ease: 'sine.inOut' }, 0);
        timeline.call(() => { this.remove(this._model); }, null);

        return timeline;
    }

    /**
     * Private
     */
    _createMaterial() {
        const material = new MeshStandardMaterial({ color: 'white', transparent: true, opacity: this._settings.opacity, side: DoubleSide });
        return material;
    }

    _createModel() {
        const model = ResourceLoader.get('logo').scene;
        model.traverse((child) => { if (child.isMesh) child.material = this._material; });
        return model;
    }

    _getOriginalSize() {
        const box = new Box3().setFromObject(this._model);
        const size = new Vector3();
        box.getSize(size);
        return size;
    }

    _getScaleValue() {
        const scale = this._containerWidth / this._originalSize.x;
        return scale;
    }

    _resizeModel() {
        this.scale.set(this._scaleValue, this._scaleValue, this._scaleValue);
        this.position.x = -this._width / 2 + this._position.x;
        this.position.y = this._height / 2 - this._position.y;
    }

    _updateRotation() {
        this._rotation.current.x = math.lerp(this._rotation.current.x, this._rotation.target.x, this._settings.lerp);
        this._rotation.current.y = math.lerp(this._rotation.current.y, this._rotation.target.y, this._settings.lerp);

        this.rotation.x = this._rotation.current.x;
        this.rotation.y = this._rotation.current.y;
    }

    /**
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugger) return;
        const folder = this._debugger.addFolder({ title: 'Logo Contact' });
        const interactions = folder.addFolder({ title: 'Interactions' });
        interactions.addInput(this._settings, 'lerp', { min: 0, max: 1 });
        interactions.addInput(this._settings, 'rotateX', { min: -45, max: 45 });
        interactions.addInput(this._settings, 'rotateY', { min: -45, max: 45 });
        return folder;
    }
}
