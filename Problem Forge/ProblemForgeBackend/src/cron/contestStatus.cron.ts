import cron from "node-cron";

import { Contest } from "../models/contest.model";
import { Registration } from "../models/registration.model";

// Friday 8:00 AM
cron.schedule(
    "0 8 * * 5",
    async () => {
        try {
            const contests = await Contest.find({
                status: "upcoming",
                startTime: {
                    $lte: new Date()
                }
            }).select("_id");


            if (contests.length === 0) {
                return;
            }

            const contestIds = contests.map(
                contest => contest._id
            );

            const contestResult = await Contest.updateMany(
                {
                    _id: {
                        $in: contestIds
                    }
                },
                {
                    $set: {
                        status: "running"
                    }
                }
            );

            await Registration.updateMany(
                {
                    contest: {
                        $in: contestIds
                    },
                    status: "registered"
                },
                {
                    $set: {
                        status: "running"
                    }
                }
            );

            console.log(
                `[Contest Cron] ${contestResult.modifiedCount} contest(s) started.`
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

// Monday 12:00 AM
cron.schedule(
    "0 0 * * 1",
    async () => {
        try {
            const contests = await Contest.find({
                status: "running",
                endTime: {
                    $lte: new Date()
                }
            }).select("_id");


            if (contests.length === 0) {
                return;
            }

            const contestIds = contests.map(
                contest => contest._id
            );

            const contestResult = await Contest.updateMany(
                {
                    _id: {
                        $in: contestIds
                    }
                },
                {
                    $set: {
                        status: "ended"
                    }
                }
            );

            await Registration.updateMany(
                {
                    contest: {
                        $in: contestIds
                    },
                    status: {
                        $nin: [
                            "completed",
                            "disqualified",
                            "cancelled",
                            "ended"
                        ]
                    }
                },
                {
                    $set: {
                        status: "ended"
                    }
                }
            );

            console.log(
                `[Contest Cron] ${contestResult.modifiedCount} contest(s) ended.`
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

