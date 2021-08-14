// Vendor
import gsap from 'gsap';

// Utils
import easings from '@/utils/easings';
import math from '@/utils/math';

// Mixins
import page from '@/mixins/page';

// Components
import Navigation from '@/components/Navigation';
import ButtonHold from '@/components/ButtonHold';

const HOLD_SPEED = 0.01;

export default {
    mixins: [page],

    data() {
        return {
            delta: 0,
            holdProgress: 0,
            state: 'notouch',
            labels: {
                notouch: '<b>Maintenez</b> le click',
                touchstart: '<b>Maintenez</b> le click',
                touchcomplete: '<b>Lachez</b> pour revenir',
            },
        };
    },

    mounted() {
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        transitionInit() {
            gsap.set(this.$el, { alpha: 0 });
        },

        firstReveal(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 1, ease: 'circ.inOut' });

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 1, ease: 'circ.inOut' });

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 0, ease: 'circ.inOut' });

            return timeline;
        },

        /**
         * Private
         */
        setupEventListeners() {
            this.$el.addEventListener('mousedown', this.mousedownHandler);
            this.$el.addEventListener('mouseup', this.mouseupHandler);
            gsap.ticker.add(this.tickHandler);
        },

        removeEventListeners() {
            this.$el.removeEventListener('mousedown', this.mousedownHandler);
            this.$el.removeEventListener('mouseup', this.mouseupHandler);
            gsap.ticker.remove(this.tickHandler);
        },

        mousedownHandler() {
            this.delta = HOLD_SPEED;

            this.state = 'touchstart';
        },

        mouseupHandler() {
            this.delta = -HOLD_SPEED;

            this.state = 'notouch';
        },

        tickHandler() {
            this.holdProgress += this.delta;
            this.holdProgress = math.clamp(this.holdProgress, 0, 1);
            const progress = easings.easeInOutQuad(this.holdProgress);
            this.$refs.buttonHold.setProgress(progress);

            if (this.$root.webgl) this.$root.webgl.scene.progress = progress;

            if (this.holdProgress === 1) {
                this.state = 'touchcomplete';
            }
        },
    },

    components: {
        Navigation,
        ButtonHold,
    },
};
