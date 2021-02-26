const express = require("express")
const app = express()
const axios = require("axios")
const cors = require("cors")

const productsURL = "https://bad-api-assignment.reaktor.com/v2/products/"
const availabilityURL = "https://bad-api-assignment.reaktor.com/v2/availability"

app.use(cors())

app.use(express.static("build"))

app.get("/products/:category", (req, res) => {
    axios
    .get(`${productsURL}${req.params.category}`)
    .then(response => res.json(response.data))
    .catch(error => res.json({type: "error", msg: error.response}))
})

app.get("/availability/:manufacturer", (req, res) => {
    axios
        .get(`${availabilityURL}${req.params.manufacturer}`)
        .then(response => res.json(response.data))
        .catch(error => res.json({type: "error", msg: error.response}))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})