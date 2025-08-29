import React, { useState, useEffect } from 'react';
import Header from "./Header.jsx";
import "./Consumer.css";
import { useAuth } from './context/AuthContext';

const Producer = () => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('');
    const [variety, setVariety] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');

    // Add a new producer
    async function handleAddToList() {
        if (!name || !number || !address || !variety || !productName || !price || !quantity) {
            alert('Please fill in all required fields!');
            return;
        }

        const newEntry = { 
            name, 
            number, 
            address, 
            variety,
            productName,
            price,
            quantity,
            description,
            userId: user.id || user.email,
            userEmail: user.email 
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5172/producer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newEntry),
            });

            if (response.ok) {
                alert('Product added successfully!');
                setName('');
                setNumber('');
                setAddress('');
                setVariety('');
                setProductName('');
                setPrice('');
                setQuantity('');
                setDescription('');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to add entry.');
            }
        } catch (err) {
            console.error('Error adding producer:', err);
            alert('Failed to add entry.');
        }
    }


    return (
        <div>
            <Header />
            <div className="crop-container">
                <div className="add-crop">
                    <h2>Add Your Product</h2>
                    
                    <div className="form-grid">
                        <div className="form-row">
                            <input
                                type="text"
                                value={name}
                                placeholder="Producer Name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="number"
                                value={number}
                                placeholder="Contact Number"
                                onChange={(e) => setNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <input
                        type="text"
                        value={address}
                        placeholder="Farm Location/Address"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    
                    <div className="form-grid">
                        <div className="form-row">
                            <input
                                type="text"
                                value={productName}
                                placeholder="Product Name (e.g., Organic Rice)"
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <select
                                value={variety}
                                onChange={(e) => setVariety(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Rice">Rice</option>
                                <option value="Sugarcane">Sugarcane</option>
                                <option value="Paddy">Paddy</option>
                                <option value="Pulses">Pulses</option>
                                <option value="Sesame">Sesame</option>
                                <option value="Tubers">Tubers</option>
                                <option value="Groundnut">Groundnut</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Spices">Spices</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-grid">
                        <div className="form-row">
                            <input
                                type="number"
                                value={price}
                                placeholder="Price per kg (₹)"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="number"
                                value={quantity}
                                placeholder="Available Quantity (kg)"
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <textarea
                        value={description}
                        placeholder="Product Description (optional)"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    
                    <button onClick={handleAddToList}>Add Product to Our Store</button>
                </div>
            </div>

        </div>
    );
};

export default Producer;
