import axios from "axios"
import { useEffect, useState } from "react";

const productsURL = "/products/"
const availabilityURL = "/availability/"

const categories = [
  "gloves",
  "facemasks",
  "beanies"
]

const App = () => {

  const [category, setCategory] = useState(categories[0])
  const [items, setItems] = useState([])

  useEffect(() => {
    axios
      .get(`${productsURL}${category}`)
      .then(response => {
        setItems(response.data)
      }).catch(error => console.log(error))
  }, [category])

  return (
    <div>
      <p>Title</p>
      <div>
        {categories.map(category => <button key={category} onClick={() => setCategory(category)}>{category}</button>)}
      </div>
      <ul>
        {items.map(item => <li key={item.name}>{item.name}</li>)}
      </ul>
    </div>
  );
}

export default App;
