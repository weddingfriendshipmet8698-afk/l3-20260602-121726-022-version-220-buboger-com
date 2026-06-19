document.addEventListener("DOMContentLoaded", function () {
  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
  players.forEach(function (wrap) {
    var video = wrap.querySelector("video");
    var button = wrap.querySelector(".play-overlay");
    if (!video || !button) {
      return;
    }
    var src = video.getAttribute("data-src");
    var attached = false;

    function attach() {
      if (attached || !src) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function start() {
      attach();
      wrap.classList.add("is-playing");
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {});
      }
    }

    button.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      wrap.classList.add("is-playing");
    });
    video.addEventListener("pause", function () {
      if (!video.ended) {
        wrap.classList.remove("is-playing");
      }
    });
  });
});
