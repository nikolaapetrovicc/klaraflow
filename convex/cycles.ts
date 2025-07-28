import { query, mutation, action, internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal, api } from "./_generated/api";

export const getUserCycles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const cycles = await ctx.db
      .query("cycleEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return cycles;
  },
});

export const getUserCyclesInternal = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const cycles = await ctx.db
      .query("cycleEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);

    return cycles;
  },
});

export const logCycleEntry = mutation({
  args: {
    date: v.string(),
    flow: v.union(v.literal("light"), v.literal("medium"), v.literal("heavy")),
    mood: v.union(v.literal("happy"), v.literal("neutral"), v.literal("sad")),
    symptoms: v.array(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if entry already exists for this date
    const existing = await ctx.db
      .query("cycleEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .first();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        flow: args.flow,
        mood: args.mood,
        symptoms: args.symptoms,
        notes: args.notes,
      });
      return existing._id;
    } else {
      // Create new entry
      return await ctx.db.insert("cycleEntries", {
        userId,
        date: args.date,
        flow: args.flow,
        mood: args.mood,
        symptoms: args.symptoms,
        notes: args.notes,
      });
    }
  },
});

export const getPredictions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const predictions = await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(5); // Get 5 predictions (3 accurate + 2 estimates)

    return predictions;
  },
});

export const getAlerts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("resolved"), false))
      .order("desc")
      .take(5);

    return alerts;
  },
});

export const getMotivationalQuote = query({
  args: {},
  handler: async (ctx) => {
    const quotes = [
      { quote: "You are stronger than you think and more capable than you imagine", author: "Unknown" },
      { quote: "Your body is doing something incredible - honor it", author: "Unknown" },
      { quote: "Every cycle is a reminder of your body's amazing power", author: "Unknown" },
      { quote: "Listen to your body, it's speaking to you", author: "Unknown" },
      { quote: "You are not broken, you are cyclical", author: "Unknown" },
      { quote: "Your period is not a weakness, it's a superpower", author: "Unknown" },
      { quote: "Rest when you need to, you're not lazy - you're wise", author: "Unknown" },
      { quote: "Your body knows what it's doing, trust the process", author: "Unknown" },
      { quote: "You are exactly where you need to be in your cycle", author: "Unknown" },
      { quote: "Embrace your rhythm, it's uniquely yours", author: "Unknown" },
    ];

    // Return a different quote based on the day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    
    return quotes[quoteIndex];
  },
});

export const getAIAdvice = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Get the latest AI advice
    const advice = await ctx.db
      .query("aiAdvice")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    return advice;
  },
});

export const generatePredictions = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get recent cycle data
    const recentCycles = await ctx.db
      .query("cycleEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId))
      .order("desc")
      .take(90); // Last 3 months

    if (recentCycles.length < 2) {
      // Not enough data for predictions
      return;
    }

    // Enhanced AI prediction logic
    const cycleDates = recentCycles.map(c => new Date(c.date)).sort((a, b) => a.getTime() - b.getTime());
    const intervals = [];
    
    for (let i = 1; i < cycleDates.length; i++) {
      const diff = Math.floor((cycleDates[i].getTime() - cycleDates[i-1].getTime()) / (1000 * 60 * 60 * 24));
      intervals.push(diff);
    }

    const avgCycleLength = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const cycleVariability = Math.sqrt(intervals.reduce((acc, interval) => acc + Math.pow(interval - avgCycleLength, 2), 0) / intervals.length);
    const lastPeriod = cycleDates[cycleDates.length - 1];

    // Generate 5 predictions (3 accurate, 2 estimates)
    const predictions = [];
    for (let i = 1; i <= 5; i++) {
      const predictedStart = new Date(lastPeriod.getTime() + (avgCycleLength * i * 24 * 60 * 60 * 1000));
      const predictedEnd = new Date(predictedStart.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5-day period
      
      // Calculate confidence based on data quality and prediction distance
      let confidence;
      if (i <= 3) {
        // First 3 predictions are more accurate
        confidence = Math.max(70, 95 - (i * 5) - (cycleVariability * 2) - (intervals.length < 5 ? 15 : 0));
      } else {
        // Last 2 predictions are estimates with lower confidence
        confidence = Math.max(40, 65 - (i * 8) - (cycleVariability * 3));
      }

      predictions.push({
        userId,
        predictedStart: predictedStart.toISOString().split('T')[0],
        predictedEnd: predictedEnd.toISOString().split('T')[0],
        confidence: Math.round(confidence),
        generatedAt: Date.now(),
      });
    }

    // Clear old predictions
    const oldPredictions = await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const pred of oldPredictions) {
      await ctx.db.delete(pred._id);
    }

    // Insert new predictions
    for (const pred of predictions) {
      await ctx.db.insert("predictions", pred);
    }

    // Check if user is late and create alert
    const today = new Date().toISOString().split('T')[0];
    const daysSinceLastPeriod = Math.floor((new Date(today).getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPeriod > avgCycleLength + 3) {
      const daysLate = daysSinceLastPeriod - Math.floor(avgCycleLength);
      await ctx.db.insert("alerts", {
        userId,
        type: "late",
        message: `Your period is ${daysLate} days late. Consider taking a pregnancy test or consulting your healthcare provider.`,
        resolved: false,
        createdAt: Date.now(),
      });
    }

    // Schedule AI advice generation
    await ctx.scheduler.runAfter(0, internal.cycles.generateAIAdvice, { userId });
  },
});

export const generateAIAdvice = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get user's recent cycle data
    const recentCycles = await ctx.runQuery(api.cycles.getUserCyclesInternal, { userId: args.userId });
    
    if (!recentCycles || recentCycles.length < 2) {
      return; // Not enough data for advice
    }

    // Analyze patterns in the data
    const symptoms = recentCycles.flatMap((cycle: any) => cycle.symptoms);
    const moods = recentCycles.map((cycle: any) => cycle.mood);
    const flows = recentCycles.map((cycle: any) => cycle.flow);
    
    // Count symptom frequency
    const symptomCounts = symptoms.reduce((acc: Record<string, number>, symptom: string) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([symptom]) => symptom);

    // Generate personalized advice based on patterns
    let advice = "";
    
    if (mostCommonSymptoms.includes('cramps')) {
      advice += "I notice you frequently experience cramps. Try gentle yoga, heat therapy, or magnesium supplements to help manage the pain. ";
    }
    
    if (mostCommonSymptoms.includes('mood_swings')) {
      advice += "Your mood patterns suggest hormonal fluctuations. Consider tracking your emotions and practicing mindfulness or meditation. ";
    }
    
    if (mostCommonSymptoms.includes('fatigue')) {
      advice += "Fatigue seems to be a recurring issue. Ensure you're getting enough iron-rich foods and quality sleep during your cycle. ";
    }
    
    if (mostCommonSymptoms.includes('bloating')) {
      advice += "To help with bloating, try reducing sodium intake and staying hydrated. Gentle movement can also help. ";
    }
    
    // Mood-based advice
    const sadMoodCount = moods.filter((mood: string) => mood === 'sad').length;
    if (sadMoodCount > recentCycles.length * 0.4) {
      advice += "I see you've been feeling down during your cycles. This is completely normal, but consider talking to someone you trust or practicing self-care activities. ";
    }
    
    // Flow-based advice
    const heavyFlowCount = flows.filter((flow: string) => flow === 'heavy').length;
    if (heavyFlowCount > recentCycles.length * 0.6) {
      advice += "You often experience heavy flow. Make sure you're getting enough iron and consider discussing this with your healthcare provider if it's concerning you. ";
    }
    
    // Default advice if no specific patterns
    if (!advice) {
      advice = "Your cycle data looks healthy! Keep tracking to help me provide more personalized insights. Remember to listen to your body and practice self-care during your cycle.";
    }
    
    // Store the advice
    await ctx.runMutation(internal.cycles.storeAIAdvice, {
      userId: args.userId,
      advice: advice.trim(),
    });
  },
});

export const storeAIAdvice = internalMutation({
  args: {
    userId: v.id("users"),
    advice: v.string(),
  },
  handler: async (ctx, args) => {
    // Clear old advice
    const oldAdvice = await ctx.db
      .query("aiAdvice")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const advice of oldAdvice) {
      await ctx.db.delete(advice._id);
    }

    // Store new advice
    await ctx.db.insert("aiAdvice", {
      userId: args.userId,
      advice: args.advice,
      generatedAt: Date.now(),
    });
  },
});

export const getNextPeriodDays = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const predictions = await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    if (!predictions) return null;

    const today = new Date();
    const nextPeriod = new Date(predictions.predictedStart);
    const diffTime = nextPeriod.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  },
});

export const logFertilityEntry = mutation({
  args: {
    date: v.string(),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if entry already exists for this date and type
    const existing = await ctx.db
      .query("fertilityEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        details: args.details,
      });
      return existing._id;
    } else {
      // Create new entry
      return await ctx.db.insert("fertilityEntries", {
        userId,
        date: args.date,
        type: args.type,
        details: args.details,
      });
    }
  },
});

export const getFertilityEntries = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fertilityEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getUserFertilityEntries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("fertilityEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createUserPreferences = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    
    // Set content filtering based on purpose mode
    const contentFiltering = {
      showTTCContent: args.purposeMode === "ttc",
      showPregnancyContent: args.purposeMode === "pregnancy",
      showWellnessTips: args.purposeMode === "wellness_tracking" || args.purposeMode === "cycle_tracking",
    };

    return await ctx.db.insert("userPreferences", {
      userId,
      purposeMode: args.purposeMode,
      trackingCategories: args.trackingCategories,
      contentFiltering,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateUserPreferences = mutation({
  args: {
    purposeMode: v.optional(v.union(
      v.literal("cycle_tracking"),
      v.literal("ttc"),
      v.literal("wellness_tracking"),
      v.literal("pregnancy")
    )),
    trackingCategories: v.optional(v.object({
      ovulation: v.boolean(),
      pmsSymptoms: v.boolean(),
      sexLogs: v.boolean(),
      emotionalState: v.boolean(),
      cravings: v.boolean(),
      crampIntensity: v.boolean(),
      sleepStress: v.boolean(),
      energyLevel: v.boolean(),
      hungerLevel: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!existing) {
      throw new Error("User preferences not found");
    }

    const updates: any = { updatedAt: Date.now() };
    
    if (args.purposeMode) {
      updates.purposeMode = args.purposeMode;
      // Update content filtering based on new purpose mode
      updates.contentFiltering = {
        showTTCContent: args.purposeMode === "ttc",
        showPregnancyContent: args.purposeMode === "pregnancy",
        showWellnessTips: args.purposeMode === "wellness_tracking" || args.purposeMode === "cycle_tracking",
      };
    }
    
    if (args.trackingCategories) {
      updates.trackingCategories = args.trackingCategories;
    }

    await ctx.db.patch(existing._id, updates);
    return existing._id;
  },
});

export const getUserPreferences = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const logCycleEntryEnhanced = mutation({
  args: {
    date: v.string(),
    flow: v.union(v.literal("light"), v.literal("medium"), v.literal("heavy")),
    mood: v.union(v.literal("happy"), v.literal("neutral"), v.literal("sad")),
    symptoms: v.array(v.string()),
    notes: v.optional(v.string()),
    // New wellness tracking fields
    crampIntensity: v.optional(v.number()),
    energyLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    cravings: v.optional(v.array(v.string())),
    hungerLevel: v.optional(v.number()),
    sleepQuality: v.optional(v.number()),
    stressLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    emotionalState: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if entry already exists for this date
    const existing = await ctx.db
      .query("cycleEntries")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .first();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        flow: args.flow,
        mood: args.mood,
        symptoms: args.symptoms,
        notes: args.notes,
        crampIntensity: args.crampIntensity,
        energyLevel: args.energyLevel,
        cravings: args.cravings,
        hungerLevel: args.hungerLevel,
        sleepQuality: args.sleepQuality,
        stressLevel: args.stressLevel,
        emotionalState: args.emotionalState,
      });
      return existing._id;
    } else {
      // Create new entry
      return await ctx.db.insert("cycleEntries", {
        userId,
        date: args.date,
        flow: args.flow,
        mood: args.mood,
        symptoms: args.symptoms,
        notes: args.notes,
        crampIntensity: args.crampIntensity,
        energyLevel: args.energyLevel,
        cravings: args.cravings,
        hungerLevel: args.hungerLevel,
        sleepQuality: args.sleepQuality,
        stressLevel: args.stressLevel,
        emotionalState: args.emotionalState,
      });
    }
  },
});
