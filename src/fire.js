import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyAh2byLZOSwjzfJJRhrFvKVkx5rj9QFoGs",
  authDomain: "photo-app-typito.firebaseapp.com",
  databaseURL: "https://photo-app-typito.firebaseio.com",
  storageBucket: "your-domain-name.appspot.com",
  projectId: "photo-app-typito",
  storageBucket: "photo-app-typito.appspot.com",
  messagingSenderId: "537969035405",
  appId: "1:537969035405:web:f2fa83115ad6c407203ac4",
  measurementId: "G-87FS2EZJYF"
};
var fire = firebase.initializeApp(config);

const storage = firebase.storage();
export {
  storage,fire as default
}