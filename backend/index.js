const express = require('express')
require('dotenv').config()

const database = require('./config/database')
database.connect()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', (red, res) => { res.send('SEVER ON') })
app.listen( port, () => {
    console.log('SEVER chay cong ' + port)
})