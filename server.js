const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const uri = process.env.CONNECTION_URL
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: false })
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.log(e))

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

app.get('/:tag', async (req, res) => {
    const articles = await Article.find({ tag: req.params.tag }).sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

app.post('/', async (req, res) => {
    try{
        const articles = await Article.find({ $text: { $search: req.body.search } }).sort({ createdAt: 'desc' })
        res.render('articles/index', { articles: articles })
    } catch (error) {
        console.log(error)
    }
})

app.use('/articles', articleRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT)