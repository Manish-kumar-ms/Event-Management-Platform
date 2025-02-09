export const setupSocket = (io) => {
    const eventAttendees = {};

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("joinEvent", ({ eventId, userId }) => {
            if (!eventAttendees[eventId]) {
                eventAttendees[eventId] = new Set();
            }
            eventAttendees[eventId].add(userId);

            socket.join(eventId);
            io.to(eventId).emit("updateAttendees", {
                eventId,
                attendeeCount: eventAttendees[eventId].size,
            });
        });

        socket.on("leaveEvent", ({ eventId, userId }) => {
            if (eventAttendees[eventId]) {
                eventAttendees[eventId].delete(userId);
                io.to(eventId).emit("updateAttendees", {
                    eventId,
                    attendeeCount: eventAttendees[eventId].size,
                });
                socket.leave(eventId);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
