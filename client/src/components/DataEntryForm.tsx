import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Upload, FileText } from "lucide-react";
import { format } from "date-fns";

interface CaseData {
  reportDate: Date | undefined;
  phcName: string;
  district: string;
  diseaseType: string;
  caseCount: string;
  symptoms: string;
  ageGroup: string;
  severity: string;
  notes: string;
}

interface WaterQualityData {
  testDate: Date | undefined;
  location: string;
  phValue: string;
  turbidity: string;
  bacteria: string;
  chlorine: string;
  source: string;
  notes: string;
}

type FormType = "case-log" | "water-quality";

interface DataEntryFormProps {
  formType?: FormType;
  onSubmit?: (data: CaseData | WaterQualityData) => void;
  className?: string;
}

export function DataEntryForm({ 
  formType = "case-log", 
  onSubmit = () => {},
  className = ""
}: DataEntryFormProps) {
  const [currentForm, setCurrentForm] = useState<FormType>(formType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Case log form state
  const [caseData, setCaseData] = useState<CaseData>({
    reportDate: new Date(),
    phcName: "",
    district: "",
    diseaseType: "",
    caseCount: "",
    symptoms: "",
    ageGroup: "",
    severity: "",
    notes: ""
  });

  // Water quality form state  
  const [waterData, setWaterData] = useState<WaterQualityData>({
    testDate: new Date(),
    location: "",
    phValue: "",
    turbidity: "",
    bacteria: "",
    chlorine: "",
    source: "",
    notes: ""
  });

  const diseaseTypes = [
    "Diarrhea",
    "Cholera", 
    "Typhoid",
    "Hepatitis A",
    "Dysentery",
    "Gastroenteritis"
  ];

  const ageGroups = [
    "0-5 years",
    "6-18 years", 
    "19-60 years",
    "60+ years"
  ];

  const severityLevels = [
    "Mild",
    "Moderate",
    "Severe"
  ];

  const waterSources = [
    "Borewell",
    "Hand pump",
    "River",
    "Pond",
    "Municipal supply",
    "Other"
  ];

  const handleCaseSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting case data:", caseData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(caseData);
    setIsSubmitting(false);
    
    // Reset form
    setCaseData({
      reportDate: new Date(),
      phcName: "",
      district: "",
      diseaseType: "",
      caseCount: "",
      symptoms: "",
      ageGroup: "",
      severity: "",
      notes: ""
    });
  };

  const handleWaterSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting water quality data:", waterData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(waterData);
    setIsSubmitting(false);
    
    // Reset form
    setWaterData({
      testDate: new Date(),
      location: "",
      phValue: "",
      turbidity: "",
      bacteria: "",
      chlorine: "",
      source: "",
      notes: ""
    });
  };

  return (
    <Card className={`${className}`} data-testid="data-entry-form">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Data Entry</CardTitle>
          <div className="flex gap-2">
            <Badge 
              variant={currentForm === "case-log" ? "default" : "outline"}
              className="cursor-pointer hover-elevate"
              onClick={() => setCurrentForm("case-log")}
              data-testid="tab-case-log"
            >
              <FileText className="h-3 w-3 mr-1" />
              Case Log
            </Badge>
            <Badge 
              variant={currentForm === "water-quality" ? "default" : "outline"}
              className="cursor-pointer hover-elevate"
              onClick={() => setCurrentForm("water-quality")}
              data-testid="tab-water-quality"
            >
              <Upload className="h-3 w-3 mr-1" />
              Water Quality
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentForm === "case-log" ? (
          <div className="space-y-4" data-testid="case-log-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-date">Report Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" data-testid="input-report-date">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {caseData.reportDate ? format(caseData.reportDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={caseData.reportDate}
                      onSelect={(date) => setCaseData({...caseData, reportDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phc-name">PHC Name</Label>
                <Input
                  id="phc-name"
                  value={caseData.phcName}
                  onChange={(e) => setCaseData({...caseData, phcName: e.target.value})}
                  placeholder="Enter PHC name"
                  data-testid="input-phc-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={caseData.district}
                  onChange={(e) => setCaseData({...caseData, district: e.target.value})}
                  placeholder="Enter district"
                  data-testid="input-district"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disease-type">Disease Type</Label>
                <Select value={caseData.diseaseType} onValueChange={(value) => setCaseData({...caseData, diseaseType: value})}>
                  <SelectTrigger data-testid="select-disease-type">
                    <SelectValue placeholder="Select disease type" />
                  </SelectTrigger>
                  <SelectContent>
                    {diseaseTypes.map(disease => (
                      <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="case-count">Case Count</Label>
                <Input
                  id="case-count"
                  type="number"
                  value={caseData.caseCount}
                  onChange={(e) => setCaseData({...caseData, caseCount: e.target.value})}
                  placeholder="Number of cases"
                  data-testid="input-case-count"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age-group">Age Group</Label>
                <Select value={caseData.ageGroup} onValueChange={(value) => setCaseData({...caseData, ageGroup: value})}>
                  <SelectTrigger data-testid="select-age-group">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map(age => (
                      <SelectItem key={age} value={age}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={caseData.severity} onValueChange={(value) => setCaseData({...caseData, severity: value})}>
                  <SelectTrigger data-testid="select-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                value={caseData.symptoms}
                onChange={(e) => setCaseData({...caseData, symptoms: e.target.value})}
                placeholder="Describe symptoms observed"
                data-testid="input-symptoms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={caseData.notes}
                onChange={(e) => setCaseData({...caseData, notes: e.target.value})}
                placeholder="Any additional observations or notes"
                data-testid="input-notes"
              />
            </div>

            <Button 
              onClick={handleCaseSubmit} 
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-submit-case"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Case Report"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4" data-testid="water-quality-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-date">Test Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" data-testid="input-test-date">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {waterData.testDate ? format(waterData.testDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={waterData.testDate}
                      onSelect={(date) => setWaterData({...waterData, testDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={waterData.location}
                  onChange={(e) => setWaterData({...waterData, location: e.target.value})}
                  placeholder="Test location"
                  data-testid="input-test-location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ph-value">pH Value</Label>
                <Input
                  id="ph-value"
                  type="number"
                  step="0.1"
                  value={waterData.phValue}
                  onChange={(e) => setWaterData({...waterData, phValue: e.target.value})}
                  placeholder="7.0"
                  data-testid="input-ph-value"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                <Input
                  id="turbidity"
                  type="number"
                  value={waterData.turbidity}
                  onChange={(e) => setWaterData({...waterData, turbidity: e.target.value})}
                  placeholder="5"
                  data-testid="input-turbidity"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bacteria">E. Coli (CFU/100ml)</Label>
                <Input
                  id="bacteria"
                  type="number"
                  value={waterData.bacteria}
                  onChange={(e) => setWaterData({...waterData, bacteria: e.target.value})}
                  placeholder="0"
                  data-testid="input-bacteria"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chlorine">Free Chlorine (mg/L)</Label>
                <Input
                  id="chlorine"
                  type="number"
                  step="0.1"
                  value={waterData.chlorine}
                  onChange={(e) => setWaterData({...waterData, chlorine: e.target.value})}
                  placeholder="0.5"
                  data-testid="input-chlorine"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Water Source</Label>
              <Select value={waterData.source} onValueChange={(value) => setWaterData({...waterData, source: value})}>
                <SelectTrigger data-testid="select-water-source">
                  <SelectValue placeholder="Select water source" />
                </SelectTrigger>
                <SelectContent>
                  {waterSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="water-notes">Notes</Label>
              <Textarea
                id="water-notes"
                value={waterData.notes}
                onChange={(e) => setWaterData({...waterData, notes: e.target.value})}
                placeholder="Additional observations about water quality"
                data-testid="input-water-notes"
              />
            </div>

            <Button 
              onClick={handleWaterSubmit} 
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-submit-water"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Water Quality Report"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}