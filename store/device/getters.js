const getters = {
    width(state) {
        return state.width;
    },

    height(state) {
        return state.height;
    },

    viewportSize(state) {
        return { width: state.width, height: state.height };
    },

    breakpoint(state) {
        return state.breakpoint;
    },

    isTouch(state) {
        return state.isTouch;
    },

    device(state) {
        return state;
    },

    gpuTier(state) {
        return state.gpuTier;
    },
};

export default getters;
