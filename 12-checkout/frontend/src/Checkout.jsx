import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receipt, setReceipt] = useState(null);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleReceiptChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('receipt', receipt);

    try {
      const response = await axios.post('http://localhost:5000/upload-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Payment receipt uploaded successfully!');
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Error uploading receipt. Please try again.');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="sinpe-mobile"
              checked={paymentMethod === 'sinpe-mobile'}
              onChange={handlePaymentMethodChange}
            />
            Sinpe Móvil
          </label>
          <label>
            <input
              type="radio"
              value="bank-transfer"
              checked={paymentMethod === 'bank-transfer'}
              onChange={handlePaymentMethodChange}
            />
            Transferencia Bancaria
          </label>
        </div>
        <div>
          <label>
            Subir Comprobante de Pago:
            <input type="file" onChange={handleReceiptChange} />
          </label>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Checkout;