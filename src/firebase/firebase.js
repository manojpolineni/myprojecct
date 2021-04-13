import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAfFZloPfs6cWgHRZkAa4gbtbP2Ln45y0M",
  authDomain: "telepuja-dev.firebaseapp.com",
  databaseURL: "https://telepuja-dev.firebaseio.com",
  projectId: "telepuja-dev",
  storageBucket: "telepuja-dev.appspot.com",
  messagingSenderId: "555357327531",
  appId: "1:555357327531:web:b8509ba3cdc66062df67ee",
  measurementId: "G-P6Z9TQ67W6"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = firebase.firestore();

export const user  = firebase.auth().currentUser;


export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();


//export const database = firebase.database();

