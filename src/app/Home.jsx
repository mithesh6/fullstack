import React, { useState, useEffect } from 'react';
import Header from '../components/Search';
import Product from '../components/Product';
import Basket from '../components/Basket';
import '../css/Home.css'
import LoginImage from '../components/LoginImage';
import Slider from '../components/Slider';

export default function Home() {
    const [money] = useState(100000);
    const [basket, setBasket] = useState([]);
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const resetBasket = () => {
        setBasket([]);
        setTotal(0);
    };

    const handleSearch = (searchValue) => {
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredProducts(filtered);

        // Extract unique categories from the filtered products
        const uniqueCategories = Array.from(new Set(filtered.map(product => product.category)));
        setCategories(uniqueCategories);
    };

    // Fetch data from the local Fake JSON server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/products'); // Use the local Fake JSON Server URL
                const result = await response.json();
                
                if (result && Array.isArray(result)) {
                    setProducts(result);
                    setFilteredProducts(result);  // Initialize filtered products with all products

                    // Get unique categories from the result
                    const uniqueCategories = Array.from(new Set(result.map(product => product.category)));
                    setCategories(uniqueCategories);
                } else {
                    console.error('Invalid data structure:', result);
                    setProducts([]);
                    setFilteredProducts([]);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Only run once when the component mounts

    return (
        <div className="Main">
            <Header onSearch={handleSearch} />

            {total > 0 && (
                <Basket resetBasket={resetBasket} total={total} products={filteredProducts} basket={basket} />
            )}
            
            {/* Slider component */}
            {/* <Slider slides={products} /> */}
            <LoginImage />

            <div className="categories-container">
                {categories.length > 0 && categories.map(category => (
                    <div key={category} className="category-container">
                        <h2 className="category-title">{category}</h2>
                        <div className="product-container">
                            {filteredProducts
                                .filter(product => product.category === category)
                                .map(product => (
                                    <Product
                                        key={product.id}
                                        total={total}
                                        money={money}
                                        basket={basket}
                                        setBasket={setBasket}
                                        product={product}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}