import axios from "axios"
import { useEffect, useState } from "react";

const productsURL = "/products/"
const availabilityURL = "/availability/"

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
