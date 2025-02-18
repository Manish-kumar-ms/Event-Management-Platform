import React, { useState, useEffect } from "react";
import { handleError, handleSucess } from "../Utils";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const Home = () => {
    const [events, setEvents] = useState([]); // Stores fetched events
    const [attendees, setAttendees] = useState({}); // Tracks attendees count for each event
    const [activeTab, setActiveTab] = useState("all"); // Default tab is "all"
  
    const navigate = useNavigate();
  

  const fetchEvents = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:8000/auth/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem('token'),
          "Content-Type": "application/json",
        },
      });

      if(!response.ok){
        navigate("/login")
      }

      const result = await response.json();
      if (result.success) {
        setEvents(result.data); // Update the events state
         // Initialize attendee counts from the backend
         const attendeeCounts = {};
         result.data.forEach((event) => {
             attendeeCounts[event._id] = event.attendeeCount || 0; // Use attendeeCount from the backend
         });
         setAttendees(attendeeCounts);
      } else {
        handleError(result.message || "Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      handleError("An error occurred while fetching events.");
    }
  };


   // Join an event
   const handleJoinEvent = async (eventId) => {
    try {
        const response = await fetch(
            `http://localhost:8000/auth/joinEvent/${eventId}`,
            {
                method: "POST",
                headers: {
                    Authorization:  localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json();
        if (result.success) {
            handleSucess(result.message || "Successfully joined the event.");
            // Dynamically update attendee count
            setAttendees((prev) => ({
                ...prev,
                [eventId]: result.attendeeCount,
            }));

        } else {
            handleError(result.message || "Failed to join the event.");
        }
    } catch (error) {
        console.error("Error joining event:", error);
        handleError("An error occurred while joining the event.");
    }
};


  // Leave an event
  const handleLeaveEvent = async (eventId) => {
    try {
        const response = await fetch(
            `http://localhost:8000/auth/leaveEvent/${eventId}`,
            {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json();
        if (result.success) {
            handleSucess(result.message || "Successfully left the event.");
              // Dynamically update attendee count
              setAttendees((prev) => ({
                ...prev,
                [eventId]: result.attendeeCount,
            }));

        } else {
            handleError(result.message || "Failed to leave the event.");
        }
    } catch (error) {
        console.error("Error leaving event:", error);
        handleError("An error occurred while leaving the event.");
    }
};




  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/auth/deletemyEvent/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        handleSucess(result.message || "Event deleted successfully.");
        // Refresh the list of events after deletion
        fetchEvents(activeTab === "my" ? "getmyEvent" : "getallEvent");
      } else {
        handleError(result.message || "Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      handleError("An error occurred while deleting the event.");
    }
  };

    // Logout user
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        handleSucess("Logged out successfully.");
        navigate("/login");
      };

  useEffect(() => {
    // Fetch events when the active tab changes
    const endpoint = activeTab === "my" ? "getmyEvent" : "getallEvent";
    fetchEvents(endpoint);
  }, [activeTab]);

  return (
    <div className="container mx-auto p-4">
      {/* Sticky Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold text-center mb-4">Events Dashboard</h1>

       {/* Add Create Event Button */}
       <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/create-event")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Create Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-300"
          } rounded-l`}
          onClick={() => setActiveTab("all")}
        >
          Show All Events
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "my" ? "bg-blue-500 text-white" : "bg-gray-300"
          } rounded-r`}
          onClick={() => setActiveTab("my")}
        >
          Show My Events
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {events.length === 0 ? (
    <p className="text-center col-span-full">
      {activeTab === "my"
        ? "You have not created any events yet."
        : "No events available."}
    </p>
  ) : (
    events.map((event) => (
      <div
        key={event._id}
        className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
      >
        <h2 className="text-lg font-bold mb-2">{event.eventname}</h2>
        <p className="mb-2 text-sm">{event.description}</p>
        <p className="text-gray-500 text-sm">
          Date: {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm">
          Attendees: {attendees[event._id] || 0}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleJoinEvent(event._id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Join Event
          </button>
          <button
            onClick={() => handleLeaveEvent(event._id)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Leave Event
          </button>
          {activeTab === "my" && (
            <button
              onClick={() => handleDelete(event._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    ))
  )}
</div>

      <ToastContainer />
    </div>
  );
};







export default Home;
