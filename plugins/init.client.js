// Utils
import device from '@/utils/device';
import Browser from '@/utils/Browser';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import Breakpoints from '@/utils/Breakpoints';

export default ({ store }) => {
    setup();
    resize();
    setupEventListeners();

    function setup() {
        /**
         * Device
         */
        const isTouch = device.isTouch();
        store.dispatch('device/setTouch', isTouch);

        /**
         * Browser
         */
        const browser = Browser.getClassName();
        store.dispatch('device/browser/setName', browser);
        store.dispatch('device/browser/setSafari', Browser.isSafari());
        store.dispatch('device/browser/setEdge', Browser.isEdge());
        store.dispatch('device/browser/setIE', Browser.isInternetExplorer());
        store.dispatch('device/browser/setFirefox', Browser.isFirefox());
    }

    /**
     * Sizes
     */
    function resize() {
        const width = WindowResizeObserver.width;
        const height = WindowResizeObserver.height;
        const breakpoint = Breakpoints.current;

        store.dispatch('device/setSizes', { width, height });
        store.dispatch('device/setBreakpoint', breakpoint);
    }

    function setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', resizeHandler);
    }

    function resizeHandler() {
        resize();
    }
};
