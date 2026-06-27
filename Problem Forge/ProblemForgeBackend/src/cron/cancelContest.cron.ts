import cron from "node-cron";
import mongoose from "mongoose";

import { Contest } from "../models/contest.model";
import { Registration } from "../models/registration.model";
import { User } from "../models/user.model";
import { PointsHistory } from "../models/points.model";
import { Notification } from "../models/notification.model";

// Friday 7:46 AM
cron.schedule(
    "46 7 * * 5",
    async () => {
        const contests = await Contest.find({
            status: "upcoming"
        });

        if (contests.length === 0) {
            return;
        }

        for (const contest of contests) {
            if (
                contest.totalParticipants >=
                contest.minimumParticipants
            ) {
                continue;
            }

            const session = await mongoose.startSession();

            try {
                session.startTransaction();

                contest.status = "cancelled";
                contest.cancelReason =
                    "Contest automatically cancelled because the minimum participant requirement was not met.";

                await contest.save({
                    session
                });

                const registrations =
                    await Registration.find({
                        contest: contest._id,
                        status: "registered"
                    }).session(session);

                if (registrations.length > 0) {
                    const bulkRefunds =
                        registrations.map(
                            (registration) => ({
                                updateOne: {
                                    filter: {
                                        _id: registration.participant
                                    },
                                    update: {
                                        $inc: {
                                            totalPoints:
                                                contest.participantEntryCost
                                        }
                                    }
                                }
                            })
                        );

                    await User.bulkWrite(
                        bulkRefunds,
                        {
                            session
                        }
                    );

                    const participantHistory =
                        registrations.map(
                            (registration) => ({
                                user: registration.participant,
                                type: "contest",
                                points:
                                    contest.participantEntryCost,
                                reason:
                                    "Contest Automatically Cancelled Refund",
                                metadata: {
                                    contestId:
                                        contest._id
                                }
                            })
                        );

                    await PointsHistory.insertMany(
                        participantHistory,
                        {
                            session
                        }
                    );

                    await Registration.updateMany(
                        {
                            contest: contest._id,
                            status: "registered"
                        },
                        {
                            $set: {
                                status: "cancelled"
                            }
                        },
                        {
                            session
                        }
                    );
                }
                const creator = await User.findById(
                    contest.createdBy
                ).session(session);

                if (creator) {
                    creator.totalPoints +=
                        contest.creatorEntryCost;

                    await creator.save({
                        session
                    });

                    await PointsHistory.create(
                        [
                            {
                                user: creator._id,
                                type: "contest",
                                points:
                                    contest.creatorEntryCost,
                                reason:
                                    "Contest Automatically Cancelled Refund",
                                metadata: {
                                    contestId:
                                        contest._id
                                }
                            }
                        ],
                        {
                            session
                        }
                    );
                }

                const notifications =
                    registrations.map(
                        (registration) => ({
                            recipient:
                                registration.participant,
                            title:
                                "Contest Cancelled",
                            message: `The contest "${contest.title}" has been automatically cancelled because the minimum participant requirement was not met. Your ${contest.participantEntryCost} points have been refunded.`,
                            type: "contest",
                            metadata: {
                                contestId:
                                    contest._id
                            }
                        })
                    );

                if (creator) {
                    notifications.push({
                        recipient: creator._id,
                        title:
                            "Contest Automatically Cancelled",
                        message: `Your contest "${contest.title}" was automatically cancelled because it did not reach the minimum number of participants. Your ${contest.creatorEntryCost} points have been refunded.`,
                        type: "contest",
                        metadata: {
                            contestId:
                                contest._id
                        }
                    });
                }

                if (notifications.length > 0) {
                    await Notification.insertMany(
                        notifications,
                        {
                            session
                        }
                    );
                }

                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();

                console.error(
                    `[Contest Auto Cancel Cron] Failed to cancel "${contest.title}":`,
                    error
                );
            } finally {
                session.endSession();
            }
        }
    },
    {
        timezone: "Asia/Kolkata"
    }

);