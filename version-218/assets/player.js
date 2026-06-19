document.addEventListener('DOMContentLoaded', function () {
  var shell = document.querySelector('[data-player]');

  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-play-button]');
  var source = shell.getAttribute('data-video-src');
  var ready = false;
  var instance = null;

  function attach() {
    if (ready || !video || !source) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      instance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      instance.loadSource(source);
      instance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function play() {
    attach();

    if (button) {
      button.classList.add('is-hidden');
    }

    var request = video.play();

    if (request && typeof request.catch === 'function') {
      request.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (instance) {
      instance.destroy();
    }
  });
});
