// Assets
import data from '@/assets/data.js';

export default {
    computed: {
        data() {
            return data;
        },

        sections() {
            const sections = [];
            // const offset = Math.round(Math.random() * 1000);
            const offset = 0;

            for (let i = 0; i < this.data.images.length; i++) {
                const image = this.data.images[(i + offset) % this.data.images.length];
                const text = this.data.sentences[(i + offset) % this.data.sentences.length];
                sections.push({ image, text });
            }

            return sections;
        },
    },
};
