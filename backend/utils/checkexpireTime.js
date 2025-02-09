import cron from "node-cron";
import { userModel } from "../Models/userModel.js";

export const checkexpireTime = () => {
    // Schedule a cron job to delete expired guest users every 30 seconds
    cron.schedule("*/30 * * * * *", async () => {
        try {
            const now = new Date();
            const result = await userModel.deleteMany({
                role: "Guest",
                expiresAt: { $lt: now },
            });

            if (result.deletedCount > 0) {
                console.log(`Deleted ${result.deletedCount} expired Guest users.`);
            } else {
                console.log("No expired Guest users found.");
            }
        } catch (error) {
            console.error("Error deleting expired Guest users:", error);
        }
    });

    console.log("Cron job initialized: Deleting expired guests every 30 seconds.");
};