import { Activity } from "../models/activity.models";

export const recordActivity = async (userId, action, req) => {
  try {
    await Activity.create({
      user: userId,
      action: action,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.log("Error while saving activity : ", error);
  }
};
