
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Check } from "lucide-react";

interface AnonymousIdStepProps {
  anonymousId: string;
  generateId: () => void;
}

const AnonymousIdStep: React.FC<AnonymousIdStepProps> = ({ 
  anonymousId, 
  generateId 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Generate Anonymous ID</h3>
      <p className="text-sm text-muted-foreground mb-4">
        To protect your privacy, we'll generate a unique anonymous ID for your booking. 
        This ID will be used for your appointment instead of your personal information.
      </p>
      
      <div className="flex items-center space-x-2">
        <Input 
          value={anonymousId} 
          readOnly 
          placeholder="Your anonymous ID will appear here"
          className="flex-1"
        />
        <Button 
          onClick={generateId} 
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Shield className="h-4 w-4" />
          <span>Generate ID</span>
        </Button>
      </div>
      
      {anonymousId && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Anonymous ID Generated Successfully
              </p>
              <p className="text-xs text-green-700 mt-1">
                Your identity is protected. Please save this ID for reference: <span className="font-mono bg-white px-1 py-0.5 rounded">{anonymousId}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnonymousIdStep;
