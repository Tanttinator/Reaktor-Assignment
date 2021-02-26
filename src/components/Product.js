const Product = ({product}) => {

    const style = {
        display: "inline-block",
        width: "200px",
        height: "250px",
        backgroundColor: "lightblue",
        border: "1px solid black",
        padding: "5px",
        margin: "5px",
        verticalAlign: "middle"
    }

    return (
        <span style={style}>
            <p>{product.name}</p>
            <p>Price: {product.price}$</p>
            <p>Manufacturer: {product.manufacturer}</p>
            <p>Available colors</p>
            <ul>
                {product.color.map(color => <li key={color}>{color}</li>)}
            </ul>
        </span>
    )
}

export default Product