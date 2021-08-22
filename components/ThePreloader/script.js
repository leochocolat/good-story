// Utils
import ResourceLoader from '@/utils/ResourceLoader';

// Assets
import resources from '@/resources';

export default {
    mounted() {
        this.setupResources();
        this.setupEventListeners();
    },

    methods: {
        setupResources() {
            const basePath = this.$router.options.base === '/' ? '' : this.$router.options.base;
            this.resourceLoader = new ResourceLoader(resources, basePath);
        },

        setupEventListeners() {
            this.resourceLoader.addEventListener('complete', this.completeHandler);
        },

        completeHandler() {
            this.$store.dispatch('preloader/setReady');
        },
    },
};
