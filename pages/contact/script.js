// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

// Mixins
import page from '@/mixins/page';
import content from '@/mixins/content';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Components
import Navigation from '@/components/Navigation';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
    mixins: [page, content],

    watch: {
        isReady(isReady) {
            if (isReady) {
                this.$root.webgl.scene.progress = 1;
                this.setupLogo();
            };
        },
    },

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
        }),
    },

    mounted() {
        this.tweenObject = {
            colorTransitionProgress: 1,
            progress: 1,
        };

        if (this.isReady) {
            this.$root.webgl.scene.progress = 1;
            this.setupLogo();
        }

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

            timeline.call(() => { this.$store.dispatch('animations/setColorTransitionProgress', 1); }, null, 0);
            timeline.add(this.transitionIn(), 0);

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
            timeline.fromTo(this.$refs.container, { scale: 1.05 }, { duration: 1, scale: 1, ease: 'sine.out' }, 0);
            if (this.logo) timeline.add(this.logo.show(), 0);

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
            timeline.to(this.$refs.container, { duration: 0.5, scale: 1.05, ease: 'sine.in' }, 0);
            timeline.to(this.$root.webgl.scene, { duration: 1.5, progress: 0, ease: 'power3.inOut' }, 0);
            if (this.logo) timeline.add(this.logo.hide(), 0);

            timeline.to(this.tweenObject, {
                duration: 0.3,
                colorTransitionProgress: 0,
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
        setupLogo() {
            if (Breakpoints.current === 'small') return;

            const bounds = this.$refs.logoContainer.getBoundingClientRect();

            if (this.$root.webgl.scene.logoContact) {
                this.logo = this.$root.webgl.scene.logoContact;
            } else {
                this.logo = this.$root.webgl.scene.createLogoContact({
                    containerWidth: bounds.width,
                    containerHeight: bounds.height,
                    position: { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
                });
            }

            this.logo.show();
        },

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        resizeHandler() {
            const bounds = this.$refs.logoContainer.getBoundingClientRect();

            this.$root.webgl.scene.resizeLogoContact({
                width: WindowResizeObserver.width,
                height: WindowResizeObserver.height,
                containerWidth: bounds.width,
                containerHeight: bounds.height,
                position: { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
            });
        },
    },

    components: {
        Navigation,
    },
};
