import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import "../css/newCart.css"; // Ensure to create a CSS file for styling if needed

function Cart() {
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]); // Cart products from localStorage

  // Fetch all products (from API or local data)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const result = await response.json();
        if (Array.isArray(result)) {
          setProducts(result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    
    fetchProducts();
  }, []);

  // Fetch cart items from localStorage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("Products")) || [];
    setCartProducts(storedProducts);
  }, []);

  // Calculate total amount in the cart
  const calculateTotal = () => {
    return cartProducts.reduce((total, cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (product) {
        total += product.price * cartItem.quantity;
      }
      return total;
    }, 0);
  };

  // Remove item from the cart
  const removeItem = (productId) => {
    const updatedCart = cartProducts.filter((item) => item.id !== productId);
    localStorage.setItem("Products", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
    toast.success("Item removed from cart");
  };

  // Update quantity of the product in the cart
  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartProducts.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem("Products", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
  };

  return (
    <div className="cart-container">
      <h3>Your Cart</h3>
      {cartProducts.length > 0 ? (
        <div className="cart-items">
          {cartProducts.map((cartItem) => {
            const product = products.find((p) => p.id === cartItem.id);
            return product ? (
              <div key={cartItem.id} className="cart-item">
                <img src={product.thumbnail} alt={product.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{product.title}</h4>
                  <p>Price: Rs.{product.price}</p>
                  <div className="quantity-selector">
                    <Button
                      variant="outlined"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                      disabled={cartItem.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{cartItem.quantity}</span>
                    <Button
                      variant="outlined"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <p>Total: Rs.{product.price * cartItem.quantity}</p>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(cartItem.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : null;
          })}
          <div className="cart-total">
            <h4>Total Amount: Rs.{calculateTotal()}</h4>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;