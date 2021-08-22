// Vendor
import gsap from 'gsap';
import { Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, ShaderMaterial, Texture, Vector2 } from 'three';

// Utils
import ResourceLoader from '@/utils/ResourceLoader';
import easings from '@/utils/easings';
import math from '@/utils/math';
import Breakpoints from '@/utils/Breakpoints';

// Assets
import data from '@/assets/data';

// Shaders
import vertex from '@/webgl/shaders/backgroundPlane/vertex.glsl';
import fragment from '@/webgl/shaders/backgroundPlane/fragment.glsl';

// CSS Variables
import { viewportWidthSmall, viewportWidthMedium, viewportWidthLarge, fontSizeSmall, fontSizeMedium, fontSizeLarge, maxWithLarge } from '@/assets/styles/resources/_variables.scss';

export default class BackgroundPlane extends Object3D {
    constructor(options) {
        super();

        this._options = options;
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._width = options.width;
        this._height = options.height;
        this._mousePosition = options.mousePosition;
        this._debugger = options.debugger;

        this._settings = {
            effect: {
                minIntensity: 0.5,
                maxIntensity: 2.5,
                intensity: {
                    small: 1,
                    medium: 2,
                    large: 2.3,
                },
            },
        };

        this._effectIntensity = this._size(this._settings.effect.intensity[Breakpoints.current]);
        this._effectIntensity = math.clamp(this._effectIntensity, this._settings.effect.minIntensity, this._settings.effect.maxIntensity);

        this._progress = 0;

        this._activeImage = null;
        // Debug
        // this._activeImage = 'https://images.unsplash.com/photo-1628716572776-8a2e8efbad1e?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
        this._activeTexture = (this._activeImage && this._activeImage !== 'null') ? ResourceLoader.get(this._activeImage) : null;

        this._nextImage = null;
        this._nextTexture = (this._nextImage && this._nextImage !== 'null') ? ResourceLoader.get(this._nextImage) : null;

        this._material = this._createMaterial();
        this._plane = this._createPlane();

        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Lifecycle
     */
    update() {

    }

    destroy() {

    }

    /**
     * Getters
     */
    get progress() {
        return this._progress;
    }

    get activeImage() {
        return this._activeImage;
    }

    get nextImage() {
        return this._nextImage;
    }

    /**
     * Setters
     */
    set progress(progress) {
        this._progress = progress;
        this._material.uniforms.u_zoom_progress.value = easings.easeInOutSine(this._progress) * 0.90;
    }

    set activeImage(image) {
        // Set next
        this._nextImage = image;
        this._nextTexture = (this._nextImage && this._nextImage !== 'null') ? ResourceLoader.get(this._nextImage) : null;

        this._material.uniforms.u_texture_next.value = this._nextTexture;

        if (this._nextTexture) {
            this._material.uniforms.u_texture_next_size.value.set(this._nextTexture.image.width, this._nextTexture.image.height);
        };

        gsap.to(this._material.uniforms.u_transition_progress, {
            duration: 0.5,
            value: 1,
            ease: 'sine.inOut',
            onComplete: () => {
                // Set Active
                this._activeImage = image;
                this._activeTexture = image !== 'null' ? ResourceLoader.get(image) : null;

                this._material.uniforms.u_texture.value = this._activeTexture;

                if (this._activeTexture) {
                    this._material.uniforms.u_texture_size.value.set(this._activeTexture.image.width, this._activeTexture.image.height);
                };

                this._material.uniforms.u_transition_progress.value = 0;
            },
        });
    }

    /**
     * Public
     */
    resize({ width, height }) {
        this._width = width;
        this._height = height;

        this._plane.scale.x = this._width;
        this._plane.scale.y = this._height;

        this._plane.material.uniforms.u_resolution.value.x = this._width;
        this._plane.material.uniforms.u_resolution.value.y = this._height;

        this._effectIntensity = this._size(this._settings.effect.intensity[Breakpoints.current]);
        this._effectIntensity = math.clamp(this._effectIntensity, this._settings.effect.minIntensity, this._settings.effect.maxIntensity);

        console.log(this._effectIntensity);

        this._plane.material.uniforms.u_effect_strength.value = this._effectIntensity;
    }

    show() {
        const timeline = new gsap.timeline();
        timeline.to(this._material.uniforms.u_alpha, { duration: 1, value: 1, ease: 'sine.inOut' });
        return timeline;
    }

    hide() {
        const timeline = new gsap.timeline();
        timeline.to(this._material.uniforms.u_alpha, { duration: 1, value: 0, ease: 'sine.inOut' });
        return timeline;
    }

    /**
     * Private
     */
    _createMaterial() {
        const material = new ShaderMaterial({
            uniforms: {
                u_resolution: { value: new Vector2(this._width, this._height) },
                // next Texture
                u_texture_next: { value: this._nextTexture },
                u_texture_next_size: { value: this._nextTexture ? new Vector2(this._nextTexture.image.width, this._nextTexture.image.height) : new Vector2() },
                // Active Texture
                u_texture: { value: this._activeTexture },
                u_texture_size: { value: this._activeTexture ? new Vector2(this._activeTexture.image.width, this._activeTexture.image.height) : new Vector2() },
                // Transitions & Animations
                u_alpha: { value: 1 },
                u_effect_strength: { value: this._effectIntensity },
                u_zoom_progress: { value: 0 },
                u_transition_progress: { value: 0 },
            },
            transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        return material;
    }

    _createPlane() {
        const geometry = new PlaneBufferGeometry(1, 1, 1);
        const mesh = new Mesh(geometry, this._material);
        mesh.scale.set(this._width, this._height, 10);
        this.add(mesh);
        return mesh;
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

    /**
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugger) return;

        const debugFolder = this._debugger.addFolder({ title: 'Background Plane' });
        debugFolder.addInput(this._material.uniforms.u_effect_strength, 'value', { label: 'Effect Strength', min: 0, max: 5 });
        debugFolder.addInput(this._material.uniforms.u_zoom_progress, 'value', { label: 'Zoom progress', min: 0, max: 1 });
        debugFolder.addInput(this._material.uniforms.u_transition_progress, 'value', { label: 'Transition progress', min: 0, max: 1 });
    }
}
