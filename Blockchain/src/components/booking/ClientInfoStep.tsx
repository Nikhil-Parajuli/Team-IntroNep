import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ClientInfoStepProps {
  clientInfo: {
    mainConcern: string;
    prevTherapy: string;
    therapyGoals: string;
    medications: string;
    emergencyContact: string;
    preferredApproach: string;
    consentToNotes: boolean;
    currentSymptoms: string[];
    symptomDuration: string;
    copingStrategies: string;
    mentalHealthHistory: string;
    physicalHealthConditions: string;
    sleepQuality: string;
    dietaryHabits: string;
    exerciseRoutine: string;
    substanceUse: string;
    stressors: string;
    supportSystem: string;
    communicationPreference: string;
  };
  setClientInfo: React.Dispatch<React.SetStateAction<{
    mainConcern: string;
    prevTherapy: string;
    therapyGoals: string;
    medications: string;
    emergencyContact: string;
    preferredApproach: string;
    consentToNotes: boolean;
    currentSymptoms: string[];
    symptomDuration: string;
    copingStrategies: string;
    mentalHealthHistory: string;
    physicalHealthConditions: string;
    sleepQuality: string;
    dietaryHabits: string;
    exerciseRoutine: string;
    substanceUse: string;
    stressors: string;
    supportSystem: string;
    communicationPreference: string;
  }>>;
}

const ClientInfoStep: React.FC<ClientInfoStepProps> = ({ clientInfo, setClientInfo }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setClientInfo(prev => ({ ...prev, [name]: checked }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setClientInfo(prev => ({
      ...prev,
      currentSymptoms: prev.currentSymptoms.includes(symptom)
        ? prev.currentSymptoms.filter(s => s !== symptom)
        : [...prev.currentSymptoms, symptom]
    }));
  };

  const isSymptomSelected = (symptom: string) => {
    return clientInfo.currentSymptoms.includes(symptom);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-3 py-2 bg-therapeutic-50 text-therapeutic-700 rounded-md">
        <ShieldCheck className="h-5 w-5" />
        <p className="text-sm">
          This information is kept private and is only shared with your therapist to help prepare for your session.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="mainConcern">What brings you to therapy? <span className="text-red-500">*</span></Label>
          <Textarea 
            id="mainConcern"
            name="mainConcern"
            placeholder="Please briefly describe your main concerns or issues you'd like to address"
            value={clientInfo.mainConcern}
            onChange={handleChange}
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Current symptoms (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {["Anxiety", "Depression", "Stress", "Insomnia", "Panic attacks", "Mood swings", 
              "Irritability", "Fatigue", "Concentration issues", "Grief", "Trauma responses", "Social isolation"]
              .map(symptom => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`symptom-${symptom}`} 
                    checked={isSymptomSelected(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                  />
                  <Label htmlFor={`symptom-${symptom}`} className="text-sm cursor-pointer">
                    {symptom}
                  </Label>
                </div>
              ))
            }
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptomDuration">How long have you been experiencing these concerns? <span className="text-red-500">*</span></Label>
          <Select 
            value={clientInfo.symptomDuration} 
            onValueChange={(value) => handleSelectChange("symptomDuration", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Less than a month</SelectItem>
              <SelectItem value="short">1-3 months</SelectItem>
              <SelectItem value="medium">3-6 months</SelectItem>
              <SelectItem value="long">6-12 months</SelectItem>
              <SelectItem value="chronic">More than a year</SelectItem>
              <SelectItem value="lifetime">Throughout life</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="copingStrategies">Current coping strategies</Label>
          <Textarea 
            id="copingStrategies"
            name="copingStrategies"
            placeholder="What strategies have you been using to manage your concerns so far?"
            value={clientInfo.copingStrategies}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prevTherapy">Previous therapy experience (if any)</Label>
          <Textarea 
            id="prevTherapy"
            name="prevTherapy"
            placeholder="Have you been in therapy before? If so, what was your experience like? What worked or didn't work?"
            value={clientInfo.prevTherapy}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mentalHealthHistory">Mental health history</Label>
          <Textarea 
            id="mentalHealthHistory"
            name="mentalHealthHistory"
            placeholder="Any history of mental health diagnoses or significant mental health events"
            value={clientInfo.mentalHealthHistory}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="physicalHealthConditions">Physical health conditions</Label>
          <Textarea 
            id="physicalHealthConditions"
            name="physicalHealthConditions"
            placeholder="Any physical health conditions that might be relevant to your mental wellbeing"
            value={clientInfo.physicalHealthConditions}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="therapyGoals">What are your goals for therapy? <span className="text-red-500">*</span></Label>
          <Textarea 
            id="therapyGoals"
            name="therapyGoals"
            placeholder="What would you like to achieve through therapy? What changes are you hoping to see?"
            value={clientInfo.therapyGoals}
            onChange={handleChange}
            className="min-h-[80px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medications">Current medications (if any)</Label>
          <Input 
            id="medications"
            name="medications"
            placeholder="List any medications you're currently taking, including dosage if known"
            value={clientInfo.medications}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sleepQuality">Sleep quality</Label>
            <Select 
              value={clientInfo.sleepQuality} 
              onValueChange={(value) => handleSelectChange("sleepQuality", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sleep quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="very-poor">Very Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dietaryHabits">Dietary habits</Label>
            <Input 
              id="dietaryHabits"
              name="dietaryHabits"
              placeholder="Brief description of your eating patterns"
              value={clientInfo.dietaryHabits}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exerciseRoutine">Exercise routine</Label>
            <Input 
              id="exerciseRoutine"
              name="exerciseRoutine"
              placeholder="Type and frequency of physical activity"
              value={clientInfo.exerciseRoutine}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="substanceUse">Substance use</Label>
            <Input 
              id="substanceUse"
              name="substanceUse"
              placeholder="Alcohol, caffeine, tobacco, other substances"
              value={clientInfo.substanceUse}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stressors">Current stressors</Label>
          <Textarea 
            id="stressors"
            name="stressors"
            placeholder="Major stressors in your life right now (work, relationships, financial, etc.)"
            value={clientInfo.stressors}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportSystem">Support system</Label>
          <Textarea 
            id="supportSystem"
            name="supportSystem"
            placeholder="Who makes up your support network? (family, friends, community, etc.)"
            value={clientInfo.supportSystem}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency contact (optional)</Label>
          <Input 
            id="emergencyContact"
            name="emergencyContact"
            placeholder="Name and phone number of an emergency contact"
            value={clientInfo.emergencyContact}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredApproach">Preferred therapy approach</Label>
          <Select 
            value={clientInfo.preferredApproach} 
            onValueChange={(value) => handleSelectChange("preferredApproach", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a therapy approach if you have a preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cbt">Cognitive Behavioral Therapy (CBT)</SelectItem>
              <SelectItem value="psychodynamic">Psychodynamic Therapy</SelectItem>
              <SelectItem value="humanistic">Humanistic Therapy</SelectItem>
              <SelectItem value="mindfulness">Mindfulness-Based Therapy</SelectItem>
              <SelectItem value="eclectic">Eclectic/Integrative Approach</SelectItem>
              <SelectItem value="unsure">Not sure / Open to recommendations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="communicationPreference">Communication preference during sessions</Label>
          <RadioGroup 
            value={clientInfo.communicationPreference} 
            onValueChange={(value) => handleSelectChange("communicationPreference", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct">Direct and straightforward</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gentle" id="gentle" />
              <Label htmlFor="gentle">Gentle and supportive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="questioning" id="questioning" />
              <Label htmlFor="questioning">Questioning and exploratory</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="consentToNotes" 
            checked={clientInfo.consentToNotes}
            onCheckedChange={(checked) => 
              handleCheckboxChange("consentToNotes", checked === true)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="consentToNotes" className="text-sm cursor-pointer">
              I consent to my therapist taking confidential notes during our sessions to help 
              with my treatment plan.
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-md mt-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Fields marked with <span className="text-red-500">*</span> are required. You can update this information later if needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoStep;
