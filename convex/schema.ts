import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  cycleEntries: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date string
    flow: v.union(v.literal("light"), v.literal("medium"), v.literal("heavy")),
    mood: v.union(v.literal("happy"), v.literal("neutral"), v.literal("sad")),
    symptoms: v.array(v.string()),
    notes: v.optional(v.string()),
  }).index("by_user_and_date", ["userId", "date"]),

  predictions: defineTable({
    userId: v.id("users"),
    predictedStart: v.string(), // ISO date string
    predictedEnd: v.string(), // ISO date string
    confidence: v.number(), // 0-100
    generatedAt: v.number(),
  }).index("by_user", ["userId"]),

  alerts: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("late"), v.literal("prediction"), v.literal("reminder")),
    message: v.string(),
    resolved: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  aiAdvice: defineTable({
    userId: v.id("users"),
    advice: v.string(),
    generatedAt: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
