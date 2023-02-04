const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const audio = $('#audio')
const playlistList = $('.playlist__list')
const cd = $('.cd__img')
const songName = $('.song__name')
const songAuthor = $('.song__author')
const songDuration = $('.progress-time__duration')
const songCurrentTime = $('.progress-time__current-time')
const showPlaylistIcon = $('.list-music__icon')
const closePlaylistIcon = $('.close-list')
const playlist = $('.playlist__container')
const playlistInner = $('.playlist')
const playBtn = $('.btn__play')
const prevBtn = $('.btn__previous')
const nextBtn = $('.btn__next')
const randomBtn = $('.btn__random')
const repeatBtn = $('.btn__repeat')
const progressBar = $('.progress-bar')
const progress = $('.progress-bar__value')
const volumeBtn = $('.volume')
const volumeBar = $('.volume-bar')
const volume = $('.volume-bar__value')
const heartIcon = $('.favourite')

const songPlayedList = new Set()

const app = {
    currentIndex: 0,
    currentVolume: 1,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isMute: false,
    isHoldProgressBar: false,
    isHoldVolumeBar: false,
    isFavourite: false,

    songs: [
        {
            name: 'Ditto',
            author: 'NewJeans',
            image: './assets/img/song1.jpg',
            path: './assets/music/song1.m4a'
        }, {
            name: 'OMG',
            author: 'NewJeans',
            image: './assets/img/song2.jpg',
            path: './assets/music/song2.m4a'
        },
        {
            name: 'Hype Boy',
            author: 'NewJeans',
            image: './assets/img/song3.jpg',
            path: './assets/music/song3.m4a'
        }
    ],

    renderSong() {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="playlist__item" data-index="${index}">
                <div class="playlist__item-img">
                    <img src="${song.image}" alt="">
                </div>
                <div class="playlist__item-info">
                    <h3 class="playlist__item-name">${song.name}</h3>
                    <p class="playlist__item-author">${song.author}</p>
                </div>
                <div class="music-waves">  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>
                </div>
                <span class="playlist__item-option">
                    <i class="fa-solid fa-ellipsis"></i>
                </span>
            </li>
            `
        })
        playlistList.innerHTML = htmls.join('')
    },

    activeSong() {
        const songs = $$('.playlist__item')
        const musicWaves = $$('.music-waves')
        songs.forEach((song, index) => {
            if (index === this.currentIndex) {
                song.classList.add('active')
                musicWaves[index].classList.add('active')
                song.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "center",
                        inline: "center"
                    }
                )
            } else {
                song.classList.remove('active')
                musicWaves[index].classList.remove('active')
            }
        })
    },

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: () => this.songs[this.currentIndex]
        })
    },

    timeFormat(seconds) {
        const date = new Date(null)
        date.setSeconds(seconds)
        return date.toISOString().slice(14, 19)
    },

    togglePlaylist() {
        playlist.classList.toggle('list-open')
    },

    loadCurrentSong() {
        const _this = this
        songName.textContent = this.currentSong.name
        songAuthor.textContent = this.currentSong.author
        cd.src = this.currentSong.image
        audio.src = this.currentSong.path
        progress.style.width = 0

        audio.onloadedmetadata = function () {
            songCurrentTime.textContent = _this.timeFormat(this.currentTime.toFixed(2))
            songDuration.textContent = _this.timeFormat(this.duration.toFixed(2))
        }
    },

    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1
        this.loadCurrentSong()
        this.activeSong()
    },

    nextSong() {
        this.currentIndex++
        if (this.currentIndex > this.songs.length - 1) this.currentIndex = 0
        this.loadCurrentSong()
        this.activeSong()
    },

    randomSong() {
        let random
        do {
            random = Math.floor(Math.random() * this.songs.length)
        } while (songPlayedList.has(random))
        this.currentIndex = random
        this.loadCurrentSong()
        songPlayedList.add(random)
        if (songPlayedList.size === this.songs.length) {
            songPlayedList.clear()
        }
        this.activeSong()
    },

    repeatSong() {
        this.loadCurrentSong()
        this.activeSong()
    },

    handleEvents() {
        const _this = this
        _this.activeSong()

        const cdRotate = cd.animate({
            transform: ['rotate(0)', 'rotate(360deg)']
        },
            {
                duration: 7500,
                iterations: Infinity
            })
        cdRotate.pause()

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function () {
            playBtn.classList.add('playing')
            cdRotate.play()
            _this.isPlaying = true
        }
        audio.onpause = function () {
            playBtn.classList.remove('playing')
            cdRotate.pause()
            _this.isPlaying = false
        }

        audio.ontimeupdate = function () {
            songCurrentTime.textContent = _this.timeFormat(this.currentTime)
            const progressPercent = this.currentTime / this.duration * 100
            progress.style.width = progressPercent + '%'
        }

        prevBtn.onclick = function () {
            if (_this.isRepeat) {
                _this.repeatSong()
            } else {
                if (_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.prevSong()
                }
            }
            cdRotate.cancel()
            if (_this.isPlaying) {
                audio.play()
            }
        }
        nextBtn.onclick = function () {
            if (_this.isRepeat) {
                _this.repeatSong()
            } else {
                if (_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.nextSong()
                }
            }
            cdRotate.cancel()
            if (_this.isPlaying) {
                audio.play()
            }
        }

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle('active', _this.isRepeat)
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active', _this.isRandom)
        }
        audio.onended = function () {
            if (!_this.isRepeat) {
                if (_this.isRandom) {
                    _this.randomSong()
                    cdRotate.cancel()
                } else {
                    _this.nextSong()
                    cdRotate.cancel()
                }
                audio.play()
            } else {
                _this.repeatSong()
                audio.play()
            }
        }

        showPlaylistIcon.onclick = function () {
            _this.togglePlaylist()
        }
        closePlaylistIcon.onclick = function () {
            _this.togglePlaylist()
        }
        playlist.onclick = function () {
            _this.togglePlaylist()
        }
        playlistInner.onclick = function () {
            stopPropagation()
        }

        const songs = $$('.playlist__item')
        songs.forEach((song, index) => {
            const option = song.querySelector('.playlist__item-option')
            option.onclick = function () {
                stopPropagation()
            }
            song.onclick = function (e) {
                if (e.target != option && _this.currentIndex != index) {
                    _this.currentIndex = index
                    _this.loadCurrentSong()
                    _this.activeSong()
                    audio.play()
                }
            }
        })

        volumeBtn.onclick = function () {
            _this.isMute = !_this.isMute
            this.classList.toggle('active', _this.isMute)
            if (_this.isMute)
                audio.volume = 0
            else
                audio.volume = _this.currentVolume
        }

        heartIcon.onclick = function () {
            _this.isFavourite = !_this.isFavourite
            this.classList.toggle('active')
            const tooltip = this.querySelector('span')
            if (_this.isFavourite) {
                tooltip.textContent = 'Remove Favourite'
                tooltip.style.bottom = '80%'
            } else {
                tooltip.textContent = 'Add Favourite'
                tooltip.style.bottom = '70%'
            }
        }

        progressBar.onmousedown = function (e) {
            audio.currentTime = e.offsetX / this.offsetWidth * audio.duration
            _this.isHoldProgressBar = true
        }
        progressBar.onmousemove = function (e) {
            if (_this.isHoldProgressBar) {
                audio.currentTime = e.offsetX / this.offsetWidth * audio.duration
            }
        }
        volumeBar.onmousedown = function (e) {
            if (e.offsetX >= 0 && e.offsetX <= this.offsetWidth) {
                _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2)
                audio.volume = _this.currentVolume
                volume.style.width = audio.volume * 100 + '%'
                if (audio.volume === 0) _this.isMute = true
                else _this.isMute = false
                _this.isHoldVolumeBar = true
            }
        }
        volumeBar.onmousemove = function (e) {
            if (_this.isHoldVolumeBar) {
                if (e.offsetX >= 0 && e.offsetX <= this.offsetWidth) {
                    _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2)
                    audio.volume = _this.currentVolume
                    volume.style.width = audio.volume * 100 + '%'
                    if (audio.volume === 0) _this.isMute = true
                    else _this.isMute = false
                }
            }
        }
        audio.onvolumechange = function () {
            if (_this.isMute) {
                volumeBtn.classList.add('active')
                volume.style.width = 0
            }
            else {
                volumeBtn.classList.remove('active')
                volume.style.width = this.volume * 100 + '%'
            }
        }
        window.onmouseup = function () {
            _this.isHoldProgressBar = false
            _this.isHoldVolumeBar = false
        }

        document.onkeyup = function (e) {
            if (e.which === 32) {
                playBtn.click()
            }
        }
    },

    start() {
        this.defineProperties()

        this.renderSong()

        this.loadCurrentSong()

        this.handleEvents()
    }
}
app.start()
