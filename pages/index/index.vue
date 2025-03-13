<template>
	<view class="content">
    <view class="video-container">
      <video-player src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app-video-courses.mp4" autoplay></video-player>
    </view>
	</view>
</template>

<script>
	import VideoPlayer from "@/components/video-player/VideoPlayer.vue";

  export default {
    components: {VideoPlayer},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

  .video-container {
    width: 300px;
    height: 250px;
  }
</style>
