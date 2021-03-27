require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const models = require('./models')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'SUCCESS 1'
    })
})

app.get('/files', (req, res) => {
    res.status(200).json({
        status: 'SUCCESS 2'
    })
})

app.get('/get-item-list', async (req, res) => {
    const items = await models.Item.findAll()
    res.status(200).json({
        data: items
    })
})

app.delete('/delete-item/:id', async (req, res) => {
    res.status(200).json({
        data: await models.Item.destroy({where:{ id: req.params.id }})
    })
})

app.delete('/delete-list/:id', async (req, res) => {
    res.status(200).json({
        data: await models.List.destroy({where:{ id: req.params.id }})
    })
})

app.listen(process.env.PORT, () => {
    console.log(`SERVER START IN PORT ${process.env.PORT}`)
})
