import cron from "node-cron";
import mongoose from "mongoose";

import { Contest } from "../models/contest.model";
import { ContestSubmission } from "../models/contestSubmission.model";
import { User } from "../models/user.model";
import { PointsHistory } from "../models/points.model";
import { Notification } from "../models/notification.model";
import { Registration } from "../models/registration.model";

// Monday 8:00 AM
cron.schedule(
    "0 8 * * 1",
    async () => {
        const contests = await Contest.find({
            status: "ended",
            rewardDistributed: false,
            rewardDistributionTime: {
                $lte: new Date()
            }
        });

        if (contests.length === 0) {
            return;
        }

        for (const contest of contests) {
            const session = await mongoose.startSession();

            try {
                session.startTransaction();

                const leaderboard = await ContestSubmission.find({
                    contest: contest._id,
                    status: "accepted"
                })
                    .populate(
                        "participant",
                        "username profilePicture totalPoints experiencePoints"
                    )
                    .sort({
                        xp: -1,
                        acceptedAt: 1
                    })
                    .session(session);

                const winnerSnapshots = [];

                const rewardMultipliers = [
                    contest.rewardMultiplier.first,
                    contest.rewardMultiplier.second,
                    contest.rewardMultiplier.third
                ];

                for (let i = 0; i < leaderboard.length; i++) {
                    const submission = leaderboard[i];

                    const participant: any =
                        submission.participant;

                    let rewardPoints = 0;

                    if (i < 3) {
                        rewardPoints =
                            contest.participantEntryCost *
                            rewardMultipliers[i];

                        submission.points = rewardPoints;

                        await submission.save({
                            session
                        });

                        participant.totalPoints +=
                            rewardPoints;

                        winnerSnapshots.push({
                            user: participant._id,
                            username:
                                participant.username,
                            profilePicture:
                                participant.profilePicture,
                            rank:
                                (i + 1) as
                                | 1
                                | 2
                                | 3,
                            rewardPoints,
                            submittedAt:
                                submission.acceptedAt!
                        });
                    }

                    participant.experiencePoints +=
                        submission.xp;

                    await participant.save({
                        session
                    });
                }

                contest.winners = winnerSnapshots;

                contest.rewardDistributed = true;

                await contest.save({
                    session
                });

                const creator = await User.findById(
                    contest.createdBy
                ).session(session);

                const pointHistory: any[] = [];
                if (
                    creator &&
                    contest.totalParticipants >= contest.minimumParticipants
                ) {
                    creator.totalPoints += contest.creatorReward;

                    await creator.save({ session });

                    pointHistory.push({
                        user: creator._id,
                        type: "contest",
                        points: contest.creatorReward,
                        reason: "Contest Creator Reward",
                        metadata: {
                            contestId: contest._id
                        }
                    });
                }

                winnerSnapshots.forEach((winner) => {
                    pointHistory.push({
                        user: winner.user,
                        type: "contest",
                        points: winner.rewardPoints,
                        reason: `Contest Rank #${winner.rank} Reward`,
                        metadata: {
                            contestId: contest._id
                        }
                    });
                });

                if (pointHistory.length > 0) {
                    await PointsHistory.insertMany(
                        pointHistory,
                        {
                            session
                        }
                    );
                }

                const registrations = await Registration.find({
                    contest: contest._id,
                    status: {
                        $in: [
                            "completed",
                            "ended",
                            "disqualified"
                        ]
                    }
                })
                    .select("participant")
                    .session(session);

                const notifications = registrations.map(
                    (registration) => ({
                        recipient:
                            registration.participant,
                        title:
                            "Contest Results Announced",
                        message: `The results for "${contest.title}" have been announced. Check the leaderboard to see the final rankings.`,
                        type: "contest",
                        metadata: {
                            contestId: contest._id
                        }
                    })
                );

                if (creator) {
                    notifications.push({
                        recipient: creator._id,
                        title:
                            "Contest Rewards Distributed",
                        message: `The rewards for your contest "${contest.title}" have been distributed successfully.`,
                        type: "contest",
                        metadata: {
                            contestId: contest._id
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
                    `[Contest Reward Cron] Failed for contest "${contest.title}":`,
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
