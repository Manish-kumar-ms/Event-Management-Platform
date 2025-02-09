import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true,
    },
    description: {
        type: String, // Fix the typo here
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User
        ref: "userModel",
        required: true,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId, // References the IDs of users who joined the event
            ref: "userModel",
        },
    ],
});

export const EventModel = mongoose.model("EventModel", EventSchema);