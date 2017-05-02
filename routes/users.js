const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')


const User = require('../models/user');


//register
router.post('/register', (req, res, next) => {



    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });


    User.addUser(newUser, (err, user) => {
        if(err){
            //console.log(newUser);
            //console.log(err);
            res.json({success:false, msg:'failed to register user'});
        } else {
            res.json({success:true, msg:'success to register user'});
        }
    });
    //res.send('REGISTER');


});

//authentica
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;

        if (!user) {
            return res.json({success:false, msg: 'user not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if(isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            } else { //no match
                return res.json({success: false, msg:'Wrong Password'});
            }
        });
    })
});

// profile - protected
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});


module.exports = router;