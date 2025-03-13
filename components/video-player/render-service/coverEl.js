/**
 * @name: controlEl.js
 * @author: yangcongcong
 * @date: 2025/3/9
 * @description: 自定义控制层
 */
export default {
  data() {
    return {
      coverEl: null, // 整个cover层
      controlsEl: null, // 下方控制按钮层
      progressEl: null, // 进度条
      durationEl: null, // 总时间
      currentTimeEl: null, // 当前时间
      playBtnEl: null, // 开始播放
      pauseBtnEl: null, // 暂停播放
      hiddenEl: null, // 隐藏
      editEl: null, // 编辑
      hideTimeout: null, // 显示隐藏控制条
      isShowCover: false, // 显示自定义面板层
    };
  },
  watch: {
    isShowCover(val) {
      if (val) {
        this.showCover();
      } else {
        this.hiddenCover();
      }
    },
  },
  methods: {
    // 创建自定义视频上的悬浮层：包含自定义控制栏，自定义头部导航，
    createCover() {
      const coverEl = document.createElement('div');
      this.coverEl = coverEl;
      coverEl.className = 'cover-wrapper';
      Object.assign(coverEl.style, this.CoverStyles.coverWrapper);

      const parentEl = document.getElementById(this.wrapperId);
      // 创建返回
      this.createBack(parentEl);
      // 创建进度条
      this.createControls();

      const mousedownHandler = (e) => {
        this.resetCoverTimer();
      };

      coverEl.removeEventListener('click', mousedownHandler);
      coverEl.addEventListener('click', mousedownHandler);

      parentEl.appendChild(coverEl);
    },

    // 创建控制栏
    createControls() {
      const controlsEl = document.createElement('div');
      this.controlsEl = controlsEl;
      controlsEl.className = 'controls-wrapper';
      Object.assign(controlsEl.style, this.CoverStyles.controlsWrapper);

      // 创建播放状态按钮
      this.createPlayButton();
      // 创建当前时间
      this.createCurrentTime();
      // 创建进度条
      this.createProgress();
      // 创建视频总时间
      this.createDuration();
      // 创建全屏
      this.createFullScreen();
      // 创建编辑
      this.createEdit();
      // 创建隐藏视频
      this.createHidden();

      // 最后整体创建控制面板
      this.coverEl?.appendChild(controlsEl);
    },

    // 创建播放状态按钮
    createPlayButton() {
      const playEl = document.createElement('div');
      playEl.className = 'play-wrapper';
      Object.assign(playEl.style, this.CoverStyles.playWrapper);

      const isStarted = this.isVideoStart(); // 开始播放

      // 创建开始播放img标签
      const playBtnEl = document.createElement('img');
      this.playBtnEl = playBtnEl;
      Object.assign(playBtnEl.style, {
        ...this.CoverStyles.buttonStyle,
        display: isStarted ? 'none' : 'inline',
      });
      playBtnEl.src = this.LocalImgPath.playBtn;
      playEl.appendChild(playBtnEl);

      // 创建暂停播放img标签
      const pauseBtnEl = document.createElement('img');
      this.pauseBtnEl = pauseBtnEl;
      Object.assign(pauseBtnEl.style, {
        ...this.CoverStyles.buttonStyle,
        display: isStarted ? 'inline' : 'none',
      });
      pauseBtnEl.src = this.LocalImgPath.pauseBtn;
      playEl.appendChild(pauseBtnEl);

      const playClickHandler = (e) => {
        e.stopPropagation(); // 阻止冒泡
        const isStarted = this.isVideoStart(); // 播放中
        if (isStarted) {
          this.videoEl.pause();
        } else {
          this.videoEl.play();
        }
        this.resetCoverTimer(false); // 刷新定时器时间
      };

      // 监听事件
      playEl.removeEventListener('click', playClickHandler);
      playEl.addEventListener('click', playClickHandler);

      this.controlsEl.appendChild(playEl);
    },

    // 刷新播放按钮
    refreshPlayEl() {
      const isStarted = this.isVideoStart(); // 播放中
      if (isStarted) {
        Object.assign(this.playBtnEl.style, {
          display: 'none',
        });

        Object.assign(this.pauseBtnEl.style, {
          display: 'inline',
        });
      } else {
        Object.assign(this.playBtnEl.style, {
          display: 'inline',
        });

        Object.assign(this.pauseBtnEl.style, {
          display: 'none',
        });
      }
    },

    isVideoStart() {
      return this.videoInformation.status === this.CustomPlayStatusOBJ.START;
    },

    // 创建当前时间
    createCurrentTime() {
      const currentTimeEl = document.createElement('div');
      currentTimeEl.className = 'current-time-wrapper'; // 可添加CSS类名
      this.currentTimeEl = currentTimeEl;
      Object.assign(currentTimeEl.style, this.CoverStyles.currentTime);

      // 初始化显示内容
      currentTimeEl.textContent = this.formatVideoTime(this.videoInformation.currentTime);

      this.controlsEl.appendChild(currentTimeEl);
    },

    // 刷新当前时间
    refreshCurrentTime() {
      this.currentTimeEl.textContent = this.formatVideoTime(this.videoInformation.currentTime);
    },

    // 创建总时间
    createDuration() {
      const durationEl = document.createElement('div');
      durationEl.className = 'duration-wrapper'; // 可添加CSS类名
      this.durationEl = durationEl;
      Object.assign(durationEl.style, this.CoverStyles.durationTime);

      // 初始化显示内容
      durationEl.textContent = this.formatVideoTime(this.videoInformation.duration);

      this.controlsEl.appendChild(durationEl);
    },

    // 刷新总时间
    refreshDuration() {
      this.durationEl.textContent = this.formatVideoTime(this.videoInformation.duration);
    },

    // 创建进度条
    createProgress() {
      const progressEl = document.createElement('div');
      progressEl.className = 'progress-container';
      this.progressEl = progressEl;
      Object.assign(progressEl.style, this.ProgressStyles.progressContainer);

      this.initProgressBar(progressEl);
      this.controlsEl.appendChild(progressEl);
    },

    // 创建全屏
    createFullScreen() {
      const fullScreenWrapper = document.createElement('div');
      fullScreenWrapper.className = 'full-screen-wrapper';
      Object.assign(fullScreenWrapper.style, this.CoverStyles.fullScreenWrapper);

      // 创建img标签
      const imgEl = document.createElement('img');
      Object.assign(imgEl.style, this.CoverStyles.buttonStyle);
      imgEl.src = this.LocalImgPath.fullScreenBtn;
      fullScreenWrapper.appendChild(imgEl);

      const fullScreenHandler = (e) => {
        e.stopPropagation(); // 阻止冒泡
        const playerWrapperEl = document.getElementById(this.wrapperId);
        let isFullScreen = this.isFullScreen(playerWrapperEl);
        this.log('coverEl:fullScreenHandler', { isFullScreen });

        if (!isFullScreen) {
          this.enterFullScreen(playerWrapperEl);
          // 隐藏编辑和隐藏视频按钮
          this.hideHiddenBtn();
          this.hideEditBtn();
          this.isFullScreenFlag = true;
        } else {
          this.exitFullScreen(playerWrapperEl);
          // 显示编辑和隐藏视频按钮
          this.showHiddenBtn();
          this.showEditBtn();
          this.isFullScreenFlag = false;
        }
        this.$ownerInstance.callMethod('eventEmit', {
          event: 'fullscreenchange',
          data: isFullScreen,
        });

        // 刷新定时器时间
        this.resetCoverTimer(false);
      };

      // 监听事件
      fullScreenWrapper.removeEventListener('click', fullScreenHandler);
      fullScreenWrapper.addEventListener('click', fullScreenHandler);

      this.controlsEl.appendChild(fullScreenWrapper);
    },

    createBack(parentEl) {
      const backEl = document.createElement('div');
      backEl.className = 'back-wrapper';
      Object.assign(backEl.style, this.CoverStyles.backWrapper);

      // 创建img标签
      const backBtnEl = document.createElement('img');
      Object.assign(backBtnEl.style, this.CoverStyles.buttonStyle);
      backBtnEl.src = this.LocalImgPath.backBtn;
      backEl.appendChild(backBtnEl);

      const backHandler = () => {
        // 如果是全屏状态
        if (this.isFullScreenFlag) {
          const playerWrapperEl = document.getElementById(this.wrapperId);
          this.exitFullScreen(playerWrapperEl);
          // 显示编辑和隐藏视频按钮
          this.showHiddenBtn();
          this.showEditBtn();
          this.isFullScreenFlag = false;
          this.$ownerInstance.callMethod('eventEmit', {
            event: 'fullscreenchange',
            data: true,
          });
          return false;
        }
        this.$ownerInstance.callMethod('eventEmit', { event: 'customBack' });
      };

      // 监听事件
      backEl.removeEventListener('click', backHandler);
      backEl.addEventListener('click', backHandler);

      // 不属于cover层
      parentEl.appendChild(backEl);
    },
    createEdit() {
      const editEl = document.createElement('div');
      editEl.className = 'edit-wrapper';
      this.editEl = editEl;
      Object.assign(editEl.style, this.CoverStyles.editWrapper);

      // 创建img标签
      const editBtnEl = document.createElement('img');
      Object.assign(editBtnEl.style, this.CoverStyles.buttonStyle);
      editBtnEl.src = this.LocalImgPath.editBtn;
      editEl.appendChild(editBtnEl);

      const editHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'customEdit' });
      };

      // 监听事件
      editEl.removeEventListener('click', editHandler);
      editEl.addEventListener('click', editHandler);

      this.coverEl?.appendChild(editEl);
    },

    showEditBtn() {
      if (this.editEl) {
        this.editEl.style.display = 'flex';
      }
    },
    hideEditBtn() {
      if (this.editEl) {
        this.editEl.style.display = 'none';
      }
    },

    createHidden() {
      const hiddenEl = document.createElement('div');
      hiddenEl.className = 'hidden-wrapper';
      this.hiddenEl = hiddenEl;
      Object.assign(hiddenEl.style, this.CoverStyles.hiddenWrapper);

      // 创建img标签
      const hiddenBtnEl = document.createElement('img');
      Object.assign(hiddenBtnEl.style, this.CoverStyles.buttonStyle);
      hiddenBtnEl.src = this.LocalImgPath.hiddenBtn;
      hiddenEl.appendChild(hiddenBtnEl);

      // 创建文字
      const hiddenText = document.createElement('div');
      Object.assign(hiddenText.style, this.CoverStyles.hiddenTextStyle);
      hiddenText.textContent = '隐藏视频';
      hiddenEl.appendChild(hiddenText);

      const hiddenHandler = () => {
        this.$ownerInstance.callMethod('eventEmit', { event: 'customHidden' });
      };

      // 监听事件
      hiddenEl.removeEventListener('click', hiddenHandler);
      hiddenEl.addEventListener('click', hiddenHandler);

      this.coverEl?.appendChild(hiddenEl);
    },

    showHiddenBtn() {
      if (this.hiddenEl) {
        this.hiddenEl.style.display = 'flex';
      }
    },
    hideHiddenBtn() {
      if (this.hiddenEl) {
        this.hiddenEl.style.display = 'none';
      }
    },

    // 展示cover
    showCover() {
      if (this.coverEl) {
        this.coverEl.style.display = 'block';
      }
    },
    // 隐藏cover
    hiddenCover() {
      if (this.coverEl) {
        this.coverEl.style.display = 'none';
      }
    },

    // 重置隐藏计时器
    resetCoverTimer(changeStatus = true) {
      // 是否切换状态
      if (changeStatus) {
        this.isShowCover = !this.isShowCover;
      }

      clearTimeout(this.hideTimeout);
      // 如果是展示
      if (this.isShowCover) {
        this.hideTimeout = setTimeout(() => {
          this.isShowCover = false;
        }, 3000); // 3秒无操作后隐藏
      }
    },
  },
};
