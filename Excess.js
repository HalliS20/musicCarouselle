// //=============== Player Element =================
// const playPauseButton = document.createElement("button")

// //========== add event listener to play audio
// playPauseButton.classList.add("playPauseButton")
// playPauseButton.innerText = "Play"
// playPauseButton.addEventListener("click", () =>
//     playAudio(audio, playPauseButton),
// )

// //=============== Volume Slider Element =================
// const volumeSlider = document.createElement("input")
// volumeSlider.type = "range"
// volumeSlider.min = "0"
// volumeSlider.max = "1"
// volumeSlider.step = "0.01"
// volumeSlider.value = "1"
// volumeSlider.addEventListener("input", () => {
//     audio.volume = volumeSlider.value
// })
// volumeSlider.classList.add("volumeSlider")

// //=============== Volume Icon Element =================
// const volumeIcon = document.createElement("i") // Create an icon element
// volumeIcon.innerText = "+"
// volumeIcon.classList.add("volumeIcon") // Add a class to style it later

// volumeSlider.style.display = "none" // Initially hide the volume slider

// volumeIcon.addEventListener("click", () => {
//     // Toggle the display property of the volume slider when the volume icon is clicked
//     volumeSlider.style.display =
//         volumeSlider.style.display === "none" ? "block" : "none"
// })

// //=============== Current Time + Total duration elements =================
// const currentTimeElement = document.createElement("span")
// const totalDurationElement = document.createElement("span")

// audio.addEventListener("timeupdate", () => {
//     // Update the current time element with the current time of the audio
//     const minutes = Math.floor(audio.currentTime / 60)
//     const seconds = Math.floor(audio.currentTime % 60)
//     currentTimeElement.textContent = `${minutes}:${
//         seconds < 10 ? "0" : ""
//     }${seconds}`
// })

// // Add a loadedmetadata event listener to the audio element
// audio.addEventListener("loadedmetadata", () => {
//     // Update the total duration element with the duration of the audio
//     const minutes = Math.floor(audio.duration / 60)
//     const seconds = Math.floor(audio.duration % 60)
//     totalDurationElement.textContent = `${minutes}:${
//         seconds < 10 ? "0" : ""
//     }${seconds}`
// })

// // =============== time slider element =================
// const seekSlider = document.createElement("input")
// seekSlider.type = "range"
// seekSlider.min = "0"
// seekSlider.step = "1"
// seekSlider.value = "0"
// seekSlider.classList.add("seekSlider")

// // Add a timeupdate event listener to the audio element
// audio.addEventListener("timeupdate", () => {
//     // Update the value of the slider with the current time of the audio
//     seekSlider.value = audio.currentTime
//     // Update the --slider-percentage CSS variable
//     seekSlider.style.setProperty(
//         "--slider-percentage",
//         `${(seekSlider.value / seekSlider.max) * 100}%`,
//     )
// })

// // Add a loadedmetadata event listener to the audio element
// audio.addEventListener("loadedmetadata", () => {
//     // Set the max value of the slider to the duration of the audio
//     seekSlider.max = audio.duration
// })

// seekSlider.addEventListener("input", () => {
//     // Set the currentTime of the audio to the value of the slider
//     audio.currentTime = seekSlider.value
//     // Update the --slider-percentage CSS variable
//     seekSlider.style.setProperty(
//         "--slider-percentage",
//         `${(seekSlider.value / seekSlider.max) * 100}%`,
//     )
// })
