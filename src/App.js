import axios from "axios"
import { useEffect, useState } from "react";
import Product from "./components/Product";

const productsURL = "/products/"
const availabilityURL = "/availability/"

const categories = [
  "gloves",
  "facemasks",
  "beanies"
]

const style = {
  fontFamily: "Arial"
}

const App = () => {

  const [category, setCategory] = useState(categories[0])
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get(`${productsURL}${category}`)
      .then(response => {
        setProducts(response.data)
      }).catch(error => console.log(error))
  }, [category])

  return (
    <div style={style}>
      <h1>Products</h1>
      <div>
        {categories.map(category => <button key={category} onClick={() => setCategory(category)}>{category}</button>)}
      </div>
      {products.map(product => <Product key={product.id} product={product} />)}
    </div>
  );
}

export default App;
