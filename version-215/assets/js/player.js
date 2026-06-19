import { H as Hls } from './hls-dru42stk.js';

const initializePlayer = (player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-button]');
    const status = player.querySelector('[data-player-status]');
    const source = player.dataset.videoSrc;
    let hlsInstance = null;
    let initialized = false;

    const updateStatus = (message) => {
        if (status) {
            status.textContent = message;
        }
    };

    const playVideo = async () => {
        if (!video || !source) {
            updateStatus('当前页面没有可用播放源。');
            return;
        }

        try {
            if (!initialized) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });

                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);

                    hlsInstance.on(Hls.Events.ERROR, (_, data) => {
                        if (!data || !data.fatal) {
                            return;
                        }

                        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                            updateStatus('网络异常，正在尝试重新加载播放源。');
                            hlsInstance.startLoad();
                        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                            updateStatus('媒体解码异常，正在尝试恢复。');
                            hlsInstance.recoverMediaError();
                        } else {
                            updateStatus('播放源暂时无法载入，请稍后重试。');
                            hlsInstance.destroy();
                        }
                    });
                } else {
                    updateStatus('当前浏览器不支持 HLS 播放，请更换浏览器访问。');
                    return;
                }

                initialized = true;
            }

            await video.play();
            button?.classList.add('is-hidden');
            updateStatus('正在播放。');
        } catch (error) {
            updateStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
        }
    };

    button?.addEventListener('click', playVideo);

    video?.addEventListener('play', () => {
        button?.classList.add('is-hidden');
    });

    video?.addEventListener('pause', () => {
        button?.classList.remove('is-hidden');
    });

    window.addEventListener('beforeunload', () => {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
};

document.querySelectorAll('[data-player]').forEach(initializePlayer);
