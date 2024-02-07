import "./style.css"

// ========= HTML Code ================
document.querySelector("#app").innerHTML = `
  <div>
        <div id="audioPlayer">
            <div id="leftTransparent"></div>   
            <div id="audios"></div>
            <div id="rightTransparent"></div>
        </div>
  </div>
`

// ========= play audio function ================
function playAudio(audio, playPauseButton) {
    audio.play()
    playPauseButton.innerText = "Pause"

    //========== change event listener to pause audio
    playPauseButton.removeEventListener("click", playAudio)
    playPauseButton.addEventListener("click", () =>
        pauseAudio(audio, playPauseButton),
    )
}

// ========= pause audio function ================
function pauseAudio(audio, playPauseButton) {
    audio.pause()
    playPauseButton.innerText = "Play"

    //========= change event listener to play audio
    playPauseButton.removeEventListener("click", pauseAudio)
    playPauseButton.addEventListener("click", () =>
        playAudio(audio, playPauseButton),
    )
}

async function fetchAudio() {
    const response = await fetch("http://localhost:3000/audio")
    const data = await response.json()
    return data
}

function createPlayBarElement(audio) {
    const playBar = document.createElement("div")
    const playPauseButton = document.createElement("button")

    playPauseButton.classList.add("playPauseButton")
    playPauseButton.innerText = "Play"
    playPauseButton.addEventListener("click", () =>
        playAudio(audio, playPauseButton),
    )
    playBar.classList.add("playBar")
    playBar.appendChild(playPauseButton)
    const volumes = createVolumeIconElement(audio)
    playBar.appendChild(volumes[0])
    playBar.appendChild(volumes[1])
    return playBar
}

function createVolumeIconElement(audio) {
    //=============== settings for volume slider =================
    const volumeSlider = document.createElement("input")
    volumeSlider.type = "range"
    volumeSlider.min = "0"
    volumeSlider.max = "1"
    volumeSlider.step = "0.01"
    volumeSlider.value = "1"
    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value
    })
    volumeSlider.classList.add("volumeSlider")
    //=============== settings for volume icon =================
    const volumeIcon = document.createElement("i") // Create an icon element
    volumeIcon.innerText = "+"
    volumeIcon.classList.add("volumeIcon") // Add a class to style it later

    volumeSlider.style.display = "none" // Initially hide the volume slider

    volumeIcon.addEventListener("click", () => {
        // Toggle the display property of the volume slider when the volume icon is clicked
        volumeSlider.style.display =
            volumeSlider.style.display === "none" ? "block" : "none"
    })
    return [volumeIcon, volumeSlider]
}

function createCurrentTimeElement(audio) {
    const currentTimeElement = document.createElement("span")
    audio.addEventListener("timeupdate", () => {
        const minutes = Math.floor(audio.currentTime / 60)
        const seconds = Math.floor(audio.currentTime % 60)
        currentTimeElement.textContent = `${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`
    })
    return currentTimeElement
}

function createTotalDurationElement(audio) {
    const totalDurationElement = document.createElement("span")
    audio.addEventListener("loadedmetadata", () => {
        // Update the total duration element with the duration of the audio
        const minutes = Math.floor(audio.duration / 60)
        const seconds = Math.floor(audio.duration % 60)
        totalDurationElement.textContent = `${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`
    })

    return totalDurationElement
}

function createTimeBarElement(audio) {
    const timeBar = document.createElement("div")
    const currTime = createCurrentTimeElement(audio, timeBar)
    const totalTime = createTotalDurationElement(audio, timeBar)
    timeBar.appendChild(currTime)
    timeBar.appendChild(totalTime)
    timeBar.classList.add("timeBar")
    return timeBar
}

function createTimeSliderElement(audio) {
    const seekSlider = document.createElement("input")
    seekSlider.type = "range"
    seekSlider.min = "0"
    seekSlider.step = "1"
    seekSlider.value = "0"
    seekSlider.classList.add("seekSlider")
    seekSlider.addEventListener("input", () => {
        audio.currentTime = seekSlider.value
        // Update the --slider-percentage CSS variable
        seekSlider.style.setProperty(
            "--slider-percentage",
            `${(seekSlider.value / seekSlider.max) * 100}%`,
        )
    })
    audio.addEventListener("timeupdate", () => {
        seekSlider.value = audio.currentTime
        // Update the --slider-percentage CSS variable
        seekSlider.style.setProperty(
            "--slider-percentage",
            `${(seekSlider.value / seekSlider.max) * 100}%`,
        )
    })
    audio.addEventListener("loadedmetadata", () => {
        seekSlider.max = audio.duration
    })
    return seekSlider
}

function createPlayerElement(audio, name) {
    const player = document.createElement("div")
    const playBar = createPlayBarElement(audio)
    const timeBar = createTimeBarElement(audio)
    const seeker = createTimeSliderElement(audio)
    player.appendChild(name)
    player.appendChild(seeker)
    player.appendChild(timeBar)
    player.appendChild(playBar)
    player.classList.add("player")
    return player
}

const audios = document.getElementById("audios")

const dataArray = await fetchAudio()
for (const index in dataArray) {
    const data = dataArray[index]

    //=============== Audio Element and title =================
    const audio = new Audio(data.url) // audio element is fetched from firebase url
    const name = document.createElement("h2") // audio title is fetched from firebase storage
    name.innerText = data.name.split(".").slice(0, -1).join(".") // remove the file extension from the title

    // ========= adding items to the html code ================

    const player = createPlayerElement(audio, name)
    // ========= add player to the audios element on website
    audios.appendChild(player)

    // ========= Intersection Observer for fading out the player ================
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("centered")
                } else {
                    entry.target.classList.remove("centered")
                }
            })
        },
        {root: null, rootMargin: "0px", threshold: 1},
    )

    observer.observe(player)
}
