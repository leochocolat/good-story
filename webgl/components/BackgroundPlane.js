// Vendor
import { Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, ShaderMaterial, Texture, Vector2 } from 'three';

// Utils
import ResourceLoader from '@/utils/ResourceLoader';

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

        this._progress = 0;
        this._activeImage = null;
        this._activeTexture = null;

        this._material = this._createMaterial();
        this._plane = this._createPlane();
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

    /**
     * Private
     */
    _createMaterial() {
        const material = new ShaderMaterial({
            uniforms: {
                u_resolution: { value: new Vector2(this._width, this._height) },
                u_texture: { value: null },
                u_texture_size: { value: new Vector2(0, 0) },
            },
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
}
