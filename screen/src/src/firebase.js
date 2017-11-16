import * as firebase from 'firebase';
const config = {
    
    apiKey: "AIzaSyA01uWTuh7SQ0L5HWEE6pBFSK21QAE6aFU",
    authDomain: "chatapp-c7682.firebaseapp.com",
    databaseURL: "https://chatapp-c7682.firebaseio.com",
    projectId: "chatapp-c7682",
    storageBucket: "chatapp-c7682.appspot.com",
    messagingSenderId: "955602881981"
};
firebase.initializeApp(config);
export default firebase;