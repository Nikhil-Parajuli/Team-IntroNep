
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Calendar, Clock, ShieldCheck } from "lucide-react";

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Verified Therapists
          </CardTitle>
          <UserCheck className="h-4 w-4 text-therapeutic-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">142</div>
          <p className="text-xs text-muted-foreground">
            Professionals on the platform
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sessions Booked
          </CardTitle>
          <Calendar className="h-4 w-4 text-therapeutic-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,856</div>
          <p className="text-xs text-muted-foreground">
            Total appointments made
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Session Length
          </CardTitle>
          <Clock className="h-4 w-4 text-therapeutic-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">52 min</div>
          <p className="text-xs text-muted-foreground">
            Average appointment time
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Anonymous Bookings
          </CardTitle>
          <ShieldCheck className="h-4 w-4 text-therapeutic-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">100%</div>
          <p className="text-xs text-muted-foreground">
            Complete privacy protection
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
