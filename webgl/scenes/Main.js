// Vendor
import { AmbientLight, BoxGeometry, DirectionalLight, DirectionalLightHelper, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneBufferGeometry, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Components
import UICamera from '../components/UICamera';
import LogoBoolean from '../components/LogoBoolean';
import LogoContact from '../components/LogoContact';
import BackgroundPlane from '../components/BackgroundPlane';

export default class Main extends Scene {
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
        this._activeImage = null;

        this._camera = this._createCamera();
        // this._controls = this._createControls();
        this._ambiantLight = this._createAmbiantLight();
        this._light = this._createLight();
        this._logo = this._createLogo();
        this._backgroundPlane = this._createBackgroundPlane();
        this._logoContact = null;
        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Lifecycle
     */
    update() {
        this._logo.update();
        this._logoContact?.update();
    }

    destroy() {
        this._logo.destroy();
    }

    /**
     * Getters
     */
    get camera() {
        return this._camera;
    }

    get progress() {
        return this._progress;
    }

    get activeImage() {
        return this._activeImage;
    }

    get backgroundPlane() {
        return this._backgroundPlane;
    }

    get logoContact() {
        return this._logoContact;
    }

    /**
     * Setters
     */
    set progress(progress) {
        this._progress = progress;
        this._logo.progress = progress;
        this._backgroundPlane.progress = progress;
    }

    set activeImage(image) {
        this._activeImage = image;
        this._logo.switchSide();
        this._backgroundPlane.activeImage = image;
    }

    /**
     * Public
     */
    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.resize({ width, height });
        this._logo.resize({ width, height });
        this._backgroundPlane.resize({ width, height });
    }

    mousemove(position) {
        this._mousePosition = position;

        this._logo.mousemove(this._mousePosition);
        this._logoContact?.mousemove(this._mousePosition);
    }

    createLogoContact(options) {
        this._logoContact = new LogoContact({
            canvas: this._canvas,
            renderer: this._renderer,
            nuxtRoot: this._nuxtRoot,
            width: this._width,
            height: this._height,
            mousePosition: this._mousePosition,
            debugger: this._debugger,
            // Custom
            ...options,
        });

        this.add(this._logoContact);

        return this._logoContact;
    }

    resizeLogoContact({ width, height, containerWidth, containerHeight, position }) {
        this._logoContact?.resize({
            width,
            height,
            containerWidth,
            containerHeight,
            position,
        });
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new UICamera({
            width: this._width,
            height: this._height,
            perspective: 800,
            near: 0.1,
            far: 10000,
        });

        return camera;
    }

    _createControls() {
        if (!this._debugger) return;
        const controls = new OrbitControls(this._camera, document.body);
        return controls;
    }

    _createAmbiantLight() {
        const light = new AmbientLight(0xffffff, 0.75); // soft white light
        this.add(light);
        return light;
    }

    _createLight() {
        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.x = 0;
        directionalLight.position.y = 37;
        directionalLight.position.z = 1000;
        this.add(directionalLight);

        return directionalLight;
    }

    _createLogo() {
        const logo = new LogoBoolean({
            canvas: this._canvas,
            renderer: this._renderer,
            nuxtRoot: this._nuxtRoot,
            width: this._width,
            height: this._height,
            mousePosition: this._mousePosition,
            debugger: this._debugger,
        });

        this.add(logo);

        return logo;
    }

    _createBackgroundPlane() {
        const plane = new BackgroundPlane({
            canvas: this._canvas,
            renderer: this._renderer,
            nuxtRoot: this._nuxtRoot,
            width: this._width,
            height: this._height,
            mousePosition: this._mousePosition,
            debugger: this._debugger,
        });

        this.add(plane);

        return plane;
    }

    /**
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Main' });
        const lights = folder.addFolder({ title: 'Lights' });
        lights.addInput(this._ambiantLight, 'intensity', { min: 0, max: 1 });
        lights.addInput(this._light, 'position', { label: 'position' });

        return folder;
    }
}
