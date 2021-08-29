// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

// Utils
import easings from '@/utils/easings';
import math from '@/utils/math';

// Mixins
import page from '@/mixins/page';
import content from '@/mixins/content';

// Components
import Navigation from '@/components/Navigation';
import ButtonHold from '@/components/ButtonHold';
import TextHome from '@/components/TextHome';

const HOLD_SPEED = 0.01;

export default {
    mixins: [page, content],

    data() {
        return {
            state: 'notouch',
            previousIndex: 0,
            currentIndex: 0,
            delta: 0,
            holdProgress: 0,
            isTextVisible: false,
            labels: {
                notouch: '<b>Maintenez</b> appuyé',
                touchstart: '<b>Maintenez</b> appuyé',
                touchcomplete: '<b>Lachez</b> pour revenir',
            },
        };
    },

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
            isTouch: 'device/isTouch',
        }),
    },

    watch: {
        isReady(isReady) {
            if (isReady) this.setup();
        },

        holdProgress(progress) {
            const treshold = 0.7;
            if (progress > treshold) {
                this.isTextVisible = true;
            } else {
                this.isTextVisible = false;
            }
        },

        isTextVisible(isVisible) {
            if (isVisible) {
                this.$refs.text.show();
            } else {
                this.$refs.text.hide();
            }
        },
    },

    mounted() {
        this.allowRelease = false;

        this.tweenObject = {
            colorTransitionProgress: 0,
        };

        if (this.isReady) this.setup();
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

            timeline.add(this.transitionIn(), 0);

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
            if (this.isReady) timeline.add(this.$root.webgl.scene.backgroundPlane.show(), 0);
            timeline.add(this.$refs.buttonHold.show(), 0);

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
            if (this.isReady) timeline.to(this.$root.webgl.scene, { duration: 1.5, progress: 1, ease: 'power3.inOut' }, 0);
            if (this.isReady) timeline.add(this.$root.webgl.scene.backgroundPlane.hide(), 0);
            timeline.add(this.$refs.buttonHold.hide(), 0);

            timeline.to(this.tweenObject, {
                duration: 0.3,
                colorTransitionProgress: 1,
                ease: 'power3.inOut',
                onUpdate: () => {
                    this.$store.dispatch('animations/setColorTransitionProgress', this.tweenObject.colorTransitionProgress);
                },
            }, 0.4);

            return timeline;
        },

        /**
         * Private
         */
        setup() {
            this.setupTimelineHold();
            this.setupTimelineRelease();
            this.setupEventListeners();
            this.$root.webgl.scene.activeImage = this.sections[this.currentIndex].image;
            this.$root.webgl.scene.backgroundPlane.show();
        },

        setupTimelineHold() {
            this.timelineHold = new gsap.timeline({ paused: true, onComplete: this.onHoldCompleteHandler });
            this.timelineHold.to(this.$root.webgl.scene, { duration: 1, progress: 1, ease: 'power3.inOut' }, 0);
            this.timelineHold.to(this.tweenObject, { duration: 0.3, colorTransitionProgress: 1, ease: 'power3.inOut' }, 0.4);
        },

        setupTimelineRelease() {
            this.timelineRelease = new gsap.timeline({ paused: true, onComplete: this.onReleaseCompleteHandler });
            this.timelineRelease.add(this.$refs.buttonHold.hide(), 0);
            this.timelineRelease.to(this.$root.webgl.scene, { duration: 1, progress: 0, ease: 'power3.inOut' }, 0);
            this.timelineRelease.to(this.tweenObject, { duration: 0.3, colorTransitionProgress: 0, ease: 'power3.inOut' }, 0.4);
        },

        setupEventListeners() {
            if (this.isTouch) {
                this.$el.addEventListener('touchstart', this.mousedownHandler);
                this.$el.addEventListener('touchend', this.mouseupHandler);
            } else {
                this.$el.addEventListener('mousedown', this.mousedownHandler);
                this.$el.addEventListener('mouseup', this.mouseupHandler);
            }

            gsap.ticker.add(this.tickHandler);
        },

        removeEventListeners() {
            if (this.isTouch) {
                this.$el.removeEventListener('touchstart', this.mousedownHandler);
                this.$el.removeEventListener('touchend', this.mouseupHandler);
            } else {
                this.$el.removeEventListener('mousedown', this.mousedownHandler);
                this.$el.removeEventListener('mouseup', this.mouseupHandler);
            }

            gsap.ticker.remove(this.tickHandler);
        },

        mousedownHandler() {
            if (this.allowRelease) return;

            this.isHolding = true;

            this.delta = HOLD_SPEED;

            this.state = 'touchstart';
        },

        mouseupHandler() {
            this.delta = -HOLD_SPEED;

            this.isHolding = false;

            this.state = 'notouch';

            // this.$refs.text.hide();
        },

        tickHandler() {
            this.holdProgress += this.delta;
            this.holdProgress = math.clamp(this.holdProgress, 0, 1);

            if (this.allowRelease && !this.isHolding) {
                this.timelineHold.kill();
                this.timelineRelease.progress(1.0 - this.holdProgress);
            } else {
                this.timelineRelease.kill();
                this.timelineHold.progress(this.holdProgress);
            }

            const progress = easings.easeInOutQuad(this.holdProgress);
            this.$refs.buttonHold.setProgress(progress);

            this.$store.dispatch('animations/setColorTransitionProgress', this.tweenObject.colorTransitionProgress);
        },

        onHoldCompleteHandler() {
            this.state = 'touchcomplete';
            this.allowRelease = true;
            // this.$refs.text.show();
        },

        onReleaseCompleteHandler() {
            this.allowRelease = false;
            this.$refs.buttonHold.show();

            // Set active content
            this.previousIndex = this.currentIndex;
            this.currentIndex = (this.currentIndex + 1) % this.sections.length;
            this.$root.webgl.scene.activeImage = this.sections[this.currentIndex].image;
        },
    },

    components: {
        Navigation,
        ButtonHold,
        TextHome,
    },
};
