import React, { useState, useEffect } from 'react';
import axios from './axios';
import '../style/CampaignBuilder.css'; // Import your CSS

const CampaignBuilder = () => {
  const [selectedLeads, setSelectedLeads] = useState([]); // Track selected leads
  const [subject, setSubject] = useState(''); // Track subject
  const [body, setBody] = useState(''); // Track email body
  const [campaigns, setCampaigns] = useState([]); // Track campaigns
  const [editIndex, setEditIndex] = useState(null); // Track which campaign is being edited
  const [newLead, setNewLead] = useState({ name: '', email: '' }); // For adding a new lead
  const [leads, setLeads] = useState([]); // Tracks all leads

  // Fetch campaigns and leads on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignResponse = await axios.get('/getCampaigns');
        setCampaigns(campaignResponse.data); // Set campaigns from backend
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    const fetchLeads = async () => {
      try {
        const leadsResponse = await axios.get('/getLeademail'); // Assuming this endpoint provides the leads
        setLeads(leadsResponse.data); // Set leads from backend
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchCampaigns();
    fetchLeads();
  }, []);

  // Add a new lead (Gmail) to the list
  const handleAddLead = async () => {
    if (newLead.name && newLead.email) {
      const newLeadObj = { name: newLead.name, email: newLead.email };

      try {
        // Send the new lead to the backend
        await axios.post('/createLeademail', newLeadObj);
        setLeads([...leads, newLeadObj]); // Add to state
        setNewLead({ name: '', email: '' }); // Clear the input fields
        alert('✅ New Gmail recipient added!');
      } catch (error) {
        console.error('Error adding new lead:', error);
        alert('❌ Failed to add new lead!');
      }
    } else {
      alert('❌ Please fill in both name and email!');
    }
  };

  // Handle selecting or unselecting leads
  const handleCheckboxChange = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  // Submit form to create or update a campaign
  const handleSubmit = async () => {
    const newCampaign = {
      subject,
      body,
      recipients: selectedLeads.map((id) => leads.find((lead) => lead.id === id)?.email),
    };

    try {
      if (editIndex !== null) {
        // Update existing campaign
        await axios.put(`/updateCampaign/${campaigns[editIndex]._id}`, newCampaign);

        alert('✅ Campaign updated successfully!');
      } else {
        // Create new campaign
        await axios.post('/createCampaign', newCampaign);
        alert('✅ New campaign created!');
      }

      // Fetch updated campaigns after submitting
      const campaignResponse = await axios.get('/getCampaigns');
      setCampaigns(campaignResponse.data); // Update the campaign list
      resetForm();
    } catch (error) {
      console.error('Error submitting campaign:', error);
      alert('❌ Failed to submit campaign!');
    }
  };

  // Reset form inputs
  const resetForm = () => {
    setSelectedLeads([]);
    setSubject('');
    setBody('');
    setEditIndex(null);
  };

  // Edit an existing campaign
  const handleEdit = (index) => {
    const campaign = campaigns[index];
    setSubject(campaign.subject);
    setBody(campaign.body);
    setSelectedLeads(campaign.recipients.map((email) => leads.find((lead) => lead.email === email)?.id));
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const campaignId = campaigns[index]._id;
      await axios.delete(`/deleteCampaign/${campaignId}`); // Corrected to use _id
      const updatedCampaigns = campaigns.filter((_, i) => i !== index);
      setCampaigns(updatedCampaigns);
      if (editIndex === index) resetForm();
      alert('✅ Campaign deleted!');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('❌ Failed to delete campaign!');
    }
  };
  

  return (
    <div className="cam-card">
      <h2 className="cam-title">📧 Campaign Builder</h2>

      {/* Form for creating or updating campaigns */}
      <div className="cam-form-group">
        <label>Subject</label>
        <input
          className="cam-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>

      <div className="cam-form-group">
        <label>Body</label>
        <textarea
          className="cam-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your email content..."
        />
      </div>

      {/* Recipient selection (checkboxes for each lead) */}
      <div className="cam-form-group">
        <label>Select Recipients</label>
        {leads.map((lead) => (
          <div key={lead.id} className="cam-checkbox">
            <input
              type="checkbox"
              checked={selectedLeads.includes(lead.id)}
              onChange={() => handleCheckboxChange(lead.id)}
            />
            {lead.name} ({lead.email})
          </div>
        ))}
      </div>

      {/* New lead form to add Gmail recipient */}
      <div className="cam-form-group">
        <label>Add New Gmail Recipient</label>
        <input
          className="cam-input"
          type="text"
          placeholder="Name"
          value={newLead.name}
          onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
        />
        <input
          className="cam-input"
          type="email"
          placeholder="Email"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
        />
        <button className="cam-button" onClick={handleAddLead}>Add Gmail</button>
      </div>

      {/* Submit button */}
      <button className="cam-button" onClick={handleSubmit}>
        {editIndex !== null ? 'Update Campaign' : 'Create Campaign'}
      </button>

      {/* Display saved campaigns */}
      {campaigns.length > 0 && (
        <div className="cam-campaigns">
          <h3>📋 Saved Campaigns</h3>
          <ul className="cam-campaign-list">
            {campaigns.map((c, index) => (
              <li key={index} className="cam-campaign-item">
                <strong>Subject:</strong> {c.subject} <br />
                <strong>Recipients:</strong>{' '}
                {c.recipients.join(', ')}
                <br />
                {/* Edit and Delete buttons */}
                <button className="cam-btn-edit" onClick={() => handleEdit(index)}>✏️ Edit</button>
                <button className="cam-btn-delete" onClick={() => handleDelete(index)}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilder;
