import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import '../styles/suppliers.css';
import '../styles/common.css';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSuppliers = async () => {
    try {
      const response = await axiosInstance.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      setErrorMsg('Failed to fetch suppliers.');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete supplier "${name}"?`);
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/suppliers/${id}`);
      setSuccessMsg(`Supplier "${name}" deleted successfully.`);
      setSuppliers(suppliers.filter((s) => s.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg('Failed to delete supplier.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="suppliers-header">
          <h2>Supplier List</h2>
          <Link to="/suppliers/add" className="btn-primary">
            + Add Supplier
          </Link>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert-success">{successMsg}</div>}

        <table className="supplier-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>
                    <Link to={`/suppliers/edit/${supplier.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(supplier.id, supplier.name)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;
