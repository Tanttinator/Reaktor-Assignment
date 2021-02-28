const express = require("express")
const app = express()
const axios = require("axios")
const cors = require("cors")

//Store the URLs used by the app
const productsURL = "https://bad-api-assignment.reaktor.com/v2/products/"
const availabilityURL = "https://bad-api-assignment.reaktor.com/v2/availability"

//Cache for data on the assignment API
var products = {}
var manufacturers = {}

//Enables communication between the frontend and the backend
app.use(cors())

//Serve our frontend to clients
app.use(express.static("build"))

//Handles data requests made by frontend
const dataService = (cache, param, url, res) => {
    if(param in cache) { //If the requested data is found in the cache, send it
        res.json(cache[param])
        console.log(`${param} found in cache`)
    } else {            //Else fetch the data from the API, store it in the cache and send it
        console.log(`${param} not found in cache. Fetching data...`)
        const startTime = Date.now()
        axios
        .get(`${url}${param}`)
        .then(response => {
            cache[param] = response.data
            res.json(response.data)
            console.log(`Fetched data in ${Date.now() - startTime}ms`)
        })
        .catch(error => {
            console.log(error.message)
            res.json({type: "error", msg: error.message})
        })
    }
}

app.get("/products/:category", (req, res) => {
    dataService(products, req.params.category, productsURL, res)
})

app.get("/availability/:manufacturer", (req, res) => {
    dataService(manufacturers, req.params.manufacturer, availabilityURL, res)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})