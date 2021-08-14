const mutations = {
    SET_SIZES(state, { width, height }) {
        state.width = width;
        state.height = height;
    },

    SET_BREAKPOINT(state, breakpoint) {
        state.breakpoint = breakpoint;
    },

    SET_TOUCH(state, value) {
        state.isTouch = value;
    },

    SET_GPU_TIER(state, value) {
        state.gpuTier = value;
    },
};

export default mutations;
