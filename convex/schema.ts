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
    // New wellness tracking fields
    crampIntensity: v.optional(v.number()), // 0-5 scale
    energyLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    cravings: v.optional(v.array(v.string())), // ["sweet", "salty", "chocolate", etc.]
    hungerLevel: v.optional(v.number()), // 0-5 scale
    sleepQuality: v.optional(v.number()), // 1-5 scale
    stressLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    emotionalState: v.optional(v.array(v.string())), // ["anxious", "calm", "irritable", etc.]
  }).index("by_user_and_date", ["userId", "date"]),

  userPreferences: defineTable({
    userId: v.id("users"),
    purposeMode: v.union(
      v.literal("cycle_tracking"),
      v.literal("ttc"),
      v.literal("wellness_tracking"),
      v.literal("pregnancy")
    ),
    trackingCategories: v.object({
      ovulation: v.boolean(),
      pmsSymptoms: v.boolean(),
      sexLogs: v.boolean(),
      emotionalState: v.boolean(),
      cravings: v.boolean(),
      crampIntensity: v.boolean(),
      sleepStress: v.boolean(),
      energyLevel: v.boolean(),
      hungerLevel: v.boolean(),
    }),
    contentFiltering: v.object({
      showTTCContent: v.boolean(),
      showPregnancyContent: v.boolean(),
      showWellnessTips: v.boolean(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  fertilityEntries: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date string
    type: v.union(
      v.literal("intercourse"),
      v.literal("ovulation_test"),
      v.literal("artificial_fertilization"),
      v.literal("symptoms")
    ),
    details: v.union(
      v.object({
        intercourse: v.object({
          protected: v.boolean(),
          notes: v.optional(v.string()),
        }),
        ovulationTest: v.object({
          result: v.union(v.literal("positive"), v.literal("negative")),
          brand: v.optional(v.string()),
          notes: v.optional(v.string()),
        }),
        artificialFertilization: v.object({
          method: v.union(
            v.literal("iui"),
            v.literal("ivf"),
            v.literal("icsi"),
            v.literal("other")
          ),
          clinic: v.optional(v.string()),
          doctor: v.optional(v.string()),
          notes: v.optional(v.string()),
        }),
        symptoms: v.object({
          symptoms: v.array(v.string()),
          intensity: v.union(v.literal("mild"), v.literal("moderate"), v.literal("severe")),
          notes: v.optional(v.string()),
        }),
      })
    ),
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

  insights: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("pattern"), v.literal("correlation"), v.literal("trend")),
    title: v.string(),
    description: v.string(),
    data: v.object({
      symptom: v.optional(v.string()),
      cycleDay: v.optional(v.number()),
      correlation: v.optional(v.string()),
      trend: v.optional(v.string()),
    }),
    createdAt: v.number(),
    isRead: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
