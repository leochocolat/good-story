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
            this.timelineShow.to(this.$el, { duration: 0.5, alpha: 1 });
            return this.timelineShow;
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.5, alpha: 0 });
            return this.timelineHide;
        },
    },
};
