import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import '../styles/products.css';
import '../styles/common.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setErrorMsg('Failed to fetch product details.');
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        {errorMsg && <div className="alert-error">{errorMsg}</div>}
        {product ? (
          <div className="product-detail-card">
            <h2>Product Details</h2>
            {product.image && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={`${import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_DEV || 'http://localhost:5000').replace('/api', '') : (import.meta.env.VITE_API_BASE_PROD || '').replace('/api', '')}/uploads/${product.image}`}
                  alt={product.name}
                  className="product-detail-img"
                />
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Name: </span>
              {product.name}
            </div>
            <div className="detail-row">
              <span className="detail-label">Description: </span>
              {product.description}
            </div>
            <div className="detail-row">
              <span className="detail-label">Price: </span>
              NPR {Number(product.price).toFixed(2)}
            </div>
            <div className="detail-row">
              <span className="detail-label">Quantity: </span>
              {product.quantity}
            </div>
            <div className="detail-row">
              <span className="detail-label">Supplier Name: </span>
              {product.Supplier ? product.Supplier.name : 'N/A'}
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link to="/products" className="btn-secondary">
                Back to Products
              </Link>
            </div>
          </div>
        ) : (
          !errorMsg && <p>Loading product details...</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
