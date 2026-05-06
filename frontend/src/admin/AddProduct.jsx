import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/addProduct.css'

const API_URL = import.meta.env.VITE_BACKEND_URL;

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert('Please select an image');

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        credentials: 'include',
        body: data
      });

      const responseData = await res.json();

      if (res.ok) {
        alert('✅ Product created successfully!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <div className="add-product-header">
          <p className="add-product-subtitle">Admin Panel</p>
          <h2 className="add-product-title">Add Product</h2>
          <p className="add-product-text">Fill product details and upload image</p>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Name"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />

            <input
              type="text"
              placeholder="Category"
              required
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
            />
          </div>

          <textarea
            placeholder="Description"
            required
            rows="5"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
          />

          <div className="form-row">
            <input
              type="number"
              placeholder="Price"
              required
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-input"
            />

            <input
              type="number"
              placeholder="Stock"
              required
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="file-upload-box">
            <label className="file-upload-label">Product Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Uploading...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;