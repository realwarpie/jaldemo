import { 
  type User, type InsertUser,
  type PHC, type InsertPHC,
  type DiseaseReport, type InsertDiseaseReport,
  type WaterQualityTest, type InsertWaterQualityTest,
  type Alert, type InsertAlert
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // PHC operations
  getPHC(id: string): Promise<PHC | undefined>;
  getAllPHCs(): Promise<PHC[]>;
  getPHCsByState(state: string): Promise<PHC[]>;
  getPHCsByDistrict(district: string): Promise<PHC[]>;
  createPHC(phc: InsertPHC): Promise<PHC>;
  updatePHC(id: string, updates: Partial<InsertPHC>): Promise<PHC | undefined>;
  deletePHC(id: string): Promise<boolean>;
  
  // Disease report operations
  getDiseaseReport(id: string): Promise<DiseaseReport | undefined>;
  getDiseaseReportsByPHC(phcId: string): Promise<DiseaseReport[]>;
  getDiseaseReportsByDateRange(startDate: Date, endDate: Date): Promise<DiseaseReport[]>;
  getRecentDiseaseReports(days?: number): Promise<DiseaseReport[]>;
  createDiseaseReport(report: InsertDiseaseReport): Promise<DiseaseReport>;
  updateDiseaseReport(id: string, updates: Partial<InsertDiseaseReport>): Promise<DiseaseReport | undefined>;
  deleteDiseaseReport(id: string): Promise<boolean>;
  
  // Water quality test operations
  getWaterQualityTest(id: string): Promise<WaterQualityTest | undefined>;
  getWaterQualityTestsByPHC(phcId: string): Promise<WaterQualityTest[]>;
  getWaterQualityTestsByDateRange(startDate: Date, endDate: Date): Promise<WaterQualityTest[]>;
  getRecentWaterQualityTests(days?: number): Promise<WaterQualityTest[]>;
  createWaterQualityTest(test: InsertWaterQualityTest): Promise<WaterQualityTest>;
  updateWaterQualityTest(id: string, updates: Partial<InsertWaterQualityTest>): Promise<WaterQualityTest | undefined>;
  deleteWaterQualityTest(id: string): Promise<boolean>;
  
  // Alert operations
  getAlert(id: string): Promise<Alert | undefined>;
  getAlertsByPHC(phcId: string): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  getAlertsByStatus(status: string): Promise<Alert[]>;
  getAlertsBySeverity(severity: string): Promise<Alert[]>;
  getRecentAlerts(days?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, updates: Partial<InsertAlert>): Promise<Alert | undefined>;
  verifyAlert(id: string, verifiedBy: string): Promise<Alert | undefined>;
  resolveAlert(id: string, resolvedBy: string): Promise<Alert | undefined>;
  deleteAlert(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private phcs: Map<string, PHC>;
  private diseaseReports: Map<string, DiseaseReport>;
  private waterQualityTests: Map<string, WaterQualityTest>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.phcs = new Map();
    this.diseaseReports = new Map();
    this.waterQualityTests = new Map();
    this.alerts = new Map();
    
    // Initialize with sample data for better UX
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      phcId: insertUser.phcId || null,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // PHC operations
  async getPHC(id: string): Promise<PHC | undefined> {
    return this.phcs.get(id);
  }

  async getAllPHCs(): Promise<PHC[]> {
    return Array.from(this.phcs.values());
  }

  async getPHCsByState(state: string): Promise<PHC[]> {
    return Array.from(this.phcs.values()).filter(phc => phc.state === state);
  }

  async getPHCsByDistrict(district: string): Promise<PHC[]> {
    return Array.from(this.phcs.values()).filter(phc => phc.district === district);
  }

  async createPHC(insertPHC: InsertPHC): Promise<PHC> {
    const id = randomUUID();
    const phc: PHC = { 
      ...insertPHC, 
      id, 
      createdAt: new Date(),
      contactPhone: insertPHC.contactPhone || null,
      adminName: insertPHC.adminName || null
    };
    this.phcs.set(id, phc);
    return phc;
  }

  async updatePHC(id: string, updates: Partial<InsertPHC>): Promise<PHC | undefined> {
    const phc = this.phcs.get(id);
    if (!phc) return undefined;
    
    const updatedPHC: PHC = { ...phc, ...updates };
    this.phcs.set(id, updatedPHC);
    return updatedPHC;
  }

  // Disease report operations
  async getDiseaseReport(id: string): Promise<DiseaseReport | undefined> {
    return this.diseaseReports.get(id);
  }

  async getDiseaseReportsByPHC(phcId: string): Promise<DiseaseReport[]> {
    return Array.from(this.diseaseReports.values()).filter(report => report.phcId === phcId);
  }

  async getDiseaseReportsByDateRange(startDate: Date, endDate: Date): Promise<DiseaseReport[]> {
    return Array.from(this.diseaseReports.values()).filter(report => 
      report.reportDate >= startDate && report.reportDate <= endDate
    );
  }

  async getRecentDiseaseReports(days: number = 7): Promise<DiseaseReport[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return Array.from(this.diseaseReports.values())
      .filter(report => report.reportDate >= cutoffDate)
      .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }

  async createDiseaseReport(insertReport: InsertDiseaseReport): Promise<DiseaseReport> {
    const id = randomUUID();
    const report: DiseaseReport = { 
      ...insertReport, 
      id, 
      createdAt: new Date(),
      symptoms: insertReport.symptoms || null,
      notes: insertReport.notes || null
    };
    this.diseaseReports.set(id, report);
    return report;
  }

  async updateDiseaseReport(id: string, updates: Partial<InsertDiseaseReport>): Promise<DiseaseReport | undefined> {
    const report = this.diseaseReports.get(id);
    if (!report) return undefined;
    
    const updatedReport: DiseaseReport = { ...report, ...updates };
    this.diseaseReports.set(id, updatedReport);
    return updatedReport;
  }

  // Water quality test operations
  async getWaterQualityTest(id: string): Promise<WaterQualityTest | undefined> {
    return this.waterQualityTests.get(id);
  }

  async getWaterQualityTestsByPHC(phcId: string): Promise<WaterQualityTest[]> {
    return Array.from(this.waterQualityTests.values()).filter(test => test.phcId === phcId);
  }

  async getWaterQualityTestsByDateRange(startDate: Date, endDate: Date): Promise<WaterQualityTest[]> {
    return Array.from(this.waterQualityTests.values()).filter(test => 
      test.testDate >= startDate && test.testDate <= endDate
    );
  }

  async getRecentWaterQualityTests(days: number = 7): Promise<WaterQualityTest[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return Array.from(this.waterQualityTests.values())
      .filter(test => test.testDate >= cutoffDate)
      .sort((a, b) => b.testDate.getTime() - a.testDate.getTime());
  }

  async createWaterQualityTest(insertTest: InsertWaterQualityTest): Promise<WaterQualityTest> {
    const id = randomUUID();
    const test: WaterQualityTest = { 
      ...insertTest, 
      id, 
      createdAt: new Date(),
      phValue: insertTest.phValue || null,
      turbidity: insertTest.turbidity || null,
      bacteria: insertTest.bacteria || null,
      chlorine: insertTest.chlorine || null,
      notes: insertTest.notes || null
    };
    this.waterQualityTests.set(id, test);
    return test;
  }

  async updateWaterQualityTest(id: string, updates: Partial<InsertWaterQualityTest>): Promise<WaterQualityTest | undefined> {
    const test = this.waterQualityTests.get(id);
    if (!test) return undefined;
    
    const updatedTest: WaterQualityTest = { ...test, ...updates };
    this.waterQualityTests.set(id, updatedTest);
    return updatedTest;
  }

  // Alert operations
  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async getAlertsByPHC(phcId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.phcId === phcId);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === "active")
      .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime());
  }

  async getAlertsByStatus(status: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === status)
      .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime());
  }

  async getAlertsBySeverity(severity: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.severity === severity)
      .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime());
  }

  async getRecentAlerts(days: number = 7): Promise<Alert[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return Array.from(this.alerts.values())
      .filter(alert => alert.alertedAt >= cutoffDate)
      .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime());
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      alertedAt: new Date(),
      verifiedAt: null,
      resolvedAt: null,
      verifiedBy: null,
      resolvedBy: null,
      createdAt: new Date()
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async updateAlert(id: string, updates: Partial<InsertAlert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert: Alert = { ...alert, ...updates };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async verifyAlert(id: string, verifiedBy: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert: Alert = { 
      ...alert, 
      status: "verified", 
      verifiedBy, 
      verifiedAt: new Date()
    };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async resolveAlert(id: string, resolvedBy: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert: Alert = { 
      ...alert, 
      status: "resolved", 
      resolvedBy, 
      resolvedAt: new Date()
    };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // Delete operations
  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async deletePHC(id: string): Promise<boolean> {
    return this.phcs.delete(id);
  }

  async deleteDiseaseReport(id: string): Promise<boolean> {
    return this.diseaseReports.delete(id);
  }

  async deleteWaterQualityTest(id: string): Promise<boolean> {
    return this.waterQualityTests.delete(id);
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.alerts.delete(id);
  }

  private initializeSampleData() {
    // Add sample PHCs for Northeast India
    const samplePHCs = [
      {
        name: "Guwahati PHC",
        district: "Kamrup",
        state: "Assam",
        latitude: 26.1445,
        longitude: 91.7362,
        contactPhone: "+91-98765-43210",
        adminName: "Dr. Priya Sharma",
        status: "active" as const
      },
      {
        name: "Silchar PHC",
        district: "Cachar", 
        state: "Assam",
        latitude: 24.8333,
        longitude: 92.7789,
        contactPhone: "+91-98765-43211",
        adminName: "Dr. Raj Kumar",
        status: "active" as const
      },
      {
        name: "Imphal PHC",
        district: "Imphal West",
        state: "Manipur", 
        latitude: 24.8170,
        longitude: 93.9368,
        contactPhone: "+91-98765-43212",
        adminName: "Dr. Anita Singh",
        status: "active" as const
      },
      {
        name: "Shillong PHC",
        district: "East Khasi Hills",
        state: "Meghalaya",
        latitude: 25.5788,
        longitude: 91.8933,
        contactPhone: "+91-98765-43213", 
        adminName: "Dr. John Marbaniang",
        status: "active" as const
      },
      {
        name: "Agartala PHC",
        district: "West Tripura",
        state: "Tripura",
        latitude: 23.8315,
        longitude: 91.2868,
        contactPhone: "+91-98765-43214",
        adminName: "Dr. Biplab Deb",
        status: "active" as const
      }
    ];

    samplePHCs.forEach(phcData => {
      const id = randomUUID();
      const phc: PHC = {
        ...phcData,
        id,
        createdAt: new Date()
      };
      this.phcs.set(id, phc);
    });

    // Add sample user
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      name: "Dr. Priya Sharma",
      email: "priya.sharma@jalsuraksha.gov.in",
      role: "admin",
      phcId: Array.from(this.phcs.values())[0].id,
      language: "en",
      phone: "+91-98765-43210",
      createdAt: new Date()
    };
    this.users.set(adminId, adminUser);
  }
}

export const storage = new MemStorage();
