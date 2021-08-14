// SVG
import Logo from '@/assets/icons/logo.svg?inline';

export default {
    computed: {
        color() {
            return this.$route.name === 'index' ? 'black' : 'white';
        },
    },

    components: {
        Logo,
    },
};
