import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    credit_score: "",
    age_group: "18-25",
    family_status: "Single",
    income: "",
    comments: "",
    consent: false,
  });

  const [leads, setLeads] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Consent is required to process data.");
      return;
    }
    try {
      const response = await axios.post("https://your-backend-url.com/score", formData);
      setLeads([response.data, ...leads]);
    } catch (err) {
      console.error(err);
      alert("Error submitting lead. Please check your input or try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>AI Lead Intent Scoring</h1>
      <form onSubmit={handleSubmit} className="lead-form">
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="credit_score"
          placeholder="Credit Score (300–850)"
          value={formData.credit_score}
          onChange={handleChange}
          required
        />
        <select name="age_group" value={formData.age_group} onChange={handleChange}>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="51+">51+</option>
        </select>
        <select name="family_status" value={formData.family_status} onChange={handleChange}>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Married with Kids">Married with Kids</option>
        </select>
        <input
          type="number"
          name="income"
          placeholder="Income (INR)"
          value={formData.income}
          onChange={handleChange}
          required
        />
        <textarea
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleChange}
        ></textarea>
        <label>
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
          />
          I consent to data processing
        </label>
        <button type="submit">Submit</button>
      </form>

      <h2>Scored Leads</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Initial Score</th>
            <th>Reranked Score</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index}>
              <td>{lead.email}</td>
              <td>{lead.initial_score}</td>
              <td>{lead.reranked_score}</td>
              <td>{lead.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
