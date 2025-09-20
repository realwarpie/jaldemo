import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// PHC (Primary Health Center) table
export const phcs = pgTable("phcs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  contactPhone: text("contact_phone"),
  adminName: text("admin_name"),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Disease case reports table
export const diseaseReports = pgTable("disease_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phcId: varchar("phc_id").notNull().references(() => phcs.id),
  reportDate: timestamp("report_date").notNull(),
  diseaseType: text("disease_type").notNull(), // cholera, diarrhea, typhoid, etc.
  caseCount: integer("case_count").notNull(),
  ageGroup: text("age_group").notNull(), // 0-5, 6-18, 19-60, 60+
  severity: text("severity").notNull(), // mild, moderate, severe
  symptoms: text("symptoms"),
  notes: text("notes"),
  reportedBy: text("reported_by").notNull(),
  verified: integer("verified").notNull().default(0), // 0 or 1 (boolean)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Water quality tests table
export const waterQualityTests = pgTable("water_quality_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phcId: varchar("phc_id").notNull().references(() => phcs.id),
  testDate: timestamp("test_date").notNull(),
  location: text("location").notNull(),
  source: text("source").notNull(), // borewell, hand pump, river, etc.
  phValue: real("ph_value"),
  turbidity: real("turbidity"),
  bacteria: real("bacteria"), // E. coli count
  chlorine: real("chlorine"),
  notes: text("notes"),
  testedBy: text("tested_by").notNull(),
  status: text("status").notNull().default("safe"), // safe, contaminated, pending
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  status: text("status").notNull().default("active"), // active, verified, resolved, false-alarm
  phcId: varchar("phc_id").notNull().references(() => phcs.id),
  affectedPopulation: integer("affected_population").notNull(),
  estimatedCases: integer("estimated_cases").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  riskFactors: json("risk_factors").$type<string[]>().notNull().default([]),
  alertedAt: timestamp("alerted_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  resolvedAt: timestamp("resolved_at"),
  verifiedBy: text("verified_by"),
  resolvedBy: text("resolved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table (healthcare workers)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // admin, phc_worker, data_entry, viewer
  phcId: varchar("phc_id").references(() => phcs.id),
  language: text("language").notNull().default("en"), // en, as, bn
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas with validation
export const insertPHCSchema = createInsertSchema(phcs, {
  name: z.string().min(1, "PHC name is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contactPhone: z.string().optional(),
  adminName: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
}).omit({ id: true, createdAt: true });

export const insertDiseaseReportSchema = createInsertSchema(diseaseReports, {
  phcId: z.string().min(1, "PHC is required"),
  reportDate: z.date({ required_error: "Report date is required" }),
  diseaseType: z.enum(["cholera", "diarrhea", "typhoid", "hepatitis_a", "dysentery", "gastroenteritis"], {
    required_error: "Disease type is required"
  }),
  caseCount: z.number().min(1, "At least 1 case must be reported"),
  ageGroup: z.enum(["0-5", "6-18", "19-60", "60+"], { required_error: "Age group is required" }),
  severity: z.enum(["mild", "moderate", "severe"], { required_error: "Severity is required" }),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
  reportedBy: z.string().min(1, "Reporter name is required"),
  verified: z.number().min(0).max(1).default(0),
}).omit({ id: true, createdAt: true });

export const insertWaterQualityTestSchema = createInsertSchema(waterQualityTests, {
  phcId: z.string().min(1, "PHC is required"),
  testDate: z.date({ required_error: "Test date is required" }),
  location: z.string().min(1, "Test location is required"),
  source: z.enum(["borewell", "hand_pump", "river", "pond", "municipal_supply", "other"], {
    required_error: "Water source is required"
  }),
  phValue: z.number().min(0).max(14).optional(),
  turbidity: z.number().min(0).optional(),
  bacteria: z.number().min(0).optional(),
  chlorine: z.number().min(0).optional(),
  notes: z.string().optional(),
  testedBy: z.string().min(1, "Tester name is required"),
  status: z.enum(["safe", "contaminated", "pending"]).default("pending"),
}).omit({ id: true, createdAt: true });

export const insertAlertSchema = createInsertSchema(alerts, {
  title: z.string().min(1, "Alert title is required"),
  description: z.string().min(1, "Alert description is required"),
  severity: z.enum(["low", "medium", "high", "critical"], { required_error: "Severity is required" }),
  status: z.enum(["active", "verified", "resolved", "false-alarm"]).default("active"),
  phcId: z.string().min(1, "PHC is required"),
  affectedPopulation: z.number().min(1, "Affected population must be greater than 0"),
  estimatedCases: z.number().min(1, "Estimated cases must be greater than 0"),
  confidence: z.number().min(0).max(100, "Confidence must be between 0-100"),
  riskFactors: z.array(z.string()).default([]),
}).omit({ id: true, createdAt: true, verifiedAt: true, resolvedAt: true, verifiedBy: true, resolvedBy: true });

export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "phc_worker", "data_entry", "viewer"], { required_error: "Role is required" }),
  phcId: z.string().optional(),
  language: z.enum(["en", "as", "bn"]).default("en"),
  phone: z.string().optional(),
}).omit({ id: true, createdAt: true });

// Export types
export type PHC = typeof phcs.$inferSelect;
export type InsertPHC = z.infer<typeof insertPHCSchema>;

export type DiseaseReport = typeof diseaseReports.$inferSelect;
export type InsertDiseaseReport = z.infer<typeof insertDiseaseReportSchema>;

export type WaterQualityTest = typeof waterQualityTests.$inferSelect;
export type InsertWaterQualityTest = z.infer<typeof insertWaterQualityTestSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
