// Vendor
import gsap from 'gsap';
import { Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, ShaderMaterial, Texture, Vector2 } from 'three';

// Utils
import ResourceLoader from '@/utils/ResourceLoader';
import easings from '@/utils/easings';

// Assets
import data from '@/assets/data';

// Shaders
import vertex from '@/webgl/shaders/backgroundPlane/vertex.glsl';
import fragment from '@/webgl/shaders/backgroundPlane/fragment.glsl';

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

        this._progress = 0;
        this._activeImage = 'https://images.unsplash.com/photo-1628716572776-8a2e8efbad1e?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3MXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
        this._activeTexture = (!this._activeImage || this._activeImage !== 'null') ? ResourceLoader.get(this._activeImage) : null;

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

    /**
     * Setters
     */
    set progress(progress) {
        this._progress = progress;
        this._material.uniforms.u_transition_progress.value = easings.easeInOutSine(this._progress);
    }

    set activeImage(image) {
        this._activeImage = image;
        this._activeTexture = image !== 'null' ? ResourceLoader.get(image) : null;
        this._material.uniforms.u_texture.value = this._activeTexture;
        if (!this._activeTexture) return;
        this._material.uniforms.u_texture_size.value.set(this._activeTexture.image.width, this._activeTexture.image.height);
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
                u_texture: { value: this._activeTexture },
                u_texture_size: { value: this._activeTexture ? new Vector2(this._activeTexture.image.width, this._activeTexture.image.height) : new Vector2() },
                u_alpha: { value: 1 },
                u_effect_strength: { value: 2.3 },
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
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugger) return;

        const debugFolder = this._debugger.addFolder({ title: 'Background Plane' });
        debugFolder.addInput(this._material.uniforms.u_effect_strength, 'value', { label: 'Effect Strength', min: 0, max: 5 });
        debugFolder.addInput(this._material.uniforms.u_transition_progress, 'value', { label: 'Transition', min: 0, max: 1 });
    }
}
