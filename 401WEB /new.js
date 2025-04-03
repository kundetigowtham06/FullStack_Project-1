const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const express = require('express');
const path = require('path');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/signupSubmit', (req, res) => {
  const { name, email, password } = req.query;
  db.collection('SignUp-Details').add({
    Name: name,
    Email: email,
    Password: password
  })
  .then(() => {
    res.send('Sign Up successful');
  })
  .catch((error) => {
    res.send('Error: ' + error.message);
  });
});

app.get('/loginSubmit', (req, res) => {
  const { email, password } = req.query;
  db.collection('SignUp-Details').where('Email', '==', email)
    .where('Password', '==', password).get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        res.sendFile(path.join(__dirname, 'public', 'weather.html'));
      } else {
        res.sendFile(path.join(__dirname, 'public', 'signup.html'));
      }
    })
    .catch((error) => {
      res.send('Error: ' + error.message);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
