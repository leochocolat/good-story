// Vendor
import gsap from 'gsap';

export default {
    props: ['content'],

    methods: {
        /**
         * Public
         */
        show() {
            this.timelineHide?.kill();
            this.timelineShow = new gsap.timeline();
            this.timelineShow.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
            this.timelineShow.fromTo(this.$el, { scale: 1.03 }, { duration: 1, scale: 1, ease: 'sine.out' }, 0);
            return this.timelineShow;
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
            return this.timelineHide;
        },
    },
};
