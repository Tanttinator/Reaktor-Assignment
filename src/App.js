import axios from "axios"
import { useEffect, useState } from "react";

const productsURL = "http://localhost:3001/products/"
const availabilityURL = "http://localhost:3001/availability/"

function App() {

  const [items, setItems] = useState([])

  useEffect(() => {
    axios
      .get(productsURL)
      .then(response => {
        setItems(response.data)
      }).catch(error => console.log(error))
  }, [])

  return (
    <div>
      <p>Title</p>
      {items.map(item => <p>{item.name}</p>)}
    </div>
  );
}

export default App;
