const express = require('express');
const { hostname } = require('os');
const path = require('path');
const { engine } = require('express-handlebars');
const app = express();
const logger = require('./middleware/logger');
const members = require('./Members.js');

// init logger
// app.use(logger)

// express handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) =>
	res.render('index', {
		title: 'Member App',
		members
	})
);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// members api routes
app.use('/api/members', require('./routes/api/members'));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
