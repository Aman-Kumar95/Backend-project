import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Activity = mongoose.model("Activity",activitySchema)