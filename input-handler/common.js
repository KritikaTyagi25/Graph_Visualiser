// input-handler/common.js

window.isPaused = false;
window.isStopped = false;

window.pauseDFS = () => {
  window.isPaused = !window.isPaused;
  console.log("Paused:", window.isPaused);
};

window.stopDFS = () => {
  window.isStopped = true;
  window.isPaused = false;
  console.log("Stopped");
};
