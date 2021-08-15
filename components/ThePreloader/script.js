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
            this.resourceLoader = new ResourceLoader(resources, './');
        },

        setupEventListeners() {
            this.resourceLoader.addEventListener('complete', this.completeHandler);
        },

        completeHandler() {
            this.$store.dispatch('preloader/setReady');
        },
    },
};
