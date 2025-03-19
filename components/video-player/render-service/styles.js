/**
 * @name: styles.js
 * @author: yangcongcong
 * @date: 2025/3/10
 * @description: 样式定义
 */

export const ControlsHeight = 48;
// 按钮外层盒子大小
export const ButtonWrapperSize = 32;
// 按钮大小
export const ButtonSize = 24;
// 使用到的图标
export const LocalImgPath = {
  backBtn: './static/images/icon-arrow-left.png',
  editBtn: './static/images/report/edit.png',
  hiddenBtn: './static/images/video/original-hidden.png',
  playBtn: './static/images/video/original-play.png',
  pauseBtn: './static/images/video/original-pause.png',
  fullScreenBtn: './static/images/video/original-landscape.png',
};

// cover层
export const CoverStyles = {
  // 最外层
  coverWrapper: {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '1',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    display: 'none',
  },
  // 控制条
  controlsWrapper: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    zIndex: '2',
    width: '100%',
    height: `${ControlsHeight}px`,
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
    padding: '0 12px',
    boxSizing: 'border-box',
  },
  // 播放按钮
  playWrapper: {
    width: `${ButtonWrapperSize}px`,
    height: `${ButtonWrapperSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
  },
  // 按钮大小
  buttonStyle: {
    width: `${ButtonSize}px`,
    height: `${ButtonSize}px`,
  },
  // 当前时间
  currentTime: {
    minWidth: '33px',
    height: '100%',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  // 总时间
  durationTime: {
    minWidth: '33px',
    height: '100%',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  // 全屏按钮
  fullScreenWrapper: {
    width: `${ButtonWrapperSize}px`,
    height: `${ButtonWrapperSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '16px',
  },

  // 返回
  backWrapper: {
    position: 'absolute',
    top: '13px',
    left: '12px',
    zIndex: '3',
    width: `${ButtonWrapperSize}px`,
    height: `${ButtonWrapperSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 编辑
  editWrapper: {
    position: 'absolute',
    top: '13px',
    right: '12px',
    zIndex: '2',
    width: `${ButtonWrapperSize}px`,
    height: `${ButtonWrapperSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  hiddenWrapper: {
    width: '40px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '8px',
    zIndex: '2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  hiddenTextStyle: {
    fontWeight: 600,
    fontSize: '10px',
    color: '#FFFFFF',
    lineHeight: '14px',
    textShadow: '0px 1px 3px rgba(0,0,0,0.4)',
    textAlign: 'justify',
    fontStyle: 'normal',
    marginTop: '6px',
  },
};

// 进度条相关样式
export const ProgressStyles = {
  progressContainer: {
    position: 'relative',
    height: '100%',
    flex: '1',
    margin: '0 8px',
  },

  progressBar: {
    width: '100%',
    height: '2px',
    background: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    top: '50%',
    borderRadius: '1px',
    transform: 'translateY(-50%)',
  },

  bufferBar: {
    height: '100%',
    background: 'rgba(255,255,255,0.5)',
    width: 0,
  },

  currentProgress: {
    height: '100%',
    background: '#017FFF',
    width: 0,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  thumb: {
    width: '26px',
    height: '26px',
    marginLeft: '-13px',
    marginRight: '-13px',
    backgroundColor: 'transparent',
    zIndex: 4,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    touchAction: 'none',
  },

  // 实际显示的点
  thumbDot: {
    width: '6px',
    height: '6px',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    background: '#ffffff',
    borderRadius: '50%',
  },
};

// loading样式
export const LoadingStyles = {
  // 外层
  loadingWrapper: {
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '1',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  // 动画
  loadingCircle: {
    zIndex: '2',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-15px',
    marginLeft: '-15px',
    width: '30px',
    height: '30px',
    border: '2px solid #FFF',
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '100%',
    animation: 'circle infinite 0.75s linear',
  },
};

// 全屏的样式
export const FullscreenStyles = {
  full: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '9999',
  },
  init: {
    position: 'relative',
    top: 'unset',
    left: 'unset',
    width: 'auto',
    zIndex: 'unset',
  },
};
