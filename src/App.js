import axios from "axios"
import { useEffect, useState } from "react";
import Product from "./components/Product";

//Store the URLs used by the app
const productsURL = "/products/"

//Categories can be added/removed using this list
const categories = [
  "gloves",
  "facemasks",
  "beanies"
]

//Style used by the whole app
const style = {
  fontFamily: "Arial"
}

const App = () => {

  const [category, setCategory] = useState(categories[0]) //Stores the category currently selected
  const [products, setProducts] = useState([])            //Stores all the products from the current category

  //Fetch the products in the current category
  useEffect(() => {
    const startTime = Date.now()
    axios
      .get(`${productsURL}${category}`)
      .then(response => {
        if(response.data.type === "error") {
          console.log(response.data.msg)
        } else {
          console.log(`Fetched data in ${(Date.now() - startTime)}ms`)
          setProducts(response.data)
        }
      }).catch(error => console.log(error.message))
  }, [category])

  //Sort products alphabetically
  products.sort((a, b) => a.name.localeCompare(b.name))

  //Build the webpage
  return (
    <div style={style}>
      <h1>Products</h1>
      <div>
        {categories.map(category => <button key={category} onClick={() => setCategory(category)}>{category}</button>)}
      </div>
      <h2>{category}</h2>
      {products.map(product => <Product key={product.id} product={product} />)}
    </div>
  );
}

export default App;
