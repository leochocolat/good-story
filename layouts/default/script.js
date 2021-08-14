// Components
import CanvasWebGL from '@/components/CanvasWebGL';
import TheButtonHome from '@/components/TheButtonHome';

export default {
    watch: {
        $route(to, from) {
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },
    },

    mounted() {
        this.$store.dispatch('router/setCurrent', this.$route);
    },

    components: {
        CanvasWebGL,
        TheButtonHome,
    },
};
