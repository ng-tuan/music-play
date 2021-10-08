const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Hoa nở không màu",
      singer: "Hoài Lâm",
      path: "./assets/music/music1.mp3",
      image: "./assets/img/pic1.jpg",
    },
    {
      name: "3017 1",
      singer: "W/n, Duongg, Nâu",
      path: "./assets/music/music2.mp3",
      image: "./assets/img/pic2.jpg",
    },
    {
      name: "3017 2",
      singer: "W/n, Duongg, Nâu",
      path: "./assets/music/music3.mp3",
      image: "./assets/img/pic3.jpg",
    },
    {
      name: "3017 3",
      singer: "W/n, Duongg, Nâu",
      path: "./assets/music/music4.mp3",
      image: "./assets/img/pic4.jpg",
    },
    {
      name: "Lặng yên",
      singer: "Bùi Anh Tuấn",
      path: "./assets/music/music5.mp3",
      image: "./assets/img/pic5.jpg",
    },
    {
      name: "2 5",
      singer: "Táo",
      path: "./assets/music/music6.mp3",
      image: "./assets/img/pic6.jpg",
    },
    {
      name: "7 cuộc gọi nhỡ",
      singer: "Khói",
      path: "./assets/music/music7.mp3",
      image: "./assets/img/pic7.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song ${index === app.currentIndex ? "active" : ""}" data-index="${index}">
              <div class="thumb"
                  style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
              </div>
          </div>
          `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    // element.animate()
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to/thu nhỏ thumb
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Xử lý khi play/pause
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Xứ lý progress
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;
      }
    };

    progress.oninput = function (e) {
      console.log(e.target.value);
      const timePlaying = (audio.duration / 100) * e.target.value;
      audio.currentTime = timePlaying;
      audio.play();
    };

    // Xử lý khi click next/prev
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollViewPage();
    };

    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollViewPage();
    };

    // Xử lý khi random
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // Xử lý khi bài hát end
    audio.onended = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
    };

    // Xử lý khi lặp lại bài hát
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
      if (app.isRepeat) {
        audio.loop = true;
      } else {
        audio.loop = false;
      }
    };

    // Xử lý khi nhấn vào bài hát
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  scrollViewPage: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  },

  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    this.defineProperties();
    this.handleEvents();

    this.loadCurrentSong();
    this.render();
  },
};

app.start();
