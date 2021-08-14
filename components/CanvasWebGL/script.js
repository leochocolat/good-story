import WebGLApplication from '@/webgl';

export default {
    mounted() {
        this.setupWebGLApplication();
    },

    beforeDestroy() {
        this.$root.webgl.destroy();
    },

    methods: {
        setupWebGLApplication() {
            this.$root.webgl = new WebGLApplication({
                parent: this,
                canvas: this.$el,
                nuxtRoot: this.$root,
            });
        },
    },
};
