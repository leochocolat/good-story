// Vendor
import { Box3, MeshNormalMaterial, MeshStandardMaterial, Object3D, Vector2, Vector3 } from 'three';

// Utils
import math from '@/utils/math';
import ResourceLoader from '@/utils/ResourceLoader';
import Breakpoints from '@/utils/Breakpoints';

// CSS Variables
import { viewportWidthSmall, viewportWidthMedium, viewportWidthLarge, fontSizeSmall, fontSizeMedium, fontSizeLarge, maxWithLarge } from '@/assets/styles/resources/_variables.scss';

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
            size: {
                large: 30,
                medium: 50,
                small: 25,
            },
            minScale: 28,
            maxScale: 38,
            lerp: 0.1,
            rotateX: -10,
            rotateY: 10,
            targetPosition: new Vector3(70, 0, 500),
        };

        this._rotation = {
            target: new Vector3(),
            current: new Vector3(),
        };

        this._side = -1;

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
        this.position.x = this._initialPosition.x + (this._settings.targetPosition.x * this._side) * progress;
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

    switchSide() {
        this._side *= -1;
    }

    /**
     * Private
     */
    _createModel() {
        const model = ResourceLoader.get('logo-reversed').scene;
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
        const size = this._settings.size[Breakpoints.current];
        const scale = math.clamp(this._size(size), this._settings.minScale, this._settings.maxScale);
        return scale;
    }

    _resizeModel() {
        this.scale.set(this._scaleValue, this._scaleValue, this._scaleValue);
        this.position.z = this._originalSize.z * this._scaleValue * 7;
        this._initialPosition.z = this.position.z;
        this.position.z = this._initialPosition.z + this._settings.targetPosition.z * this._progress;
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

        const interactions = folder.addFolder({ title: 'Interactions' });
        interactions.addInput(this._settings, 'lerp', { min: 0, max: 1 });
        interactions.addInput(this._settings, 'rotateX', { min: -45, max: 45 });
        interactions.addInput(this._settings, 'rotateY', { min: -45, max: 45 });

        const animations = folder.addFolder({ title: 'Animations' });
        animations.addInput(this._settings, 'targetPosition');

        return folder;
    }

    /**
     * Utils
     */
    _media() {
        const media = Breakpoints.current === 'small' ? 'small' : 'large';
        return media;
    }

    _viewportWidth() {
        const sizes = {
            small: viewportWidthSmall,
            medium: viewportWidthMedium,
            large: viewportWidthLarge,
        };

        const viewportWidth = sizes[Breakpoints.current];

        return parseFloat(viewportWidth);
    }

    _vw() {
        const sizes = {
            small: fontSizeSmall,
            medium: fontSizeMedium,
            large: fontSizeLarge,
        };

        const vw = parseFloat(sizes[Breakpoints.current]) / 100 * Math.min(this._width, parseFloat(maxWithLarge));

        return vw;
    }

    _size(value) {
        return (value / (this._viewportWidth() / 100)) * this._vw();
    }
}
