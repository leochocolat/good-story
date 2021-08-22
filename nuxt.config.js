export default {
    /*
     ** Nuxt target
     ** See https://nuxtjs.org/api/configuration-target
     */
    target: 'server',
    /*
     ** Headers of the page
     ** See https://nuxtjs.org/api/configuration-head
     */
    head: {
        title: 'Good Story - Live and Digital Experiences',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', property: 'description', content: "Good Story raconte et met en scène votre histoire à travers un véritable parcours d'expériences. Chaque événement (live, digital, immersif) possède sa propre identité. Sa finalité est de nourrir et embarquer vos communautés sur la durée." },
            { hid: 'og:title', name: 'og:title', property: 'og:title', content: 'Good Story - Live and Digital Experiences' },
            { hid: 'og:description', name: 'og:description', property: 'og:description', content: "Good Story raconte et met en scène votre histoire à travers un véritable parcours d'expériences. Chaque événement (live, digital, immersif) possède sa propre identité. Sa finalité est de nourrir et embarquer vos communautés sur la durée." },
            { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'website' },
            { hid: 'og:url', name: 'og:url', property: 'og:url', content: 'https://www.goodstory.events/' },
            { hid: 'og:image', name: 'og:image', property: 'og:image', content: '/images/image-5.jpg' },
        ],
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
    /*
     ** CSS Style Resources
     */
    styleResources: {
        scss: ['@/assets/styles/resources/_variables.scss', '@/assets/styles/resources/_mixins.scss', '@/assets/styles/resources/_functions.scss', '@/assets/styles/resources/_breakpoints.scss'],
    },
    /*
     ** Global CSS
     */
    css: ['@/assets/styles/app.scss'],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: ['@/plugins/init.client.js', '@/plugins/init.js'],
    /*
     ** Auto import components
     ** See https://nuxtjs.org/api/configuration-components
     */
    components: false,
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/stylelint-module
        '@nuxtjs/stylelint-module',
        '@nuxt/components',
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://github.com/nuxt-community/dotenv-module
        '@nuxtjs/dotenv',
        '@nuxtjs/style-resources',
        '@nuxtjs/svg',
    ],
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {
        extend(config) {
            /**
             * GLSL loader
             */
            config.module.rules.push({
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'glslify-loader'],
            });
        },

        transpile: ['three'],
    },

    server: {
        port: 3000,
        host: '0.0.0.0',
    },
};
