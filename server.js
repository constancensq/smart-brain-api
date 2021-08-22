const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'constance',
      password : '',
      database : 'smart-brain'
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// })

const app = express();

app.use(express.urlencoded({extended: true}));

// need to parse the json that comes in
app.use(express.json());

// need this so that can do testing on localhost or chrome will block
app.use(cors());

// dummy database for now
const database = {
    users: [
        {
            id: '123', 
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124', 
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id:'987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

// check with current list of users in database that credentials are correct
app.post('/signin', signin.handleSignIn(db, bcrypt))

// enter new information into the database
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)} )

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(3000, () => {
    console.log('app is running on port 3000')
})

const PORT = process.env.PORT
console.log(PORT) // PORT=3000 npm start to declare env variable
/*
/ --> res = this is working
/signin --> POST = success/fail (use POST bc want to send pw in the body over HTTPS so its hidden from MITM attacks)
/register --> POST = user
/profile/:userId --> GET = user 
/image --> PUT (to update the scores) --> user 
*/