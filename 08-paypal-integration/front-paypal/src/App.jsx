import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-payment');
      const approvalUrl = response.data.approval_url;
      window.location.href = approvalUrl; // Redirige a la URL de aprobación de PayPal
    } catch (error) {
      setMessage('Error creating payment');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PayPal Payment Integration</h1>
        <button onClick={handlePayment}>Create Payment</button>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
