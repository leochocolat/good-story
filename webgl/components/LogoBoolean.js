// Vendor
import { Box3, MeshNormalMaterial, MeshStandardMaterial, Object3D, Vector2, Vector3 } from 'three';

// Utils
import math from '@/utils/math';
import ResourceLoader from '@/utils/ResourceLoader';

export default class LogoBoolean extends Object3D {
    constructor(options) {
        super();

        this._options = options;
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;
        this._mousePosition = options.mousePosition;

        this._progress = 0;

        this._settings = {
            lerp: 0.1,
            rotateX: -10,
            rotateY: 10,
            targetPosition: new Vector3(70, 0, 500),
        };

        this._rotation = {
            target: new Vector3(),
            current: new Vector3(),
        };

        this._initialPosition = new Vector3();

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
    get progress() {
        return this._progress;
    }

    /**
     * Setters
     */
    set progress(progress) {
        this._progress = progress;
        this.position.x = this._initialPosition.x + this._settings.targetPosition.x * progress;
        this.position.y = this._initialPosition.y + this._settings.targetPosition.y * progress;
        this.position.z = this._initialPosition.z + this._settings.targetPosition.z * progress;
    }

    /**
     * Public
     */
    resize({ width, height }) {
        this._width = width;
        this._height = height;

        this._scaleValue = this._getScaleValue();
        this._resizeModel();
    }

    mousemove(position) {
        this._mousePosition = position;

        this._rotation.target.x = this._mousePosition.normalized.y * this._settings.rotateX * (Math.PI / 180);
        this._rotation.target.y = this._mousePosition.normalized.x * this._settings.rotateY * (Math.PI / 180);
    }

    /**
     * Private
     */
    _createModel() {
        const model = ResourceLoader.get('logo-reversed').scene;
        // Debug
        // const material = new MeshNormalMaterial({ color: 'white' });
        const material = new MeshStandardMaterial({ color: 'white' });
        model.traverse((child) => { if (child.isMesh) child.material = material; });
        this.add(model);
        return model;
    }

    _getOriginalSize() {
        const box = new Box3().setFromObject(this._model);
        const size = new Vector3();
        box.getSize(size);
        return size;
    }

    _getScaleValue() {
        const scaleX = this._width / this._originalSize.x;
        const scaleY = this._height / this._originalSize.y;
        const scaleValue = (scaleX < scaleY ? scaleY : scaleX) * 1.2;
        return scaleValue;
    }

    _resizeModel() {
        this.scale.set(this._scaleValue, this._scaleValue, this._scaleValue);
        this.position.z = this._originalSize.z * this._scaleValue * 6;
        this._initialPosition.z = this.position.z;
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
        const folder = this._debugger.addFolder({ title: 'Logo' });
        folder.addInput(this._settings, 'lerp', { min: 0, max: 1 });
        folder.addInput(this._settings, 'rotateX', { min: -45, max: 45 });
        folder.addInput(this._settings, 'rotateY', { min: -45, max: 45 });
        folder.addInput(this._settings.targetPosition, 'x', { min: -100, max: 100, label: 'target pos x' });
        folder.addInput(this._settings.targetPosition, 'y', { min: -100, max: 100, label: 'target pos y' });
        folder.addInput(this._settings.targetPosition, 'z', { min: -1000, max: 1000, label: 'target pos z' });
        return folder;
    }
}
