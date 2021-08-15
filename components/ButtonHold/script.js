// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

export default {
    props: ['label'],

    data() {
        return {
            content: this.label,
        };
    },

    computed: {
        ...mapGetters({
            colorTransitionProgress: 'animations/colorTransitionProgress',
        }),
    },

    watch: {
        label(newValue) {
            this.timelineUpdate?.kill();
            this.timelineUpdate = new gsap.timeline();
            this.timelineUpdate.to(this.$refs.label, { duration: 0.2, alpha: 0 });
            this.timelineUpdate.call(() => { this.content = newValue; }, null);
            this.timelineUpdate.to(this.$refs.label, { duration: 0.2, alpha: 1 });
        },

        colorTransitionProgress(progress) {
            this.timelineColor.progress(progress);
        },
    },

    mounted() {
        this.timelineColor = new gsap.timeline({ paused: true });
        this.timelineColor.to(this.$el, { duration: 1, color: 'white', ease: 'none' }, 0);
        this.timelineColor.to(this.$refs.center, { duration: 1, backgroundColor: 'white', ease: 'none' }, 0);
        this.timelineColor.to(this.$refs.container, { duration: 1, borderColor: 'white', ease: 'none' }, 0);
        this.timelineColor.progress(this.colorTransitionProgress);
    },

    methods: {
        /**
         * Public
         */
        show() {
            const timeline = new gsap.timeline();
            timeline.to(this.$el, { duration: 0.5, alpha: 1, ease: 'power3.inOut' }, 0);
            return timeline;
        },

        hide() {
            const timeline = new gsap.timeline();
            timeline.to(this.$el, { duration: 0.2, alpha: 0, ease: 'power3.inOut' }, 0);
            return timeline;
        },

        setProgress(progress) {
            this.$refs.center.style.transform = `scale(${progress})`;
        },
    },
};
