const express = require('express')
const router = express.Router()

// bring in article & user model
let Article = require('../models/article')
let User = require('../models/user')

//add page route
router.get('/add', ensureAuthenthicated, (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

// add submit POST route
router.post('/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.user._id
    article.body = req.body.body

    article.save(err => {
        if (err) return console.log(err)
        req.flash('success', 'Article Added')
        res.redirect('/')
    })
})

// get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return console.log(err) 
        User.findById(article.author, (err, user)=> {
            if (err) return console.log(err) 
            res.render('article', {
                article: article,
                author: user.name
            })
        })
    })
})

// access control
function ensureAuthenthicated(req, res, next) {
    if (req.isAuthenthicated()) {
        return next()
    } else {
        req.flash('danger', "Please log in.")
        res.redirect('/users/login')
    }
}

// load edit form
router.get('/edit/:id', ensureAuthenthicated, (req, res) => {
    Article.findById(req.params.id,(err, article) => {
        if (err) return console.log(err)
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized')
            res.redirect('/')
        }
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        })
    })
})

// update edited form 
router.post('/edit/:id', (req, res) => {

    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = {_id:req.params.id}

    Article.updateOne(query, article, err => {
        if (err) return console.log(err)
        req.flash('success', 'Article Updated')
        res.redirect('/')
    })
})

// handle delete

router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send()
    }

    let query = {_id:req.params.id}

    Article.findById(req.params.id, (err, article) => {
        if (req.user.id != article.author) {
            res.status(500).send()
        } else {
            Article.deleteOne(query, err => {
                if (err) return console.log(err)
                req.flash('success', 'Article Deleted')
                res.send('Success')
            })
        }
    })  
})

module.exports = router;
