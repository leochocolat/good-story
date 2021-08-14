// Vendor
import gsap from 'gsap';

export default {
    data() {
        return {
            content: this.label,
        };
    },

    props: ['label'],

    watch: {
        label(newValue) {
            this.timelineUpdate?.kill();
            this.timelineUpdate = new gsap.timeline();
            this.timelineUpdate.to(this.$refs.label, { duration: 0.2, alpha: 0 });
            this.timelineUpdate.call(() => { this.content = newValue; }, null);
            this.timelineUpdate.to(this.$refs.label, { duration: 0.2, alpha: 1 });
        },
    },

    methods: {
        /**
         * Public
         */
        setProgress(progress) {
            this.$refs.center.style.transform = `scale(${progress})`;
        },
    },
};
