import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import '../styles/products.css';
import '../styles/common.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [modifiedQuantities, setModifiedQuantities] = useState({});

  const fetchProductsAndSuppliers = async () => {
    try {
      const [prodRes, suppRes] = await Promise.all([
        axiosInstance.get('/products'),
        axiosInstance.get('/suppliers')
      ]);
      setProducts(prodRes.data);
      setSuppliers(suppRes.data);
    } catch (error) {
      setErrorMsg('Failed to load products or suppliers.');
    }
  };

  useEffect(() => {
    fetchProductsAndSuppliers();
  }, []);

  const handleDelete = async (id, name) => {
    // Confirmation dialog requirement
    const confirmDelete = window.confirm(`Are you sure you want to delete this product?`);
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      setSuccessMsg(`Product "${name}" deleted successfully.`);
      setProducts(products.filter((p) => p.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg('Failed to delete product.');
    }
  };

  const handleQuantityChange = (id, delta) => {
    setModifiedQuantities(prev => {
      const product = products.find(p => p.id === id);
      if (!product) return prev;
      const currentVal = prev[id] !== undefined ? prev[id] : product.quantity;
      const newVal = Math.max(0, currentVal + delta);
      return { ...prev, [id]: newVal };
    });
  };

  const handleUpdateQuantity = async (id) => {
    const newQuantity = modifiedQuantities[id];
    if (newQuantity === undefined) return;
    try {
      const response = await axiosInstance.patch(`/products/${id}/quantity`, { quantity: newQuantity });
      setProducts(products.map(p => p.id === id ? { ...p, quantity: newQuantity } : p));
      setModifiedQuantities(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setSuccessMsg('Quantity updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg('Failed to update quantity.');
    }
  };

  // Filter products by search name and selected supplier dropdown
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = selectedSupplier === '' || String(product.supplierId) === String(selectedSupplier);
    return matchesSearch && matchesSupplier;
  });

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="products-header">
          <h2>Product List</h2>
          <Link to="/products/add" className="btn-primary">
            + Add Product
          </Link>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert-success">{successMsg}</div>}

        <div className="filters-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="supplier-filter"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price (NPR)</th>
              <th>Quantity</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                // Low stock alert: If quantity < 5, light red background
                const isLowStock = product.quantity < 5;
                return (
                  <tr key={product.id} className={isLowStock ? 'low-stock-row' : ''}>
                    <td>
                      {product.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                          className="product-thumb"
                        />
                      ) : (
                        <span className="no-image">No img</span>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>NPR {Number(product.price).toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => handleQuantityChange(product.id, -1)}
                          style={{ padding: '2px 8px', cursor: 'pointer' }}
                        >-</button>
                        <span>{modifiedQuantities[product.id] !== undefined ? modifiedQuantities[product.id] : product.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(product.id, 1)}
                          style={{ padding: '2px 8px', cursor: 'pointer' }}
                        >+</button>
                        {isLowStock && <strong style={{ color: '#dc2626' }}>(Low Stock)</strong>}
                        
                        {modifiedQuantities[product.id] !== undefined && modifiedQuantities[product.id] !== product.quantity && (
                          <button 
                            onClick={() => handleUpdateQuantity(product.id)}
                            style={{ padding: '2px 8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{product.Supplier ? product.Supplier.name : 'N/A'}</td>
                    <td>
                      <Link to={`/products/view/${product.id}`} className="btn-view">
                        View
                      </Link>
                      <Link to={`/products/edit/${product.id}`} className="btn-edit">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
