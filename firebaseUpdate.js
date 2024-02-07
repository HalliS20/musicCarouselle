import admin  from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve( '../../../../../Downloads/muserAdmin.json'), 'utf8'));

console.log(serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://muser-11dba.appspot.com'
});

const bucket = admin.storage().bucket();

// Specify the path to the file you want to update
const filePath = 'Alltaf SOlO.wav';

// Update cache-control metadata for the file
bucket.file(filePath).setMetadata({
    cacheControl: 'public, max-age=3600'
})
    .then(() => {
        console.log('Cache-control metadata updated for file.');
    })
    .catch((error) => {
        console.error('Error updating cache-control metadata:', error);
    });


bucket.file(filePath).getMetadata()
    .then((metadata) => {
        console.log('Metadata:', metadata);
        // Check if cache-control metadata has been updated
        const cacheControl = metadata[0].cacheControl;
        if (cacheControl === 'public, max-age=3600') {
            console.log('Cache-control metadata was updated successfully.');
        } else {
            console.log('Cache-control metadata was not updated or does not match.');
        }
    })
    .catch((error) => {
        console.error('Error getting metadata:', error);
    });