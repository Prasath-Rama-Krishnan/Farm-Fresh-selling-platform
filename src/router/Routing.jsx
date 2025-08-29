
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from "../App.jsx";
import Login from "../Auth/Login.jsx";
import Register from "../Auth/Register.jsx";
import SetPassword from "../Auth/SetPassword.jsx";
import Contact from "../Contact.jsx"
import Producer from '../Producer.jsx';
import Consumer from '../Consumer.jsx';
import Products from '../Products.jsx';
import BuyProducts from '../BuyProducts.jsx';
import About from '../About.jsx';
import Instruction from '../Instruction.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
function Routing() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/set-password" element={<SetPassword/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/producer" element={
          <ProtectedRoute requireAuth={true}>
            <Producer/>
          </ProtectedRoute>
        } />
        <Route path="/consumer" element={
          <ProtectedRoute requireAuth={true}>
            <Consumer/>
          </ProtectedRoute>
        } />
        <Route path="/products" element={<Products/>} />
        <Route path="/buy-products" element={
          <ProtectedRoute requireAuth={true}>
            <BuyProducts/>
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About/>} />
        <Route path='/instruction' element={<Instruction/>}/>
      </Routes>
    </Router>
  );
}
export default Routing;