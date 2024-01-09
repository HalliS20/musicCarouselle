import "./style.css"


document.querySelector("#app").innerHTML = `
  <div>
    <div id="audioPlayer">
      <div id="audios"></div>
    </div>
  </div>
`

let audios = document.getElementById("audios")
fetch("http://localhost:3000/audio")
    .then((res) => res.json())
    .then((dataArray) => {
        dataArray.forEach((data) => {
            console.log(data)
            const audio = document.createElement("audio")
            audio.controls = true
            audio.autoplay = true
            audio.src = data.url

            const name = document.createElement("h2")
            name.innerText = data.name.split(".").slice(0, -1).join(".")

            const player = document.createElement("div")
            player.appendChild(name)
            player.appendChild(audio)
            player.classList.add("player")

            audios.appendChild(player)
        })
    })
