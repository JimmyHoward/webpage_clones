const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection

//init app
const app = express()


// BodyPaser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname,'public')))

//bring in models
let Article = require('./models/articles')
const { read } = require('fs')

db.once('open', ()=> {
    console.log("connected to mongodb")
})

//check for db errors
db.on('error', err => {
    console.log(err)
})

//load view engine
// (set views to be default folder where res.render looks at)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            })
        }
    })
    
})

//addroute
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

// add submit POST route
app.post('/articles/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save(err => {
        if (err) return console.log(err)
        res.redirect('/')
    })
})

// get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return console.log(err) 
        res.render('article', {
            article: article
        })
    })
})

// load edit form
app.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id,(err, article) => {
        if (err) return console.log(err)
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        })
    })
})

// update edited form 
app.post('/articles/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = {_id:req.params.id}

    Article.update(query, article, err => {
        if (err) return console.log(err)
        res.redirect('/')
    })
})

// handle delete

app.delete('/article/:id', (req, res) => {
    let query = {_id:req.params.id}

    Article.remove(query, err => {
        if (err) return console.log(err)
        res.send('Success')
    })
})

//start server
app.listen(3000, () => {
    console.log('Server started on port 3000...')
})