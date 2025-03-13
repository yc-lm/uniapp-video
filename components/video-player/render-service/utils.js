/**
 * @name: constant.js
 * @author: yangcongcong
 * @date: 2025/3/9
 * @description: 常量定义
 */

// 播放器状态
export const CustomPlayStatusOBJ = {
  INIT: 0, // 初始
  START: 1, // 播放中
  PAUSED: 2, // 暂停
  END: 3, // 结束
};

// 格式化video时间
export function formatVideoTime(timeInSeconds) {
  if (!timeInSeconds) {
    return '00:00';
  }

  const totalSeconds = Math.floor(Number(timeInSeconds) || 0);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const pad = (num) => String(num).padStart(2, '0');

  // 不满一小时时隐藏小时部分
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
