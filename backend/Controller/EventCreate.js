import { EventModel } from "../Models/event.js";




export const eventcreate= async (req,res)=>{
    try{
       const {eventname,description,date}=req.body
       const userid=req.user._id

       if (!userid) {
        return res.status(401).json({
            message: "Unauthorized. Please log in.",
            success: false,
        });
    }
     
            // check any field is empty or not
            if(!eventname || !description || !date){
                return res.status(400)
                .json({
                   message:"please fill all the fields "
                })
            }
         
             
           const newEvent=await EventModel.create({
               eventname,description,date,
               createdBy: userid, // Add the authenticated user's ID
           })
        //    console.log(newEvent)

        return res.status(201).json({
            message: "Event created successfully",
            success: true,
            event: newEvent ,
            
        });
   }catch (error) {
    console.log(error)
    return res.status(400)
    .json({message:"there is some problem on creating an event hiii",
        success: false
    })
}
}



export const getallEvent=async(req,res)=>{
    try {
         const event=await EventModel.find()

         if(!event){
            return res.status(404).json({
                message:"No one created the event yet",
            success:false
         })
        }

        return res.status(200).json({
            message:"fetch all the event",
            success:true,
            data:event
        })

        
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch event",
            success: false,
            error: error.message,
          });
    }

}

export const getmyevent=async(req,res)=>{
    try {
        const userid=req.user._id
        const event=await EventModel.find({createdBy:userid})

        if(!event){
           return res.status(404).json({
               message:"you not created the event yet",
           success:false
        })
       }
       

       return res.status(200).json({
           message:"fetch all your created event",
           success:true,
           data:event
       })

       
   } catch (error) {
       return res.status(500).json({
           message: "Failed to fetch your craeated event",
           success: false,
           error: error.message,
         });
   }
}

export const deleteEvent = async (req, res) => {
    try {
        const userId = req.user._id; // ID of the logged-in user from middleware
        const { eventId } = req.params; // Event ID from the request parameters

        // Find the event to ensure it exists and belongs to the user
        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found.",
                success: false,
            });
        }

        if (event.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this event.",
                success: false,
            });
        }

        // Delete the event
        await EventModel.findByIdAndDelete(eventId);

        return res.status(200).json({
            message: "Event deleted successfully.",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete the event.",
            success: false,
            error: error.message,
        });
    }
};



export const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params; // Event ID from the request params
        const userId = req.user._id; // Logged-in user's ID from middleware

        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
                success: false,
            });
        }

        // Check if the user has already joined the event
        if (event.attendees.includes(userId)) {
            return res.status(400).json({
                message: "You have already joined this event.",
                success: false,
            });
        }

        // Add the user to the attendees list
        event.attendees.push(userId);
        await event.save();

          // Emit the updated attendee count to WebSocket clients
          req.io.to(eventId).emit("updateAttendees", {
            eventId,
            attendeeCount: event.attendees.length,
        });


        return res.status(200).json({
            message: "Successfully joined the event",
            success: true,
            event,
            attendeeCount: event.attendees.length,
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to join the event",
            success: false,
            error: error.message,
            
        });
    }
};



export const leaveEvent = async (req, res) => {
    try {
        const { eventId } = req.params; // Event ID from the request params
        const userId = req.user._id; // Logged-in user's ID from middleware

        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
                success: false,
            });
        }

        // Check if the user has not joined the event
        if (!event.attendees.includes(userId)) {
            return res.status(400).json({
                message: "You are not part of this event.",
                success: false,
            });
        }

        // Remove the user from the attendees list
        event.attendees = event.attendees.filter(
            (attendeeId) => attendeeId.toString() !== userId.toString()
        );
        await event.save();
        

         // Emit the updated attendee count to WebSocket clients
         req.io.to(eventId).emit("updateAttendees", {
            eventId,
            attendeeCount: event.attendees.length,
        });


        return res.status(200).json({
            message: "Successfully left the event",
            success: true,
           
            attendeeCount: event.attendees.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to leave the event",
            success: false,
            error: error.message,
        });
    }
};
