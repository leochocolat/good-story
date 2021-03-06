// Data
import data from '@/assets/data';

/**
 * Fonts
 */
const fonts = [
    {
        type: 'font',
        name: 'Roboto',
        weight: 300,
    },
    {
        type: 'font',
        name: 'Roboto',
        weight: 400,
    },
    {
        type: 'font',
        name: 'Roboto',
        weight: 500,
    },
];

/**
 * Images
 */
const images = [];

/**
 * Models
 */
const models = [
    {
        name: 'logo',
        type: 'gltf',
        path: '/models/logo.gltf',
    },
    {
        name: 'logo-reversed',
        type: 'gltf',
        path: '/models/logo-reversed.gltf',
    },
    {
        name: 'logo-reversed-v2',
        type: 'gltf',
        path: '/models/logo-reversed-v2.gltf',
    },
];

/**
 * Textures
 */
const textures = () => {
    let i = -1;
    return data.images.map((image) => {
        i++;
        return {
            name: image,
            type: 'texture',
            path: image,
            isAbsolutePath: false,
        };
    });
};

const resources = [...fonts, ...images, ...models, ...textures()];

export default resources;
