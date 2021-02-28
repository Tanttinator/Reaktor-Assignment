const express = require("express")
const app = express()
const axios = require("axios")
const cors = require("cors")

//Store the URLs used by the app
const productsURL = "https://bad-api-assignment.reaktor.com/v2/products/"
const availabilityURL = "https://bad-api-assignment.reaktor.com/v2/availability/"

//Cache for data on the assignment API
var products = {}
var manufacturers = {}

//Enables communication between the frontend and the backend
app.use(cors())

//Serve our frontend to clients
app.use(express.static("build"))

//Get the availability of a given product
const getAvailability = (product) => {
    return new Promise((resolve, reject) => {
        dataService(manufacturers, product.manufacturer, availabilityURL)
            .then(manufacturerData => {
                const productData = manufacturerData.response.find(p => p.id === product.id.toUpperCase())
                if(productData !== undefined) {
                    const inStock = productData.DATAPAYLOAD.split("<INSTOCKVALUE>")[1].split("</INSTOCKVALUE>")[0]
                    if(inStock === "INSTOCK") resolve("In stock")
                    else if(inStock === "OUTOFSTOCK") resolve("Out of stock")
                    else if(inStock === "LESSTHAN10") resolve("Less than 10")
                    else resolve("Corrupt data")
                } else {
                    resolve("No data")
                }
            }).catch(reject)
    })
}

//Handles data requests made by frontend
const dataService = (cache, param, url) => {
    if(param in cache && Date.now() - cache[param].timestamp < 300000) { //If the requested data is found in the cache and it is less than 5 minutes old, send it
        console.log(`${param} found in cache`)
        return Promise.resolve(cache[param].data)
    } else {                                                            //Else fetch the data from the API, store it in the cache and send it
        console.log(`Up-to-date data for ${param} not found in cache. Fetching new data...`)
        const startTime = Date.now()
        return new Promise((resolve, reject) => {
            axios
                .get(`${url}${param}`)
                .then(response => {
                    cache[param] = { data: response.data, timestamp: Date.now() }
                    console.log(`Fetched data in ${Date.now() - startTime}ms`)
                    resolve(response.data)
                })
        })
    }
}

app.get("/products/:category", async (req, res) => {
    try {
        const data = await dataService(products, req.params.category, productsURL, res)
        if(data.type !== "error") {
            for(let product of data) {
                product.availability = await getAvailability(product).catch(error => { throw error })
            }
            res.json(data)
        } else {
            res.json(data)
        }
    } catch(error) {
        console.log(error)
        res.json(error)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})