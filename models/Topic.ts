import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITopic extends Document {
  userId: Types.ObjectId;
  name: string;
  archived: boolean;
  createdAt: Date;
}

const TopicSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Topic name is required"],
      trim: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
