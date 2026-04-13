const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit } = require('firebase/firestore/lite');
const firebaseConfig = { projectId: "auditment-465c7" }; // Needs proper init if we test it this way, better to use the dev setup.
