import cron from "node-cron";

import { Contest } from "../models/contest.model";

cron.schedule(
    "0 8 * * 5",
    async () => {
        try {
            await Contest.updateMany(
                {
                    status: "upcoming",
                    startTime: {
                        $lte: new Date()
                    }
                },
                {
                    $set: {
                        status: "running"
                    }
                }
            );
        } catch (error) {
            console.error(
                "[Contest Cron] Failed to start contests:",
                error
            );
        }
    },
    {
        timezone: "Asia/Kolkata"
    }
);

// Sunday 11:59 PM
cron.schedule(
    "59 23 * * 0",
    async () => {
        try {
            await Contest.updateMany(
                {
                    status: "running",
                    endTime: {
                        $lte: new Date()
                    }
                },
                {
                    $set: {
                        status: "ended"
                    }
                }
            );
        } catch (error) {
            console.error(
                "[Contest Cron] Failed to end contests:",
                error
            );
        }
    },
    {
        timezone: "Asia/Kolkata"
    }
);

console.log("Contest status cron initialized.");