
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReapet: false,
    songs: [
       {
            name: 'Anh sai rồi',
            singer: 'Sơn Tùng',
            path: 'assets/music/Anh sai rồi - MTP.mp3',
            image: 'assets/img/sontung.jpg'
       },
       {
            name: 'Goodnight',
            singer: 'ariana grande',
            path: 'assets/music/goodnight n go x double take — ariana grande & dhruv mashup by dominic novas (slowed down).mp3',
            image: 'assets/img/thistime.png'
        },
        {
            name: 'Love In Your Eyes',
            singer: 'Sơn Tùng',
            path: 'assets/music/Love in your eyes - Sơn Tùng M-TP.mp3',
            image: 'assets/img/sontung.jpg'
        },
        {
            name: 'Baby Take My Hand - Trgthao ft. TiB [ Lê Bảo Mix ]',
            singer: 'Lê Bảo',
            path: 'assets/music/Baby Take My Hand - Trgthao ft. TiB [ Lê Bảo Mix ].mp3',
            image: 'assets/img/LeBap.jpg'
        },
        {
            name: 'HITMYLINE',
            singer: 'CONCEPCION ft. Vinsint',
            path: 'assets/music/CONCEPCION ft. Vinsint - HITMYLINE (Official Audio).mp3',
            image: 'assets/img/concepcion.png'
        },
        {
            name: 'Meant To Be',
            singer: 'GDucky',
            path: 'assets/music/meantobe.mp3',
            image: 'assets/img/HaiTrieu.jpg'
        },
        {
            name: 'Khi Người Mình Yêu Khóc Remix',
            singer: 'Phạm Nam Khánh',
            path: 'assets/music/Khi Người Mình Yêu Khóc Remix - Vinz Mix - Phạm Nam Khánh -.mp3',
            image: 'assets/img/khinguoiyeuminhkhoc.png'
        },
        {
            name: 'TẠI VÌ SAO',
            singer: 'MCK',
            path: 'assets/music/RPT MCK - TẠI VÌ SAO - Official Music Video.mp3',
            image: 'assets/img/Mck.jpg'
        },
        {
            name: 'THIS TIME',
            singer: 'HT',
            path: 'assets/music/This Time.mp3',
            image: 'assets/img/thistime.png'
        },
        {
            name: 'Vậy thì cần gì nói iu',
            singer: 'HT',
            path: 'assets/music/Wxrdie - CẦN GÌ NÓI IU [feat. 2pillz] - OFFICIAL MV.mp3',
            image: 'assets/img/HaiTrieu.jpg'
        },
    ],

    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index ="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            
            `
        })
         playlist.innerHTML = htmls.join('')
    },

    hanlderEvents: function() {
        const _this = this 
        const cdWidth = cd.offsetWidth

        // xử lý CD quay và dừng
        const cdThumbAnimate =  cdThumb.animate([
            {
               transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            interations: Infinity
        })
        cdThumbAnimate.pause();
      
       

        // handle phóng to thu nhỏ CD
        document.onscroll = function(event) {
            const scrollTop = window.screen.scrollTop || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

           cd.style.width = newCdWidth >0 ? newCdWidth  + 'px' :0
           cd.style.opacity = newCdWidth/cdWidth 

        }

        // handler khi play bài hát
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
               
                
            }else {
                audio.play()
              
            }
         
        }

        // khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        // khi bài hát được pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
           
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
              
            }

        }
        // xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seektime = audio.duration / 100*e.target.value
            audio.currentTime = seektime
        }
        // khi next song 
        btnNext.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong( )
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev song 
        btnPrev.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong( )
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //ramdom bài hát
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active')
           
        }

        // repeat bài hát
        btnRepeat.onclick = function() {
            _this.isReapet =!_this.isReapet
            btnRepeat.classList.toggle('active')
        }

        // xử lý next song khi bài hát kết thúc
        audio.onended = function() {
            if(_this.isReapet) {
                audio.play()
            }else {
                btnNext.click()
            }
        }

        // lắng nghe click bào list bài hát
        playlist.onclick =  function(e) {
            const songNode = e.target.closest('.song:not(.active)')
          if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currenIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')) {

                }
          }

          else{
            console.log(e.target)
          }
        }

    },

    scrollToActiveSong: function() {
        setTimeout(() => {
           $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center'
           }) 
        }, 500);
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currenIndex]
            }
        })  
    },

    loadCurrentSong: function(current) {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() { 
        this.currenIndex++;
        if(this.currenIndex >= this.songs.length ) {
            this.currenIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() { 
        this.currenIndex--;
        if(this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() { 
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex) 
            this.currenIndex = newIndex
            this.loadCurrentSong()
    },
   
    start: function() {
        this.defineProperties()

        this.hanlderEvents()

        this.loadCurrentSong()

        this.render()
       
    }

}

app.start();