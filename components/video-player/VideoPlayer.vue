<!--
 * @name: H5AppVideo.vue
 * @author: yangcongcong
 * @date: 2025/3/12
 * @description: 描述
-->

<template>
  <view
      class="player-wrapper"
      :id="videoWrapperId"
      :parentId="id"
      :randomNum="randomNum"
      :change:randomNum="domVideoPlayer.randomNumChange"
      :viewportProps="viewportProps"
      :change:viewportProps="domVideoPlayer.viewportChange"
      :videoSrc="videoSrc"
      :change:videoSrc="domVideoPlayer.initVideoPlayer"
      :command="eventCommand"
      :change:command="domVideoPlayer.triggerCommand"
      :func="renderFunc"
      :change:func="domVideoPlayer.triggerFunc"
  />
</template>

<script>
import { CustomPlayStatusOBJ } from './render-service/utils';
export default {
  name: 'H5AppVideo',
  props: {
    src: {
      type: String,
      default: '',
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    controls: {
      type: Boolean,
      default: false,
    },
    objectFit: {
      type: String,
      default: 'contain',
    },
    muted: {
      type: Boolean,
      default: false,
    },
    playbackRate: {
      type: Number,
      default: 1,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    poster: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      randomNum: Math.floor(Math.random() * 100000000),
      videoSrc: '',
      // 父组件向子组件传递的事件指令（video的原生事件）
      eventCommand: null,
      // 父组件传递过来的，对 renderjs 层的函数执行（对视频控制的自定义事件）
      renderFunc: {
        name: null,
        params: null,
      },
      // 提供给父组件进行获取的视频属性
      currentTime: 0,
      duration: 0,
      playerStatus: CustomPlayStatusOBJ.INIT,
    };
  },
  watch: {
    // 监听视频资源地址更新
    src: {
      handler(val) {
        if (!val) return;
        setTimeout(() => {
          this.videoSrc = val;
        }, 0);
      },
      immediate: true,
    },
  },
  computed: {
    videoWrapperId() {
      return `video-wrapper-${this.randomNum}`;
    },
    // 聚合视图层的所有数据变化，传给renderjs的渲染层
    viewportProps() {
      return {
        autoplay: this.autoplay,
        muted: this.muted,
        controls: this.controls,
        loop: this.loop,
        objectFit: this.objectFit,
        poster: this.poster,
        isLoading: this.isLoading,
        playbackRate: this.playbackRate,
      };
    },
  },
  // 方法
  methods: {
    // 传递事件指令给父组件
    eventEmit({ event, data }) {
      if (event === 'fullscreenchange') {
        console.log('eventEmit', event, data);
        // #ifdef APP-PLUS
        if (!data) {
          plus.screen.lockOrientation('landscape');
        } else {
          plus.screen.lockOrientation('portrait-primary');
        }
        // #endif
      }
      this.$emit(event, data);
    },
    // 修改view视图层的data数据
    setViewData({ key, value }) {
      key && this.$set(this, key, value);
    },
    // 重置事件指令
    resetEventCommand() {
      this.eventCommand = null;
    },
    // 播放指令
    play() {
      this.eventCommand = 'play';
    },
    // 暂停指令
    pause() {
      this.eventCommand = 'pause';
    },
    // 重置自定义函数指令
    resetFunc() {
      this.renderFunc = {
        name: null,
        params: null,
      };
    },
    // 自定义函数 - 移除视频
    remove(params) {
      this.renderFunc = {
        name: 'removeHandler',
        params,
      };
    },
    // 自定义函数 - 全屏播放
    fullScreen(params) {
      this.renderFunc = {
        name: 'fullScreenHandler',
        params,
      };
    },
    // 自定义函数 - 跳转到指定时间点
    toSeek(sec, isDelay = false) {
      this.renderFunc = {
        name: 'toSeekHandler',
        params: { sec, isDelay },
      };
    },
  },
};
</script>
<script module="domVideoPlayer" lang="renderjs" src="./render-service/videoEl.js"></script>
<style scoped lang="scss">
.player-wrapper {
  overflow: hidden;
  height: 100%;
  padding: 0;
  position: relative;
}
</style>
