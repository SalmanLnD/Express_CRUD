const express = require('express');
const app =  express();
const path = require('path');
const {logger,logEvents} = require('./middleware/logEvents');
const cors = require('cors')
const errorHanlder = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const connectDB = require(('./config/dbConn'))
require('dotenv').config();


const PORT = process.env.PORT || 3000;
connectDB()
//built in middleware
app.use(express.urlencoded({extended:false})) // for parsing application/x-www-form-urlencoded  
app.use(express.json()) // for parsing application/json
app.use('/', express.static(path.join(__dirname, 'public')))

//custom middelware
//routes

app.use('/refresh',require('./routes/refresh'))
app.use('/',require('./routes/root'))
app.use('/employees',verifyJWT,require('./routes/employees'))
app.use('/register',require('./routes/register'))
app.use('/auth',require('./routes/auth'))
app.use('/logout',require('./routes/logout'))




app.use(logger)
app.use(credentials)
app.use(cors(corsOptions))

app.all('/*', (req, res) => {
    res.status(404)
    if(req.accepts('html'))
        res.sendFile(path.join(__dirname,'views','404.html'))
    else if(req.accepts('json'))
        res.send({error:'404 Not Found'})
    else
        res.type('txt').send('404 Not Found')
})

app.use(errorHanlder)

mongoose.connection.once('open',()=>{
    console.log('Connected to database')
})
app.listen(PORT, () => {console.log(`Server running on port http://localhost:${PORT}`)})