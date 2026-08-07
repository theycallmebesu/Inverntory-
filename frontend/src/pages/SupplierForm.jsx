import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import '../styles/suppliers.css';
import '../styles/common.css';

const SupplierForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchSupplier = async () => {
        try {
          const response = await axiosInstance.get(`/suppliers/${id}`);
          const supplier = response.data;
          setName(supplier.name);
          setEmail(supplier.email);
          setPhone(supplier.phone);
        } catch (error) {
          setErrorMsg('Failed to load supplier details.');
        }
      };
      fetchSupplier();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations: Name required, Email required, Phone required
    if (!name.trim()) {
      setErrorMsg('Supplier Name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone number is required.');
      return;
    }

    try {
      const payload = { name, email, phone };

      if (isEdit) {
        await axiosInstance.put(`/suppliers/${id}`, payload);
        setSuccessMsg('Supplier updated successfully.');
      } else {
        await axiosInstance.post('/suppliers', payload);
        setSuccessMsg('Supplier added successfully.');
      }

      setTimeout(() => {
        navigate('/suppliers');
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(isEdit ? 'Failed to update supplier.' : 'Failed to add supplier.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="supplier-form-container">
          <h2>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h2>

          {errorMsg && <div className="alert-error">{errorMsg}</div>}
          {successMsg && <div className="alert-success">{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save
              </button>
              <Link to="/suppliers" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;
