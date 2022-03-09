const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// bring in user model
let User = require('../models/user')

// Register Form
router.get('/register', (req, res)=> {
    res.render('register')
})

// register process 
// router.post('/register', async (req, res) => {
//     let newUser = new User()
//     newUser.name = req.body.name
//     newUser.email = req.body.email
//     newUser.username = req.body.username
//     newUser.password = req.body.password

//     bcrypt.genSalt(10, (err, salt)=> {
//         bcrypt.hash(newUser.password, salt, (err, hash)=> {
//             if (err) return console.log(err)
//             newUser.password = hash
//             newUser.save(err => {
//                 if (err) return console.log(err)
//                 req.flash('success', 'Registration successful. You can now log in.')
//                 res.redirect('/users/login')
//             })
//         })
//     })
// })

router.post('/register', async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
  
    const salt = await bcrypt.genSalt(10);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt)
    });
    newUser.save();
    req.flash('success', 'Registration Successful. You can now log in.');
    res.redirect('/users/login');

  });


router.get('/login', (req, res)=> {
    res.render('login')
})

module.exports = router