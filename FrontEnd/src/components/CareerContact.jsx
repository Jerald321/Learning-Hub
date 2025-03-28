


import React, { useState } from "react";
import axios from "axios";
import "../style/CareerContact.css";

const CareerContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    learningDomain: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.learningDomain) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/contact", formData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to submit form.");
    }
  };

  return (
    <div className="contact-page">
      <div className="form-container">
        <div className="image-content">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.-ZoOM1nW7Nhk50ZyRnBk_wHaE8&pid=Api&P=0&h=220"
            alt="Customer Support"
            className="content-image"
          />
        </div>
        <div className="g-form-content">
          <h2>Contact Us</h2>
          <form className="google-form" onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" name="name" className="g-from" placeholder="Enter your name" onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" className="g-from" placeholder="Enter your email" onChange={handleChange} required />

            <label>Phone Number:</label>
            <input type="tel" name="phone" className="g-from" placeholder="Enter your number" onChange={handleChange} required />

            <label>Filter by</label>
            <select name="learningDomain" className="g-select" onChange={handleChange} required>
              <option value="">Select Learning Domain</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Business Analyst">Business Analyst</option>
              <option value="Finance">Finance</option>
            </select>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="content-container">
        <div className="text-content">
          <h2>Contact Us</h2>
          <p>Let’s Connect,</p>
          <p>Have any questions? Feel free to reach out!</p>
          <p>📍 Headquarters: Bangalore, Karnataka</p>
          <p>📞 Phone: 09363352660</p>
          <p>📧 Email: harikrishg44@gmail.com</p>
          <p>🌐 Mackinlay Learning Hub.Com</p>
        </div>
      </div>
    </div>
  );
};

export default CareerContact;

