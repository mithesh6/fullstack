import React, { useState, useEffect } from "react";
import Header from "../components/Search";
import Button from "@mui/material/Button";
import "../css/ecommerce-category-product.css";
import "../css/filter.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";

function Filter() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch data from JSON server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const result = await response.json();
        if (result && Array.isArray(result)) {
          setProducts(result);
          setFilteredProducts(result);

          // Extract unique categories
          const uniqueCategories = Array.from(new Set(result.map((product) => product.category)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  const handleSearch = (searchValue) => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);

    const uniqueCategories = Array.from(new Set(filtered.map((product) => product.category)));
    setCategories(uniqueCategories);
  };

  // Filter by category
  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    let filteredProducts = [];
    if (selectedCategory === "All") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter((product) => product.category === selectedCategory);
    }
    setFilteredProducts(filteredProducts);

    const uniqueCategories = Array.from(new Set(filteredProducts.map((product) => product.category)));
    setCategories(uniqueCategories);
  };

  // Filter by price
  const handlePriceFilter = () => {
    const minPriceValue = parseFloat(minPrice);
    const maxPriceValue = parseFloat(maxPrice);

    if (isNaN(minPriceValue) || isNaN(maxPriceValue)) {
      toast.error("Please enter valid numeric values for both minimum and maximum prices", {
        style: {
          boxShadow: "none",
        },
      });
      return;
    }

    const filteredByPrice = products.filter((product) => {
      return product.price >= minPriceValue && product.price <= maxPriceValue;
    });

    setFilteredProducts(filteredByPrice);
  };

  // Add product to cart (with localStorage update)
  const addToCart = (productId) => {
    const storedProducts = JSON.parse(localStorage.getItem("Products")) || [];
    const productIndex = storedProducts.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
      // Product already in cart; increment quantity
      storedProducts[productIndex].quantity += 1;
    } else {
      // New product; add to cart with quantity 1
      storedProducts.push({ id: productId, quantity: 1 });
    }

    // Update localStorage
    localStorage.setItem("Products", JSON.stringify(storedProducts));
    toast.success("Product added to cart!");
  };

  return (
    <>
      <Toaster />
      <Header onSearch={handleSearch} />
      <div className="MainContainer" style={{ display: "flex" }}>
        <FormControl className="FilterBar">
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            className="categories"
            defaultValue="All"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            <FormLabel id="demo-radio-buttons-group-label" className="CategoriesText">
              Categories
            </FormLabel>
            <FormControlLabel value="All" control={<Radio />} label="All" />
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                value={category}
                control={<Radio />}
                label={category}
              />
            ))}
          </RadioGroup>

          <Box sx={{ width: 300 }} className="Filterprice">
            <Typography className="priceText">Price</Typography>
            <div style={{ display: "flex", gap: "8px" }}>
              <TextField
                className="MinPrice"
                label="Min Price"
                variant="standard"
                size="small"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <TextField
                className="MaxPrice"
                label="Max Price"
                variant="standard"
                size="small"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <Button
              variant="contained"
              onClick={handlePriceFilter}
              className="Price-Filter-Button"
            >
              Filter
            </Button>
          </Box>
        </FormControl>

        <div className="Product-Container-Catogory">
          {categories.map((category) => (
            <div key={category} className="filter-category-container">
              <h2 className="Filter-category-title">{category}</h2>
              <div className="Filter-product-container">
                {filteredProducts
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <div className="ProductContainer page-wrapper" key={product.id}>
                      <div className="page-inner">
                        <div className="el-wrapper">
                          <div className="box-up">
                            <img
                              className="img"
                              id="Favİtemİmage"
                              src={product.thumbnail}
                              alt=""
                            />
                            <div className="img-info">
                              <div className="info-inner">
                                <span className="p-name">{product.title}</span>
                              </div>
                              <div className="a-size">{product.description}</div>
                            </div>
                          </div>
                          <div className="box-down">
                            <div className="h-bg">
                              <div className="h-bg-inner"></div>
                            </div>
                            <Button
                              variant="contained"
                              className="cart"
                              onClick={() => addToCart(product.id)} // Add to cart on button click
                            >
                              <span className="price">Rs.{product.price}</span>
                              <span className="add-to-cart">
                                <span className="txt">Add to Cart</span>
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </>
  );
}

export default Filter;