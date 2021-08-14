export default {
    props: ['page'],

    computed: {
        isHome() {
            return this.page === 'home';
        },

        isContact() {
            return this.page === 'contact';
        },
    },
};
