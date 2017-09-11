import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBmzbR6PdsWC4NpYFMHYYJpdbCtZeI4QO4",
  authDomain: "portfolio-backend.firebaseapp.com",
  databaseURL: "https://portfolio-backend.firebaseio.com",
  projectId: "portfolio-backend",
  storageBucket: "portfolio-backend.appspot.com",
  messagingSenderId: "180348362500"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
