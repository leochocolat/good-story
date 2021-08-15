// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

// SVG
import Logo from '@/assets/icons/logo.svg?inline';

export default {
    computed: {
        ...mapGetters({
            colorTransitionProgress: 'animations/colorTransitionProgress',
        }),
    },

    watch: {
        colorTransitionProgress(progress) {
            this.timelineColor.progress(progress);
        },
    },

    mounted() {
        this.timelineColor = new gsap.timeline({ paused: true });
        this.timelineColor.to(this.$el, { duration: 1, color: 'white', ease: 'none' }, 0);
        this.timelineColor.to(this.$refs.logoBlack, { duration: 1, alpha: 0, ease: 'none' }, 0);
        this.timelineColor.to(this.$refs.logoWhite, { duration: 1, alpha: 1, ease: 'none' }, 0);
        this.timelineColor.progress(this.colorTransitionProgress);
    },

    components: {
        Logo,
    },
};
