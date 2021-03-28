require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Apollo = require('./graphql/schema')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

Apollo.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
    console.log(`SERVER START IN PORT ${process.env.PORT}`)
})
