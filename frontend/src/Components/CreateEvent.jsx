import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSucess } from "../Utils";
import { ToastContainer } from "react-toastify";

 const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventname: "",
    description: "",
    date: "",
  });

  const navigate = useNavigate();
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/auth/createevent", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response)

      if (!response.ok) {
        // If the response is not successful (status 4xx or 5xx)
          
        return handleError(result.message || "An error .");
      }

      const result = await response.json();
      if (result.success) {
        handleSucess(result.message || "Event created successfully.");
        navigate("/home");
      } else {
        handleError(result.message || "Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      handleError("An error occurred while creating the event.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow rounded">
        <div className="mb-4">
          <label htmlFor="eventname" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            name="eventname"
            value={formData.eventname}
            onChange={handleChange}
            placeholder="Enter event name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Event
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default CreateEvent
