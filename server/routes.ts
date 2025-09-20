import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPHCSchema, insertDiseaseReportSchema, insertWaterQualityTestSchema, 
  insertAlertSchema, insertUserSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler helper
  const handleError = (res: any, error: unknown) => {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    console.error('API Error:', error);
    return res.status(500).json({ error: "Internal server error" });
  };

  // PHC Routes
  app.get("/api/phcs", async (req, res) => {
    try {
      const { state, district } = req.query;
      let phcs;
      
      if (state) {
        phcs = await storage.getPHCsByState(state as string);
      } else if (district) {
        phcs = await storage.getPHCsByDistrict(district as string);
      } else {
        phcs = await storage.getAllPHCs();
      }
      
      res.json(phcs);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/phcs/:id", async (req, res) => {
    try {
      const phc = await storage.getPHC(req.params.id);
      if (!phc) {
        return res.status(404).json({ error: "PHC not found" });
      }
      res.json(phc);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/phcs", async (req, res) => {
    try {
      const validatedData = insertPHCSchema.parse(req.body);
      const phc = await storage.createPHC(validatedData);
      res.status(201).json(phc);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.patch("/api/phcs/:id", async (req, res) => {
    try {
      const validatedData = insertPHCSchema.partial().parse(req.body);
      const phc = await storage.updatePHC(req.params.id, validatedData);
      if (!phc) {
        return res.status(404).json({ error: "PHC not found" });
      }
      res.json(phc);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/phcs/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePHC(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "PHC not found" });
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Disease Report Routes
  app.get("/api/disease-reports", async (req, res) => {
    try {
      const { phcId, days, startDate, endDate } = req.query;
      let reports;
      
      if (phcId) {
        reports = await storage.getDiseaseReportsByPHC(phcId as string);
      } else if (startDate && endDate) {
        reports = await storage.getDiseaseReportsByDateRange(
          new Date(startDate as string), 
          new Date(endDate as string)
        );
      } else {
        const daysNum = days ? parseInt(days as string) : 7;
        reports = await storage.getRecentDiseaseReports(daysNum);
      }
      
      res.json(reports);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/disease-reports/:id", async (req, res) => {
    try {
      const report = await storage.getDiseaseReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Disease report not found" });
      }
      res.json(report);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/disease-reports", async (req, res) => {
    try {
      const reportDate = new Date(req.body.reportDate);
      if (isNaN(reportDate.getTime())) {
        return res.status(400).json({ error: "Invalid report date" });
      }
      const validatedData = insertDiseaseReportSchema.parse({
        ...req.body,
        reportDate
      });
      const report = await storage.createDiseaseReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.patch("/api/disease-reports/:id", async (req, res) => {
    try {
      const validatedData = insertDiseaseReportSchema.partial().parse({
        ...req.body,
        ...(req.body.reportDate && { reportDate: new Date(req.body.reportDate) })
      });
      const report = await storage.updateDiseaseReport(req.params.id, validatedData);
      if (!report) {
        return res.status(404).json({ error: "Disease report not found" });
      }
      res.json(report);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/disease-reports/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDiseaseReport(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Disease report not found" });
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Water Quality Test Routes
  app.get("/api/water-quality-tests", async (req, res) => {
    try {
      const { phcId, days, startDate, endDate } = req.query;
      let tests;
      
      if (phcId) {
        tests = await storage.getWaterQualityTestsByPHC(phcId as string);
      } else if (startDate && endDate) {
        tests = await storage.getWaterQualityTestsByDateRange(
          new Date(startDate as string), 
          new Date(endDate as string)
        );
      } else {
        const daysNum = days ? parseInt(days as string) : 7;
        tests = await storage.getRecentWaterQualityTests(daysNum);
      }
      
      res.json(tests);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/water-quality-tests/:id", async (req, res) => {
    try {
      const test = await storage.getWaterQualityTest(req.params.id);
      if (!test) {
        return res.status(404).json({ error: "Water quality test not found" });
      }
      res.json(test);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/water-quality-tests", async (req, res) => {
    try {
      const testDate = new Date(req.body.testDate);
      if (isNaN(testDate.getTime())) {
        return res.status(400).json({ error: "Invalid test date" });
      }
      const validatedData = insertWaterQualityTestSchema.parse({
        ...req.body,
        testDate
      });
      const test = await storage.createWaterQualityTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.patch("/api/water-quality-tests/:id", async (req, res) => {
    try {
      const validatedData = insertWaterQualityTestSchema.partial().parse({
        ...req.body,
        ...(req.body.testDate && { testDate: new Date(req.body.testDate) })
      });
      const test = await storage.updateWaterQualityTest(req.params.id, validatedData);
      if (!test) {
        return res.status(404).json({ error: "Water quality test not found" });
      }
      res.json(test);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/water-quality-tests/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWaterQualityTest(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Water quality test not found" });
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Alert Routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const { phcId, status, severity, days } = req.query;
      let alerts;
      
      if (phcId) {
        alerts = await storage.getAlertsByPHC(phcId as string);
      } else if (status) {
        alerts = await storage.getAlertsByStatus(status as string);
      } else if (severity) {
        alerts = await storage.getAlertsBySeverity(severity as string);
      } else {
        const daysNum = days ? parseInt(days as string) : 7;
        if (isNaN(daysNum) || daysNum < 1) {
          return res.status(400).json({ error: "Invalid days parameter" });
        }
        alerts = await storage.getRecentAlerts(daysNum);
      }
      
      res.json(alerts);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/alerts/active", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/alerts/:id", async (req, res) => {
    try {
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.partial().parse(req.body);
      const alert = await storage.updateAlert(req.params.id, validatedData);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/alerts/:id/verify", async (req, res) => {
    try {
      const { verifiedBy } = req.body;
      if (!verifiedBy) {
        return res.status(400).json({ error: "verifiedBy is required" });
      }
      const alert = await storage.verifyAlert(req.params.id, verifiedBy);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const { resolvedBy } = req.body;
      if (!resolvedBy) {
        return res.status(400).json({ error: "resolvedBy is required" });
      }
      const alert = await storage.resolveAlert(req.params.id, resolvedBy);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAlert(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // User Routes
  app.get("/api/users", async (req, res) => {
    try {
      const { email } = req.query;
      if (email) {
        const user = await storage.getUserByEmail(email as string);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
      } else {
        res.status(400).json({ error: "Email query parameter required" });
      }
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });

  // Dashboard summary endpoint
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const [activeAlerts, recentReports, recentTests, allPHCs] = await Promise.all([
        storage.getActiveAlerts(),
        storage.getRecentDiseaseReports(7),
        storage.getRecentWaterQualityTests(7),
        storage.getAllPHCs()
      ]);

      const summary = {
        totalPHCs: allPHCs.length,
        activeAlerts: activeAlerts.length,
        recentDiseaseReports: recentReports.length,
        recentWaterTests: recentTests.length,
        criticalAlerts: activeAlerts.filter(alert => alert.severity === "critical").length,
        highRiskPHCs: activeAlerts.map(alert => alert.phcId).filter((id, index, arr) => arr.indexOf(id) === index).length
      };

      res.json(summary);
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
