import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyA0K5PIGWi_0e4Y8hE5eaEYzkNky1eRqs4',
  authDomain: 'scgpaas.firebaseapp.com',
  databaseURL: 'https://scgpaas.firebaseio.com',
  projectId: 'scgpaas',
  storageBucket: 'scgpaas.appspot.com',
  messagingSenderId: '704987063550'
};

class FirebaseService {
  auth = null;
  database = null;
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.database = app.firestore();
  }

  add(doc) {
    this.database
      .collection(process.env.APP_ENV)
      .add(doc)
      .catch(function(error) {
        // eslint-disable-next-line
        console.error('Error adding document: ', error);
      });
  }

  log(doc, databaseName) {
    this.database
      .collection(databaseName)
      .add(doc)
      .catch(function(error) {
        // eslint-disable-next-line
        console.error('Error adding document: ', error);
      });
  }
}

export default new FirebaseService();
