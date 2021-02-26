const express = require("express")
const app = express()
const axios = require("axios")
const cors = require("cors")

const productsURL = "https://bad-api-assignment.reaktor.com/v2/products/"
const availabilityURL = "https://bad-api-assignment.reaktor.com/v2/availability"

app.use(cors())

app.get("/products/", (req, res) => {
    axios
    .get(`${productsURL}gloves`)
    .then(response => {
        res.json(response.data)
    })
})

app.get("/availability/", (req, res) => {
    res.send("Availability")
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})