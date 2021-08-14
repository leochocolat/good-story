const actions = {
    setSizes({ commit }, { width, height }) {
        commit('SET_SIZES', { width, height });
    },

    setBreakpoint({ commit }, breakpoint) {
        commit('SET_BREAKPOINT', breakpoint);
    },

    setTouch({ commit }, value) {
        commit('SET_TOUCH', value);
    },

    setGpuTier({ commit }, value) {
        commit('SET_GPU_TIER', value);
    },
};

export default actions;
