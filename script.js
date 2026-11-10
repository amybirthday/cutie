
document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const screens = [
        "passwordScreen",
        "intro1Screen",
        "pinkContinueScreen",
        "intro2Screen",
        "cakeScreen",
        "videosScreen",
        "picturesScreen",
        "letterScreen",
        "endingScreen"
    ];

    function showScreen(id) {
        screens.forEach(screenId => {
            const screen = $(screenId);
            if (screen) screen.classList.remove("active");
        });

        const nextScreen = $(id);
        if (nextScreen) nextScreen.classList.add("active");
    }

    // AUDIO CONTROL
    const sectionSongs = [
        $("cakeSong"),
        $("picturesSong"),
        $("letterSong"),
        $("endingSong"),
        $("extraAudio")
    ];

    function stopAllSongs() {
        sectionSongs.forEach(song => {
            if (song) {
                song.pause();
                song.currentTime = 0;
            }
        });
    }

    function playSong(song) {
        stopAllSongs();

        if (song) {
            song.currentTime = 0;
            song.play().catch(() => {});
        }
    }

    // PASSWORD SIREN
    let sirenContext = null;
    let sirenOscillator = null;
    let sirenInterval = null;
    let sirenGain = null;

    function startSiren() {
        stopSiren();

        try {
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContext) return;

            sirenContext = new AudioContext();
            sirenOscillator = sirenContext.createOscillator();
            sirenGain = sirenContext.createGain();

            sirenOscillator.type = "sawtooth";
            sirenOscillator.frequency.value = 650;
            sirenGain.gain.value = 0.07;

            sirenOscillator.connect(sirenGain);
            sirenGain.connect(sirenContext.destination);

            sirenOscillator.start();

            let high = false;

            sirenInterval = setInterval(() => {
                if (!sirenOscillator || !sirenContext) return;

                high = !high;
                sirenOscillator.frequency.setValueAtTime(
                    high ? 950 : 550,
                    sirenContext.currentTime
                );
            }, 450);

        } catch (error) {
            console.log("Siren could not start.");
        }
    }

    function stopSiren() {
        if (sirenInterval) {
            clearInterval(sirenInterval);
            sirenInterval = null;
        }

        if (sirenOscillator) {
            try {
                sirenOscillator.stop();
                sirenOscillator.disconnect();
            } catch (error) {}
            sirenOscillator = null;
        }

        if (sirenContext) {
            sirenContext.close().catch(() => {});
            sirenContext = null;
        }

        sirenGain = null;
    }

    // PASSWORD
    const passwordInput = $("passwordInput");
    const unlockBtn = $("unlockBtn");
    const passwordScreen = $("passwordScreen");
    const passwordMessage = $("passwordMessage");

    function unlockWebsite() {
        if (!passwordInput) return;

        if (passwordInput.value === "1431432") {
            stopSiren();

            if (passwordMessage) {
                passwordMessage.textContent = "";
            }

            if (passwordScreen) {
                passwordScreen.classList.remove("shake");
            }

            showScreen("intro1Screen");

            const video = $("introVideo1");
            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {});
            }

        } else {
            if (passwordMessage) {
                passwordMessage.textContent = "Wrong Password! Try Again ❤️";
            }

            if (passwordScreen) {
                passwordScreen.classList.remove("shake");
                void passwordScreen.offsetWidth;
                passwordScreen.classList.add("shake");
            }

            startSiren();
            passwordInput.value = "";
            passwordInput.focus();
        }
    }

    if (unlockBtn) {
        unlockBtn.addEventListener("click", unlockWebsite);
    }

    if (passwordInput) {
        passwordInput.addEventListener("keydown", event => {
            if (event.key === "Enter") unlockWebsite();
        });
    }

    // INTRO VIDEO 1
    const introVideo1 = $("introVideo1");
    const intro1Continue = $("intro1Continue");

    if (intro1Continue) {
        intro1Continue.style.display = "none";
        intro1Continue.addEventListener("click", () => {
            showScreen("pinkContinueScreen");
        });
    }

    if (introVideo1) {
        introVideo1.addEventListener("ended", () => {
            if (intro1Continue) {
                intro1Continue.style.display = "block";
            }
        });
    }

    // PINK CONTINUE
    const pinkContinueBtn = $("pinkContinueBtn");

    if (pinkContinueBtn) {
        pinkContinueBtn.addEventListener("click", () => {
            showScreen("intro2Screen");

            const video = $("introVideo2");
            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {});
            }
        });
    }

    // INTRO VIDEO 2
    const introVideo2 = $("introVideo2");
    const intro2Continue = $("intro2Continue");

    if (intro2Continue) {
        intro2Continue.style.display = "none";
        intro2Continue.addEventListener("click", () => {
            showScreen("cakeScreen");
            playSong($("cakeSong"));
        });
    }

    if (introVideo2) {
        introVideo2.addEventListener("ended", () => {
            if (intro2Continue) {
                intro2Continue.style.display = "block";
            }
        });
    }

    // CAKE SECTION
    const cakeContinue = $("cakeContinue");

    if (cakeContinue) {
        cakeContinue.addEventListener("click", () => {
            showScreen("videosScreen");
            stopAllSongs();

            playMainVideo(0);
        });
    }

    // MAIN VIDEOS
    const mainVideos = [
        $("mainVideo1"),
        $("mainVideo2"),
        $("mainVideo3")
    ];

    const videoContinueButtons =
        document.querySelectorAll(".videoContinue");

    let currentVideoIndex = 0;

    function playMainVideo(index) {
        currentVideoIndex = index;

        mainVideos.forEach((video, i) => {
            if (!video) return;

            video.pause();
            video.currentTime = 0;

            const button = videoContinueButtons[i];
            if (button) button.style.display = "none";
        });

        const currentVideo = mainVideos[index];

        if (currentVideo) {
            currentVideo.play().catch(() => {});
        }
    }

    mainVideos.forEach((video, index) => {
        if (!video) return;

        video.addEventListener("ended", () => {
            const button = videoContinueButtons[index];
            if (button) button.style.display = "block";
        });
    });

    videoContinueButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (index < 2) {
                playMainVideo(index + 1);
            } else {
                mainVideos.forEach(video => {
                    if (video) video.pause();
                });

                showScreen("picturesScreen");
                playSong($("picturesSong"));
            }
        });
    });

    // PICTURES SECTION
    const picturesContinue = $("picturesContinue");

    if (picturesContinue) {
        picturesContinue.addEventListener("click", () => {
            showScreen("letterScreen");
            playSong($("letterSong"));
        });
    }

    // LETTER SECTION
    const letterContinue = $("letterContinue");

    if (letterContinue) {
        letterContinue.addEventListener("click", () => {
            showScreen("endingScreen");

            const firstEndingSong = $("endingSong");
            const secondEndingSong = $("extraAudio");

            stopAllSongs();

            if (firstEndingSong) {
                firstEndingSong.currentTime = 0;

                firstEndingSong.play().catch(() => {});

                firstEndingSong.onended = () => {
                    if (secondEndingSong) {
                        secondEndingSong.currentTime = 0;
                        secondEndingSong.play().catch(() => {});
                    }
                };
            }
        });
    }

    // STOP SONGS WHEN PAGE IS CLOSED
    window.addEventListener("pagehide", () => {
        stopSiren();
        stopAllSongs();
    });
});
