/**
 * @name: progressEl.js
 * @author: yangcongcong
 * @date: 2025/3/9
 * @description: 进度条
 */
export default {
  data() {
    return {
      progressBar: null, // 进度条背景
      bufferBar: null, // 缓冲进度条
      currentProgress: null, // 当前播放进度
      thumb: null, // 拖动滑块
      isDragging: false, // 是否在拖动中
    };
  },

  methods: {
    initProgressBar(container) {
      // 进度条背景
      this.progressBar = document.createElement('div');
      this.progressBar.className = 'progress-bar';
      Object.assign(this.progressBar.style, this.ProgressStyles.progressBar);

      // 缓冲进度条
      this.bufferBar = document.createElement('div');
      this.bufferBar.className = 'buffer-bar';
      Object.assign(this.bufferBar.style, this.ProgressStyles.bufferBar);

      // 当前播放进度
      this.currentProgress = document.createElement('div');
      this.currentProgress.className = 'current-progress';
      Object.assign(this.currentProgress.style, this.ProgressStyles.currentProgress);

      this.thumb = document.createElement('div');
      this.thumb.className = 'thumb';
      Object.assign(this.thumb.style, this.ProgressStyles.thumb);
      // 创建实际显示的thumb
      const thumbDot = document.createElement('div');
      thumbDot.className = 'thumb-dot';
      Object.assign(thumbDot.style, this.ProgressStyles.thumbDot);
      this.thumb.appendChild(thumbDot);


      this.progressBar.appendChild(this.bufferBar);
      this.progressBar.appendChild(this.currentProgress);
      this.progressBar.appendChild(this.thumb);

      container.appendChild(this.progressBar);

      this.bindDragEvents();
    },

    bindDragEvents() {
      this.isDragging = false;
      const container = this.progressBar;
      let latestLocation = 0;

      const handleMove = (clientX, isVideoTimeUpdate = false) => {
        const rect = container.getBoundingClientRect();
        let percent = (clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        // 更新 UI
        this.currentProgress.style.width = `${percent * 100}%`;
        this.thumb.style.left = `${percent * 100}%`;

        // 通知逻辑层跳转时间
        // uni.$emit('video-seek', percent);
        if (isVideoTimeUpdate) {
          const time = this.videoInformation.duration * percent;
          if (this.videoEl) {
            this.videoEl.currentTime = time;
          }
        }
      };

      const touchStartHandler = (e) => {
        this.isDragging = true;
        latestLocation = e.touches[0].clientX;
        console.log('touchStartHandler');
      };

      const touchmoveHandler = (e) => {
        if (!this.isDragging) return;
        // 记录位置
        latestLocation = e.touches[0].clientX;
        handleMove(latestLocation);
        this.$ownerInstance.callMethod('eventEmit', { event: 'sliderChanging' });
        // 刷新定时器时间
        console.log('touchmove');
        this.resetCoverTimer(false);
      };

      const touchendHandler = (e) => {
        e.stopPropagation();
        console.log('touchend');
        if (!this.isDragging) return;
        handleMove(latestLocation, true);
        this.isDragging = false;
        this.$ownerInstance.callMethod('eventEmit', { event: 'sliderChangEnd' });
        latestLocation = 0;
      };

      // const mouseDownHandler = (e) => {
      //   this.isDragging = true;
      //   latestLocation = e.clientX;
      //   console.log('mouseDownHandler')
      //
      //   document.addEventListener('mousemove', (e) => {
      //     if (!this.isDragging) return;
      //     // 记录位置
      //     latestLocation = e.clientX;
      //     handleMove(latestLocation);
      //     this.$ownerInstance.callMethod('eventEmit', { event: 'sliderChanging' });
      //
      //     // 刷新定时器时间
      //     this.resetCoverTimer(false);
      //   });
      //
      //   document.addEventListener('mouseup', () => {
      //     if (!this.isDragging) return;
      //     handleMove(latestLocation, true);
      //     this.isDragging = false;
      //     this.$ownerInstance.callMethod('eventEmit', { event: 'sliderChangEnd' });
      //     latestLocation = 0;
      //   });
      // };
      //
      // this.thumb.removeEventListener('mousedown', mouseDownHandler);
      // this.thumb.addEventListener('mousedown', mouseDownHandler);

      this.thumb.removeEventListener('touchstart', touchStartHandler);
      this.thumb.addEventListener('touchstart', touchStartHandler);
      this.thumb.removeEventListener('touchmove', touchmoveHandler);
      this.thumb.addEventListener('touchmove', touchmoveHandler);
      this.thumb.removeEventListener('touchend', touchendHandler);
      this.thumb.addEventListener('touchend', touchendHandler);
    },

    refreshProgressPercent(currentTime) {
      // 未渲染或者总时长没有
      if (!this.progressBar || !this.videoInformation.duration) return;
      // 拖动中，不更新
      if (this.isDragging) return;

      const percent = (currentTime / this.videoInformation.duration) * 100 || 0;
      this.currentProgress.style.width = `${percent}%`;
      this.thumb.style.left = `${percent}%`;
    },
  },
};
