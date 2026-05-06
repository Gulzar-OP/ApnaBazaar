import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

  // ✅ Proper redirect logic
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
        body: data   // ✅ FIXED
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
    <div style={container}>
      <h2 style={{ color: '#f97316' }}>Add Product</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input type="text" placeholder="Name" required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
        />

        <textarea placeholder="Description" required
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={inputStyle}
        />

        <input type="number" placeholder="Price" required
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />

        <input type="text" placeholder="Category" required
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={inputStyle}
        />

        <input type="number" placeholder="Stock" required
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          style={inputStyle}
        />

        <input type="file" accept="image/*" required
          onChange={(e) => setImage(e.target.files[0])}
          style={{ color: '#fff' }}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

const container = {
  maxWidth: '500px',
  margin: '40px auto',
  padding: '20px',
  background: '#111',
  color: '#fff'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const inputStyle = {
  padding: '10px',
  background: '#000',
  color: '#fff'
};

export default AddProduct;