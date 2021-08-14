// Vendor
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene } from 'three';

export default class Main extends Scene {
    constructor(options) {
        super();

        this._options = options;
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._width = options.width;
        this._height = options.height;
        this._mousePosition = options.mousePosition;

        this._camera = this._createCamera();
        this._camera.position.z = 5;

        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new Mesh(geometry, material);
        this.add(cube);
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
    get camera() {
        return this._camera;
    }

    /**
     * Setters
     */

    /**
     * Public
     */
    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }

    mousemove(position) {
        this._mousePosition = position;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCamera(45, this._width / this._height, 0.1, 1000);
        return camera;
    }
}
