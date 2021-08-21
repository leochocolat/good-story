// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

// Components
import CanvasWebGL from '@/components/CanvasWebGL';
import TheButtonHome from '@/components/TheButtonHome';
import ThePreloader from '@/components/ThePreloader';

// Utils
import Debugger from '@/utils/Debugger';

export default {
    computed: {
        ...mapGetters({
            isDebug: 'context/isDebug',
        }),
    },

    watch: {
        $route(to, from) {
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },
    },

    mounted() {
        if (this.isDebug) this.$root.debugger = new Debugger({ title: 'Good Story' });

        this.$store.dispatch('router/setCurrent', this.$route);

        this.transitionIn();
    },

    updated() {
        // this.$root.debugger?.destroy();
        // if (this.isDebug) this.$root.debugger = new Debugger({ title: 'Good Story' });
    },

    beforeDestroy() {
        // console.log('before destroy');
    },

    methods: {
        transitionIn() {
            this.$refs.buttonHome.show();
        },
    },

    components: {
        CanvasWebGL,
        TheButtonHome,
        ThePreloader,
    },
};
