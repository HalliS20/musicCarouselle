import "./style.css"

document.querySelector("#app").innerHTML = `
  <div>
    <div id="audioPlayer">
      <div id="audios"></div>
    </div>
  </div>
`

const audios = document.getElementById("audios")
fetch("http://localhost:3000/audio")
    .then((res) => res.json())
    .then((dataArray) => {
        dataArray.forEach((data) => {
            console.log(data)
            const audio = new Audio(data.url)

            const name = document.createElement("h2")
            name.innerText = data.name.split(".").slice(0, -1).join(".")

            const player = document.createElement("div")
            const playPauseButton = document.createElement("button")
            playPauseButton.classList.add("playPauseButton")
            playPauseButton.innerText = "Play"
            playPauseButton.addEventListener("click", playAudio)

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

            function playAudio() {
                audio.play()
                playPauseButton.innerText = "Pause"
                playPauseButton.removeEventListener("click", playAudio)
                playPauseButton.addEventListener("click", pauseAudio)
            }

            function pauseAudio() {
                audio.pause()
                playPauseButton.innerText = "Play"
                playPauseButton.removeEventListener("click", pauseAudio)
                playPauseButton.addEventListener("click", playAudio)
            }

            player.appendChild(name)
            player.appendChild(playPauseButton)
            player.appendChild(volumeSlider) // Add the volume slider to the player
            player.classList.add("player")

            audios.appendChild(player)
        })
    })
