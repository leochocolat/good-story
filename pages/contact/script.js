// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

// Mixins
import page from '@/mixins/page';
import content from '@/mixins/content';

// Components
import Navigation from '@/components/Navigation';

export default {
    mixins: [page, content],

    watch: {
        isReady(isReady) {
            if (isReady) this.$root.webgl.scene.progress = 1;
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
        }
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

            timeline.to(this.$el, { duration: 0.5, alpha: 1, ease: 'circ.inOut' });

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, { duration: 0.5, alpha: 0, ease: 'circ.inOut' }, 0);
            timeline.to(this.$root.webgl.scene, { duration: 1.5, progress: 0, ease: 'power3.inOut' }, 0);

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
    },

    components: {
        Navigation,
    },
};
