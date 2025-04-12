
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SessionTypeStepProps {
  sessionType: string;
  setSessionType: (value: string) => void;
}

const SessionTypeStep: React.FC<SessionTypeStepProps> = ({ 
  sessionType, 
  setSessionType 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose Session Type</h3>
      <RadioGroup value={sessionType} onValueChange={setSessionType}>
        <div className="flex items-start space-x-2 rounded-md border p-4">
          <RadioGroupItem value="individual" id="individual" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="individual" className="font-medium cursor-pointer">
              Individual Session
            </Label>
            <p className="text-sm text-muted-foreground">
              One-on-one therapy session focused on your specific needs
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 rounded-md border p-4">
          <RadioGroupItem value="group" id="group" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="group" className="font-medium cursor-pointer">
              Group Session
            </Label>
            <p className="text-sm text-muted-foreground">
              Therapy in a supportive group environment with shared experiences
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 rounded-md border p-4">
          <RadioGroupItem value="eap" id="eap" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="eap" className="font-medium cursor-pointer">
              Employee Assistance Program (EAP)
            </Label>
            <p className="text-sm text-muted-foreground">
              Session provided through your employer's assistance program
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SessionTypeStep;
