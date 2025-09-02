import React, { useState, useEffect } from 'react';
import './Consumer.css';
import API_BASE_URL from './config/api.js';
import Header from "./Header.jsx";

const Products = () => {
  const [todoList, setTodoList] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    // Fetch all products from all producers
    fetch(`${API_BASE_URL}/getproducer`)
      .then((res) => res.json())
      .then((data) => {
        setTodoList(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Filtered todoList based on search
  const filteredTodoList = todoList.filter(
    (item) =>
      item.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
      item.variety.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="product-input">
        <div className="search-todo">
          <input
            type="search"
            className="search-box"
            placeholder="Search by Address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>

        <div className="search-todo">
          <input
            type="search"
            className="search-box"
            placeholder="Search by Item Type..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
        </div>
      </div>

      <div className="todo-list">
        <h3>Buy Products</h3>
        {filteredTodoList.length > 0 ? (
          <div className="todo-container">
            {filteredTodoList.map((item) => (
              <div key={item._id} style={{ marginBottom: "10px" }} className="items">
                <p>
                  <span>Producer:</span> {item.name} <br />
                  <span>Contact:</span> {item.number} <br />
                  <span>Location:</span> {item.address} <br />
                  <span>Product:</span> {item.variety} <br />
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
