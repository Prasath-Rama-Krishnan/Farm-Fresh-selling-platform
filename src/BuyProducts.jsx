import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Consumer.css';
import API_BASE_URL from './config/api.js';
import { useAuth } from './context/AuthContext';

const BuyProducts = () => {
    const { user } = useAuth();
    const [todoList, setTodoList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Fetch the producer list for current user only
    useEffect(() => {
        if (user) {
            const userId = user.id || user.email;
            const token = localStorage.getItem('authToken');
            fetch(`${API_BASE_URL}/getproducer/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then((res) => res.json())
                .then((data) => setTodoList(data))
                .catch((err) => console.error('Error fetching producers:', err));
        }
    }, [user]);

    async function handleDelete(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/producer/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Product removed successfully!');
                setTodoList((prevList) => prevList.filter((item) => item._id !== id));
            } else {
                alert('Failed to remove product.');
            }
        } catch (err) {
            console.error('Error deleting producer:', err);
            alert('Failed to remove product.');
        }
    }

    function handleEdit(item) {
        setEditingId(item._id);
        setEditForm({
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            description: item.description
        });
    }

    async function handleSaveEdit(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/producer/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                alert('Product updated successfully!');
                setEditingId(null);
                setEditForm({});
                
                // Refresh the list
                const userId = user.id || user.email;
                fetch(`${API_BASE_URL}/getproducer/${userId}`)
                    .then((res) => res.json())
                    .then((data) => setTodoList(data))
                    .catch((err) => console.error('Error fetching producers:', err));
            } else {
                alert('Failed to update product.');
            }
        } catch (err) {
            console.error('Error updating product:', err);
            alert('Failed to update product.');
        }
    }

    return (
        <div>
            <Header />
            <div className="todo-list">
                <h3>My Products</h3>
                <p style={{textAlign: 'center', color: '#666', marginBottom: '30px'}}>
                    Manage and edit your products here
                </p>
                {todoList.length > 0 ? (
                    <div className="todo-container">
                        {todoList.map((item) => (
                            <div key={item._id} style={{ marginBottom: '10px' }} className="items">
                                {editingId === item._id ? (
                                    <div className="edit-form">
                                        <input
                                            type="text"
                                            value={editForm.productName || ''}
                                            placeholder="Product Name"
                                            onChange={(e) => setEditForm({...editForm, productName: e.target.value})}
                                            style={{width: '100%', margin: '5px 0', padding: '8px', borderRadius: '8px', border: '1px solid #ddd'}}
                                        />
                                        <input
                                            type="number"
                                            value={editForm.price || ''}
                                            placeholder="Price"
                                            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                            style={{width: '100%', margin: '5px 0', padding: '8px', borderRadius: '8px', border: '1px solid #ddd'}}
                                        />
                                        <input
                                            type="number"
                                            value={editForm.quantity || ''}
                                            placeholder="Quantity"
                                            onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                                            style={{width: '100%', margin: '5px 0', padding: '8px', borderRadius: '8px', border: '1px solid #ddd'}}
                                        />
                                        <textarea
                                            value={editForm.description || ''}
                                            placeholder="Description"
                                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                            style={{width: '100%', margin: '5px 0', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', height: '60px'}}
                                        />
                                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                            <button
                                                onClick={() => handleSaveEdit(item._id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    flex: 1
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    flex: 1
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{textAlign: 'center', marginBottom: '15px'}}>
                                            <h4 style={{color: '#2c7873', margin: '0 0 5px 0', fontSize: '1.2em'}}>
                                                {item.productName || item.variety}
                                            </h4>
                                            {item.price && (
                                                <div style={{color: '#4a9d96', fontWeight: 'bold', fontSize: '1.1em'}}>
                                                    ₹{item.price}/kg
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p>
                                            <span>Producer:</span> {item.name} <br />
                                            <span>Contact:</span> {item.number} <br />
                                            <span>Location:</span> {item.address} <br />
                                            <span>Category:</span> {item.variety} <br />
                                            {item.quantity && (
                                                <><span>Available:</span> {item.quantity} kg <br /></>
                                            )}
                                            {item.description && (
                                                <><span>Description:</span> {item.description} <br /></>
                                            )}
                                        </p>
                                        
                                        <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    flex: 1
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    flex: 1
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                        <p style={{fontSize: '1.2em'}}>No products added yet.</p>
                        <p>Go to the Producer page to add your first product!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyProducts;
