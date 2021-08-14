// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebGLApplication from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
        }),
    },

    watch: {
        isReady(isReady) {
            if (isReady) this.setupWebGLApplication();
        },
    },

    mounted() {
        if (this.isReady) this.setupWebGLApplication();
    },

    updated() {
        if (this.isReady) this.setupWebGLApplication();
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
