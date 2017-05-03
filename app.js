const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');


// DB STUFF --> config object in config/db
mongoose.connect(config.database);

// confirm message to console
mongoose.connection.on('connected', () => {
    console.log('Connected to database' + config.database)
});

//error message to console
mongoose.connection.on('error', (err) => {
    console.log('Error: ' + err)
});


const app = express();

const users = require('./routes/users');

// Port number
const port = 3000;

// Cors Middelware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

////////////////////////////////////
app.use(bodyParser.urlencoded({
    extended: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.use('/users', users);


//Index route
app.get('/', (req, res) => {
    res.send('invalid endpoint')
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

//start server
app.listen(port, () => {
    console.log('Server started on port ' + port )
});