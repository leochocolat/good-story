// Vendor
import { PerspectiveCamera } from 'three';

export default class UICamera extends PerspectiveCamera {
    constructor({ width, height, perspective, near, far }) {
        super(75, width / height, near, far);

        this._width = width;
        this._height = height;
        this._perspective = perspective;

        this.position.z = this._perspective;

        this.resize({ width, height });
    }

    /**
     * Public
     */
    resize({ width, height }) {
        this._width = width;
        this._height = height;

        this.aspect = this._width / this._height;
        this.fov = (180 * (2 * Math.atan(this._height / 2 / this._perspective))) / Math.PI;
        this.updateProjectionMatrix();
    }
}
