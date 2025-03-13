/**
 * @name: videoEl.js
 * @author: yangcongcong
 * @date: 2025/3/9
 * @description: 描述
 */
const PLAYER_ID = 'DOM_VIDEO_PLAYER';
import coverEl from './coverEl';
import progressEl from './progressEl';
import fullscreen from './fullscreen';
import { CustomPlayStatusOBJ, formatVideoTime } from './utils';
import { CoverStyles, LoadingStyles, LocalImgPath, ProgressStyles } from './styles';
export default {
  mixins: [coverEl, progressEl, fullscreen],
  data() {
    return {
      num: '',
      videoEl: null,
      loadingEl: null,
      // 延迟生效的函数
      delayFunc: null,
      renderProps: {},

      // 是否为全屏状态
      isFullScreenFlag: false,

      CustomPlayStatusOBJ,
      // 当前播放器信息
      videoInformation: {
        duration: 0,
        currentTime: 0,
        status: CustomPlayStatusOBJ.INIT,
      },

      // 样式相关
      ProgressStyles,
      CoverStyles,
      LoadingStyles,

      // 路径
      LocalImgPath,
    };
  },
  computed: {
    playerId() {
      return `${PLAYER_ID}_${this.num}`;
    },
    wrapperId() {
      return `video-wrapper-${this.num}`;
    },
  },
  methods: {
    isApple() {
      const ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1;
    },
    async initVideoPlayer(src) {
      this.delayFunc = null;
      await this.$nextTick();
      if (!src) return;
      if (this.videoEl) {
        // 切换视频源
        if (!this.isApple() && this.loadingEl) {
          this.loadingEl.style.display = 'block';
        }
        this.videoEl.src = src;
        return;
      }

      const videoEl = document.createElement('video');
      this.videoEl = videoEl;
      // 开始监听视频相关事件
      this.listenVideoEvent();

      const { autoplay, muted, controls, loop, playbackRate, objectFit, poster } = this.renderProps;
      videoEl.src = src;
      videoEl.autoplay = autoplay;
      videoEl.controls = controls;
      videoEl.loop = loop;
      videoEl.muted = muted;
      videoEl.playbackRate = playbackRate;
      videoEl.id = this.playerId;
      // videoEl.setAttribute('x5-video-player-type', 'h5')
      videoEl.setAttribute('preload', 'auto');
      videoEl.setAttribute('playsinline', true);
      videoEl.setAttribute('webkit-playsinline', true);
      videoEl.setAttribute('crossorigin', 'anonymous');
      videoEl.setAttribute('controlslist', 'nodownload');
      videoEl.setAttribute('disablePictureInPicture', true);
      videoEl.style.objectFit = objectFit;
      poster && (videoEl.poster = poster);
      videoEl.style.width = '100%';
      videoEl.style.height = '100%';

      // 插入视频元素
      // document.getElementById(this.wrapperId).appendChild(videoEl)
      const playerWrapper = document.getElementById(this.wrapperId);
      playerWrapper.insertBefore(videoEl, playerWrapper.firstChild);

      // 插入loading 元素（遮挡安卓的默认加载过程中的黑色播放按钮）
      this.createLoading();

      // 创建自定义UI层
      this.createCover();
    },
    // 创建 loading
    createLoading() {
      const { isLoading } = this.renderProps;
      if (isLoading) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-wrapper';
        this.loadingEl = loadingEl;
        Object.assign(loadingEl.style, this.LoadingStyles.loadingWrapper);

        document.getElementById(this.wrapperId).appendChild(loadingEl);

        // 创建 loading 动画
        const animationEl = document.createElement('div');
        animationEl.className = 'loading';
        Object.assign(animationEl.style, this.LoadingStyles.loadingCircle);
        loadingEl.appendChild(animationEl);

        // 创建 loading 动画所需的 keyframes
        const style = document.createElement('style');
        const keyframes = `
          @keyframes circle {
            0% {
              transform: rotate(0);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `;
        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = keyframes;
        } else {
          style.appendChild(document.createTextNode(keyframes));
        }
        document.head.appendChild(style);
      }
    },

    // 隐藏loading
    hiddenLoading() {
      if (this.loadingEl) {
        this.loadingEl.style.display = 'none';
      }
    },

    // 监听视频相关事件
    listenVideoEvent() {
      // 监听click
      const clickHandler = () => {
        this.resetCoverTimer();
      };

      this.videoEl.removeEventListener('click', clickHandler);
      this.videoEl.addEventListener('click', clickHandler);

      // 播放事件监听
      const playHandler = () => {
        this.videoInformation.status = CustomPlayStatusOBJ.START;
        this.$ownerInstance.callMethod('eventEmit', { event: 'play' });
        this.$ownerInstance.callMethod('setViewData', {
          key: 'playerStatus',
          value: CustomPlayStatusOBJ.START,
        });

        this.hiddenLoading();

        // 更新播放状态
        this.refreshPlayEl();
      };
      this.videoEl.removeEventListener('play', playHandler);
      this.videoEl.addEventListener('play', playHandler);

      // 暂停事件监听
      const pauseHandler = () => {
        this.videoInformation.status = CustomPlayStatusOBJ.PAUSED;
        this.$ownerInstance.callMethod('eventEmit', { event: 'pause' });
        this.$ownerInstance.callMethod('setViewData', {
          key: 'playerStatus',
          value: CustomPlayStatusOBJ.PAUSED,
        });
        // 更新播放状态
        this.refreshPlayEl();
      };
      this.videoEl.removeEventListener('pause', pauseHandler);
      this.videoEl.addEventListener('pause', pauseHandler);

      // 结束事件监听
      const endedHandler = () => {
        this.videoInformation.status = CustomPlayStatusOBJ.END;
        this.$ownerInstance.callMethod('eventEmit', { event: 'ended' });
        this.$ownerInstance.callMethod('setViewData', {
          key: 'playerStatus',
          value: CustomPlayStatusOBJ.END,
        });
        this.$ownerInstance.callMethod('resetEventCommand');
        // 更新播放状态
        this.refreshPlayEl();
      };
      this.videoEl.removeEventListener('ended', endedHandler);
      this.videoEl.addEventListener('ended', endedHandler);

      // 加载完成事件监听
      const canPlayHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'canplay' });
        this.execDelayFunc();
      };
      this.videoEl.removeEventListener('canplay', canPlayHandler);
      this.videoEl.addEventListener('canplay', canPlayHandler);

      // 加载失败事件监听
      const errorHandler = (e) => {
        this.hiddenLoading();
        this.$ownerInstance.callMethod('eventEmit', { event: 'error', data: e });
      };
      this.videoEl.removeEventListener('error', errorHandler);
      this.videoEl.addEventListener('error', errorHandler);

      // loadedmetadata 事件监听
      const loadedMetadataHandler = (e) => {
        this.hiddenLoading();
        this.$ownerInstance.callMethod('eventEmit', { event: 'loadedmetadata', data: e });
        // 获取视频的长度
        const duration = this.videoEl.duration;
        // 更新renderjs定义的时长
        this.videoInformation.duration = duration;

        this.$ownerInstance.callMethod('eventEmit', {
          event: 'durationchange',
          data: duration,
        });

        this.$ownerInstance.callMethod('setViewData', {
          key: 'duration',
          value: duration,
        });

        // 显示视频总时间
        this.refreshDuration();

        // 加载首帧视频 模拟出封面图
        this.loadFirstFrame();
      };
      this.videoEl.removeEventListener('loadedmetadata', loadedMetadataHandler);
      this.videoEl.addEventListener('loadedmetadata', loadedMetadataHandler);

      // 播放进度监听
      const timeupdateHandler = (e) => {
        const currentTime = e.target.currentTime;
        // 更新renderjs定义的当前时间
        this.videoInformation.currentTime = currentTime;
        this.$ownerInstance.callMethod('eventEmit', {
          event: 'timeupdate',
          data: currentTime,
        });

        this.$ownerInstance.callMethod('setViewData', {
          key: 'currentTime',
          value: currentTime,
        });
        // 刷新当前时间
        this.refreshCurrentTime();
        // 刷新进度条
        this.refreshProgressPercent(currentTime);
      };
      this.videoEl.removeEventListener('timeupdate', timeupdateHandler);
      this.videoEl.addEventListener('timeupdate', timeupdateHandler);

      // 倍速播放监听
      const ratechangeHandler = (e) => {
        const playbackRate = e.target.playbackRate;
        this.$ownerInstance.callMethod('eventEmit', {
          event: 'ratechange',
          data: playbackRate,
        });
      };
      this.videoEl.removeEventListener('ratechange', ratechangeHandler);
      this.videoEl.addEventListener('ratechange', ratechangeHandler);

      // 全屏事件监听
      // if (this.isApple()) {
      //   const webkitbeginfullscreenHandler = () => {
      //     const presentationMode = this.videoEl.webkitPresentationMode;
      //     let isFullScreen = null;
      //     if (presentationMode === 'fullscreen') {
      //       isFullScreen = true;
      //     } else {
      //       isFullScreen = false;
      //     }
      //     this.$ownerInstance.callMethod('eventEmit', {
      //       event: 'fullscreenchange',
      //       data: isFullScreen,
      //     });
      //   };
      //   this.videoEl.removeEventListener(
      //     'webkitpresentationmodechanged',
      //     webkitbeginfullscreenHandler,
      //   );
      //   this.videoEl.addEventListener(
      //     'webkitpresentationmodechanged',
      //     webkitbeginfullscreenHandler,
      //   );
      // } else {
      //   const fullscreenchangeHandler = () => {
      //     let isFullScreen = null;
      //     if (document.fullscreenElement) {
      //       isFullScreen = true;
      //     } else {
      //       isFullScreen = false;
      //     }
      //     this.$ownerInstance.callMethod('eventEmit', {
      //       event: 'fullscreenchange',
      //       data: isFullScreen,
      //     });
      //   };
      //   document.removeEventListener('fullscreenchange', fullscreenchangeHandler);
      //   document.addEventListener('fullscreenchange', fullscreenchangeHandler);
      // }
    },
    // 加载首帧视频，模拟出封面图
    loadFirstFrame() {
      let { autoplay, muted } = this.renderProps;
      if (this.isApple()) {
        this.videoEl?.play();
        if (!autoplay) {
          this.videoEl?.pause();
        }
      } else {
        // optimize: timeout 延迟调用是为了规避控制台的`https://goo.gl/LdLk22`这个报错
        /**
         * 原因：chromium 内核中，谷歌协议规定，视频不允许在非静音状态下进行自动播放
         * 解决：在自动播放时，先将视频静音，然后延迟调用 play 方法，播放视频
         * 说明：iOS 的 Safari 内核不会有这个，仅在 Android 设备出现，即使有这个报错也不影响的，所以不介意控制台报错的话是可以删掉这个 timeout 的
         */
        this.videoEl.muted = true;
        setTimeout(() => {
          this.videoEl?.play();
          this.videoEl.muted = muted;
          if (!autoplay) {
            setTimeout(() => {
              this.videoEl?.pause();
            }, 100);
          }
        }, 10);
      }
    },
    triggerCommand(eventType) {
      if (eventType) {
        this.$ownerInstance.callMethod('resetEventCommand');
        this.videoEl && this.videoEl[eventType]();
      }
    },
    triggerFunc(func) {
      const { name, params } = func || {};
      if (name) {
        this[name](params);
        this.$ownerInstance.callMethod('resetFunc');
      }
    },
    removeHandler() {
      if (this.videoEl) {
        this.videoEl.pause();
        this.videoEl.src = '';
        this.$ownerInstance.callMethod('setViewData', {
          key: 'videoSrc',
          value: '',
        });
        this.videoEl.load();
      }
    },
    fullScreenHandler() {
      if (this.isApple()) {
        this.videoEl.webkitEnterFullscreen();
      } else {
        this.videoEl.requestFullscreen();
      }
    },
    toSeekHandler({ sec, isDelay }) {
      const func = () => {
        if (this.videoEl) {
          this.videoEl.currentTime = sec;
        }
      };

      // 延迟执行
      if (isDelay) {
        this.delayFunc = func;
      } else {
        func();
      }
    },
    // 执行延迟函数
    execDelayFunc() {
      this.delayFunc && this.delayFunc();
      this.delayFunc = null;
    },
    viewportChange(props) {
      this.renderProps = props;
      const { autoplay, muted, controls, loop, playbackRate } = props;
      if (this.videoEl) {
        this.videoEl.autoplay = autoplay;
        this.videoEl.controls = controls;
        this.videoEl.loop = loop;
        this.videoEl.muted = muted;
        this.videoEl.playbackRate = playbackRate;
      }
    },
    randomNumChange(val) {
      this.num = val;
    },
    formatVideoTime,
    log(subKey, params = {}) {
      console.log(`videoEl: ${subKey}`, JSON.stringify(params));
    },
  },
};
