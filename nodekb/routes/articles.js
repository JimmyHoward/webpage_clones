const express = require('express')
const router = express.Router()

// bring in article model
let Article = require('../models/articles')

//addroute
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

// add submit POST route
router.post('/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
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
        res.render('article', {
            article: article
        })
    })
})

// load edit form
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id,(err, article) => {
        if (err) return console.log(err)
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
    let query = {_id:req.params.id}

    Article.deleteOne(query, err => {
        if (err) return console.log(err)
        req.flash('success', 'Article Deleted')
        res.send('Success')
    })
})

module.exports = router;
