/**
 * @name: fullscreen.js
 * @author: yangcongcong
 * @date: 2025/3/18
 * @description: 基于全屏api封装兼容不支持 fullscreen的情况：使用css模拟全屏
 */
import fscreen from './fscreenApi';
const FixedIndex = 9998; // 全屏时的层级
export default {
  methods: {
    // 获取整个对象
    getCurrentInstance() {
      return fscreen;
    },

    // 是否支持全屏api
    isSupportFullscreen() {
      return fscreen.fullscreenEnabled;
    },

    // 是否在全屏状态
    isFullscreen(containerEl) {
      if (!containerEl) return;
      const isSupport = this.isSupportFullscreen();
      if (isSupport) {
        return !!fscreen.fullscreenElement;
      } else {
        const styles = containerEl.style;
        return styles && styles['z-index'] && styles['z-index'] === `${FixedIndex}`; // 判断是否处于全屏
      }
    },

    // 请求全屏
    requestFullscreen(containerEl) {
      if (!containerEl) return;
      const isSupport = this.isSupportFullscreen();
      if (isSupport) {
        fscreen.requestFullscreen(containerEl);
      } else {
        Object.assign(containerEl.style, { ...this.FullscreenStyles.full, zIndex: FixedIndex });
      }
    },

    // 取消全屏
    exitFullscreen(containerEl, initStyles = {}) {
      if (!containerEl) return;
      const isSupport = this.isSupportFullscreen();
      if (isSupport) {
        fscreen.exitFullscreen();
      } else {
        Object.assign(containerEl.style, {
          ...this.FullscreenStyles.init,
          ...initStyles,
        });
      }
    },
  },
};
