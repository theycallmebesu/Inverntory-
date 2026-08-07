import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import '../styles/products.css';
import '../styles/common.css';

const ProductForm = () => {
  const { id } = useParams(); // If id exists, Edit mode; else Add mode
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get('/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        setErrorMsg('Failed to load suppliers list.');
      }
    };

    fetchSuppliers();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await axiosInstance.get(`/products/${id}`);
          const prod = response.data;
          setName(prod.name);
          setDescription(prod.description);
          setPrice(prod.price);
          setQuantity(prod.quantity);
          setSupplierId(prod.supplierId);
          setCurrentImage(prod.image);
        } catch (error) {
          setErrorMsg('Failed to load product details.');
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations:
    // Name required, description required, price >= 0, quantity >= 0, supplier required
    if (!name.trim()) {
      setErrorMsg('Product Name is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Description is required.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setErrorMsg('Price cannot be negative.');
      return;
    }
    if (quantity === '' || Number(quantity) < 0) {
      setErrorMsg('Quantity cannot be negative.');
      return;
    }
    if (!supplierId) {
      setErrorMsg('Supplier must be selected.');
      return;
    }
    // Image is required when creating a new product
    if (!isEdit && !imageFile) {
      setErrorMsg('Product image is required for new products.');
      return;
    }

    try {
      let imageName = currentImage;

      // Handle image upload using multipart/form-data if a new file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await axiosInstance.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageName = uploadRes.data.filename;
      }

      const productPayload = {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        supplierId: parseInt(supplierId, 10),
        image: imageName
      };

      if (isEdit) {
        await axiosInstance.put(`/products/${id}`, productPayload);
        setSuccessMsg('Product updated successfully.');
      } else {
        await axiosInstance.post('/products', productPayload);
        setSuccessMsg('Product added successfully.');
      }

      setTimeout(() => {
        navigate('/products');
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(isEdit ? 'Failed to update product.' : 'Failed to add product.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="product-form-container">
          <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>

          {errorMsg && <div className="alert-error">{errorMsg}</div>}
          {successMsg && <div className="alert-success">{successMsg}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label>Price (NPR) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Supplier *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>

            {isEdit && currentImage && (
              <div className="form-group">
                <label>Current Image:</label>
                <div>
                  <img
                    src={`http://localhost:5000/uploads/${currentImage}`}
                    alt="Current product"
                    className="product-thumb"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>{isEdit ? 'Replace Image (Optional)' : 'Product Image *'}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save
              </button>
              <Link to="/products" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
