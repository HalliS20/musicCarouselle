import express from "express"
import cors from "cors"
import firebase from "firebase/compat/app"
import "firebase/compat/storage"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public', {
    maxAge: '1h' // cache for 1 hour
}));

const firebaseConfig = {
    apiKey: "AIzaSyBXUQo9B5V3oZ2j9nxc7lTex0ezU3BqSvc",
    authDomain: "muser-11dba.firebaseapp.com",
    projectId: "muser-11dba",
    storageBucket: "muser-11dba.appspot.com",
    messagingSenderId: "811128100318",
    appId: "1:811128100318:web:338142903bdbce063ef94f",
    measurementId: "G-Z1R0MTX35Z",
}

firebase.initializeApp(firebaseConfig)

/// get request to fetch the audio file from firebase storage
app.get("/audio", async (req, res) => {
    const storage = firebase.storage()
    const storageRef = storage.ref()
    const audioList = []

    storageRef
        .listAll()
        .then(async (result) => {
            const promises = result.items.map(async (itemRef) => {
                const url = await itemRef.getDownloadURL()
                audioList.push({ name: itemRef.name, url: url })
            })

            await Promise.all(promises)

            res.status(200).send(audioList)
        })
        .catch((error) => {
            console.error("Error listing files:", error)
        })
})

// starting the server
app.listen(3000, () => {
    console.log("Example app listening on port 3000!")
})

app.get("/audioList", async (req, res) => {
    const storage = firebase.storage()
    const storageRef = storage.ref()
    const audioList = []

    // Fetch the list of files in Firebase Storage
    const files = await storageRef.listAll()

    // Get the download URL for each file
    for (const file of files.items) {
        const url = await file.getDownloadURL()
        audioList.push(url)
    }

        console.log(audioList)
    // Return the list of URLs
    res.json(audioList)
})