import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight, BsCircleFill } from "react-icons/bs";
import '../css/Slider.css';

const ImageSlider = ({ slides }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/products'); // Replace with local Fake JSON Server URL
        const result = await response.json();
        setProducts(result);  // Assuming result is an array of products
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setSlideIndex((prevIndex) =>
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [products]);

  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className='slider'>
      {/* Only render slider if products are available */}
      {products.length > 0 ? (
        <>
          <BsChevronCompactLeft className='left-arrow' onClick={prevSlide} />
          <BsChevronCompactRight className='right-arrow' onClick={nextSlide} />
          <div className='slider-container'>
            {products.map((product, index) => (
              <div
                className={index === slideIndex ? 'slide active' : 'slide'}
                key={index}
              >
                {index === slideIndex && (
                  <img src={product.thumbnail} alt='product image' className='image' />
                )}
              </div>
            ))}
          </div>
          <div className='slider-dots'>
            {products.map((_, index) => (
              <BsCircleFill
                key={index}
                className={index === slideIndex ? 'dot active' : 'dot'}
                onClick={() => setSlideIndex(index)}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p> // Display loading message until products are fetched
      )}
    </section>
  );
};

export default ImageSlider;
