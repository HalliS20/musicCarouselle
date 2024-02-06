import "./style.css"
// ========= register service worker ================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
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

// ========= fetch data from firebase storage and display audio ================
const audios = document.getElementById("audios")
fetch("http://localhost:3000/audio")
    .then((res) => res.json())
    .then((dataArray) => {
        for (const index in dataArray) {
            const data = dataArray[index]

            //=============== Audio Element and title =================
            const audio = new Audio(data.url) // audio element is fetched from firebase url
            const name = document.createElement("h2") // audio title is fetched from firebase storage
            name.innerText = data.name.split(".").slice(0, -1).join(".") // remove the file extension from the title

            //=============== Player Element =================
            const player = document.createElement("div")
            const playPauseButton = document.createElement("button")

            //========== add event listener to play audio
            playPauseButton.classList.add("playPauseButton")
            playPauseButton.innerText = "Play"
            playPauseButton.addEventListener("click", () =>
                playAudio(audio, playPauseButton),
            )

            //=============== Volume Slider Element =================
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


            //=============== Volume Icon Element =================
            const volumeIcon = document.createElement("i"); // Create an icon element
            volumeIcon.innerText = "+";
            volumeIcon.classList.add("volumeIcon"); // Add a class to style it later

            volumeSlider.style.display = "none"; // Initially hide the volume slider

            volumeIcon.addEventListener("click", () => {
                // Toggle the display property of the volume slider when the volume icon is clicked
                volumeSlider.style.display = volumeSlider.style.display === "none" ? "block" : "none";
            });


            //=============== Current Time + Total duration elements =================
            const currentTimeElement = document.createElement("span");
            const totalDurationElement = document.createElement("span");

            audio.addEventListener("timeupdate", () => {
                // Update the current time element with the current time of the audio
                const minutes = Math.floor(audio.currentTime / 60);
                const seconds = Math.floor(audio.currentTime % 60);
                currentTimeElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            });

            // Add a loadedmetadata event listener to the audio element
            audio.addEventListener("loadedmetadata", () => {
                // Update the total duration element with the duration of the audio
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                totalDurationElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            });

            // =============== time slider element =================
            const seekSlider = document.createElement("input");
            seekSlider.type = "range";
            seekSlider.min = "0";
            seekSlider.step = "1";
            seekSlider.value = "0";
            seekSlider.classList.add("seekSlider");

                // Add an input event listener to the slider
            seekSlider.addEventListener("input", () => {
                // Set the currentTime of the audio to the value of the slider
                audio.currentTime = seekSlider.value;
            });

                // Add a timeupdate event listener to the audio element
            audio.addEventListener("timeupdate", () => {
                // Update the value of the slider with the current time of the audio
                seekSlider.value = audio.currentTime;
            });

                // Add a loadedmetadata event listener to the audio element
            audio.addEventListener("loadedmetadata", () => {
                // Set the max value of the slider to the duration of the audio
                seekSlider.max = audio.duration;
            });


            seekSlider.addEventListener("input", () => {
                // Set the currentTime of the audio to the value of the slider
                audio.currentTime = seekSlider.value;
                // Update the --slider-percentage CSS variable
                seekSlider.style.setProperty('--slider-percentage', `${(seekSlider.value / seekSlider.max) * 100}%`);
            });

            audio.addEventListener("timeupdate", () => {
                // Update the value of the slider with the current time of the audio
                seekSlider.value = audio.currentTime;
                // Update the --slider-percentage CSS variable
                seekSlider.style.setProperty('--slider-percentage', `${(seekSlider.value / seekSlider.max) * 100}%`);
            });

            // ========= adding items to the html code ================

            const playBar = document.createElement("div")
            //======== add items to playBar
            playBar.classList.add("playBar")
            playBar.appendChild(playPauseButton)
            playBar.appendChild(volumeSlider) // Add the volume slider to the player
            playBar.appendChild(volumeIcon); // Add the volume icon to the player
            //========= add items to time bar
            const timeBar = document.createElement("div")
            timeBar.classList.add("timeBar")
            timeBar.appendChild(currentTimeElement);
            timeBar.appendChild(totalDurationElement);


            // ======== add playBar and title to player
            player.appendChild(name)
            player.appendChild(seekSlider)
            player.appendChild(timeBar)
            player.appendChild(playBar)
            player.classList.add("player")


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
    })
