/**
 * @name: fullscreen.js
 * @author: yangcongcong
 * @date: 2025/3/9
 * @description: 处理全屏相关的兼容写法
 */
export default {
  methods: {
    // 判断是否全屏
    isFullScreen(currentEle) {
      // for older versions of Safari and IOS, `isFullscreenEnabled` will return false
      const presentationMode = currentEle?.webkitPresentationMode;
      if (this.isApple() && presentationMode) {
        return presentationMode === 'fullscreen';
      }

      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    },

    // 进入全屏
    enterFullScreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.webkitEnterFullscreen) {
        // for older versions of Safari and IOS, `isFullscreenEnabled` will return false
        element.webkitEnterFullscreen();
      }
    },

    // 退出全屏
    exitFullScreen(element) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (element.webkitExitFullscreen) {
        // for older versions of Safari and IOS, `isFullscreenEnabled` will return false
        element.webkitExitFullscreen();
      }
    },
  },
};
