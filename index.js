const express = require("express")
const app = express()
const axios = require("axios")
//axios.defaults.headers.get["x-force-error-mode"] = "all"
const cors = require("cors")
const NodeCache = require("node-cache")

//Store the URLs used by the app
const productsURL = "https://bad-api-assignment.reaktor.com/v2/products/"
const availabilityURL = "https://bad-api-assignment.reaktor.com/v2/availability/"

//Caches for data on the assignment API
const cacheOptions = { stdTTL: 300, checkperiod: 100, useClones: false, deleteOnExpire: false }
const products = new NodeCache( cacheOptions )
products.on("expired", (key, value) => {
    products.set(key, value)                //Keep old value as backup until value is updated
    console.log(`${key} has expired`)
    updateProductData(key)
})

const availability = new NodeCache( cacheOptions )
availability.on("expired", (key, value) => {
    availability.set(key, value)
    console.log(`${key} has expired`)
    updateAvailabilityData(key)
})

//Try to retrieve data from a cache
const getDataFromCache = async (cache, param, updateData) => {
    const data = cache.get(param)

    if(data === undefined) {
        return updateData(param)
    } else {
        return data
    }
}

//Update data of products
const updateProductData = async (param) => {
    const startTime = Date.now();
    console.log(`Updating data for: ${param}...`)
    const response = await axios.get(`${productsURL}${param}`)
    const data = response.data
    for(let product of data) {
        product.availability = await getAvailability(product)
    }
    products.set(param, data)
    console.log(`Data updated for ${param} in ${Date.now() - startTime}ms`)
    return data
}

//Update data of manufacturers
const updateAvailabilityData = async (param) => {
    var validData = false
    var data = null
    var tries = 0
    const startTime = Date.now();
    console.log(`Updating data for: ${param}...`)

    //If we get faulty data from the API, try again
    while(!validData) {
        tries++
        const response = await axios.get(`${availabilityURL}${param}`)
        data = response.data
        validData = data.response !== "[]"
        if(!validData) {
            if(tries > 20) {
                console.log(`Too many tries to update ${param}, interrupting`)
                validData = true
            } else {
                console.log(`Faulty data received for ${param}, trying again... (tries: ${tries})`)
            }
        }
    }

    availability.set(param, data)
    console.log(`Data updated for ${param} in ${Date.now() - startTime}ms`)
    return data
}

//Get the availability of a given product
const getAvailability = async (product) => {
    const manufacturerData = await getDataFromCache(availability, product.manufacturer, updateAvailabilityData)
    if(manufacturerData.response !== "[]") {
        const productData = manufacturerData.response.find(p => p.id === product.id.toUpperCase())
        if(productData !== undefined) {
            const inStock = productData.DATAPAYLOAD.split("<INSTOCKVALUE>")[1].split("</INSTOCKVALUE>")[0]
            if(inStock === "INSTOCK") return "In stock"
            else if(inStock === "OUTOFSTOCK") return "Out of stock"
            else if(inStock === "LESSTHAN10") return "Less than 10"
            else return "Corrupt data"
        }
    }
    return "No data"
}

//Enables communication between the frontend and the backend
app.use(cors())

//Serve our frontend to clients
app.use(express.static("build"))

//Serve data of products
app.get("/products/:category", async (req, res) => {
    try {
        const data = await getDataFromCache(products, req.params.category, updateProductData)
        res.json(data)
    } catch(error) {
        console.log(error)
        res.json(error)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})