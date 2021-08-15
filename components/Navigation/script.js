// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

export default {
    props: ['route', 'routeName'],

    computed: {
        ...mapGetters({
            colorTransitionProgress: 'animations/colorTransitionProgress',
        }),

        isHome() {
            return this.page === 'home';
        },

        isContact() {
            return this.page === 'contact';
        },
    },

    watch: {
        colorTransitionProgress(progress) {
            this.timelineColor.progress(progress);
        },
    },

    mounted() {
        this.timelineColor = new gsap.timeline({ paused: true });
        this.timelineColor.to(this.$el, { duration: 1, color: 'white', ease: 'none' }, 0);
        this.timelineColor.progress(this.colorTransitionProgress);
    },
};
