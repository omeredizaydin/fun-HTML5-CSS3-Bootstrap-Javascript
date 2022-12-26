const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const play1 = document.querySelector("#play i")
const next = document.querySelector("#controls #next");
const currentTime = document.querySelector("#current-time");
const duration = document.querySelector("#duration");
const badge = document.querySelector(".badge");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");

/*

 <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center"><span>Bos ver Nilufer</span>
                            <span class="badge bg-primary rounded-pill">3:40</span>
                            </li>
                        </ul>

*/



const player = new MusicPlayer(musicList);

// console.log(music.getName());  


window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
    
});


function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
    
}

function displayMusicList(list) {     
    for (let i = 0; i < list.length; i++) {
        let liTag = 
        `
            <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center"><span>${list[i].getName()}</span>
                <span id="music-${i}" class="badge bg-primary rounded-pill">3.40</span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>
        `;

        ul.insertAdjacentHTML("beforeend", liTag);   
        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            console.log(liAudioTag.duration);
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        });
    }   
}
play.addEventListener("click", () => {

    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();       
});

prev.addEventListener("click", () => {prevMusic();});
next.addEventListener("click", () => {nextMusic();});

const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();

}
const nextMusic = () => {
    player.next();
        let music = player.getMusic();
        displayMusic(music);
        playMusic(); 
        isPlayingNow();

   
}
const pauseMusic = () => {
    container.classList.remove("playing");
    play1.classList = "fa-solid fa-play";
    audio.pause();
}
const playMusic = () => {
    container.classList.add("playing");
    play1.classList = "fa-solid fa-stop";
    audio.play();
}

const calculateTime = (seconds) => {
    const minute = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    const updatedSecond = second < 10 ? `0${second}` :`${second}`;
    const result = `${minute}:${updatedSecond}`;
    return result;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
    // console.log(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let isMuted = false;
volume.addEventListener("click", () => {
    if (!isMuted) {
        volume.classList.remove("fa-volume-mute");
        volume.classList.add("fa-volume-high");
        isMuted = true;
        audio.volume = 1;
        volumeBar.value = 100;
        
    }
    else {
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-mute");
        audio.muted == true;
        audio.volume = 0;
        isMuted = false;
        volumeBar.value = 0;
    }

    
});
volumeBar.addEventListener("input", () => {
    audio.volume = (volumeBar.value) / 100;
    if (audio.volume == 0) {
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-mute");
    }
    else {
        volume.classList.remove("fa-volume-mute");
        volume.classList.add("fa-volume-high");
    }
});


const selectedMusic = (li) => {
    const index = li.getAttribute("li-index");
    player.index = index;
    
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
    
}

const isPlayingNow = () => {
    for (let li of ul.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing")
        }

        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
    
}

audio.addEventListener("ended", () => {
    nextMusic();
});