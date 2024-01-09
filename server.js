import express from "express"
import cors from "cors"
import firebase from "firebase/compat/app"
import "firebase/compat/storage"

const app = express()
app.use(cors())
app.use(express.json())

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
    let audioList = []

    storageRef
        .listAll()
        .then(async (result) => {
            const promises = result.items.map(async (itemRef) => {
                const url = await itemRef.getDownloadURL()
                audioList.push({name: itemRef.name, url: url})
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
