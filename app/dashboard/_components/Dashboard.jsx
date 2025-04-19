// app/dashboard/page.jsx (or wherever your dashboard component lives)

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  LayoutGrid,
  ShieldAlert,
  Lock,
  FileText, // For Fake Data Presets (example)
  ArrowRight,
  TrendingUp, // Example for Tips
} from "lucide-react";
import clsx from "clsx";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress"; // Import Progress for risk visualization

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/dashboard/summary")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setSummaryData(data))
      .catch(err => {
        console.error("Failed to fetch dashboard summary:", err);
        setError(err.message || "Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Risk Styling Helpers ---
  const getRiskColorClass = (level, type = 'text') => { // type can be 'text', 'border', 'bg'
    const levelLower = level?.toLowerCase();
    switch (type) {
      case 'border':
        if (levelLower === 'critical') return 'border-red-700 dark:border-red-500';
        if (levelLower === 'high') return 'border-red-600 dark:border-red-400';
        if (levelLower === 'medium') return 'border-yellow-500 dark:border-yellow-400'; // Adjusted yellow
        if (levelLower === 'low') return 'border-green-600 dark:border-green-400';
        return 'border-gray-500 dark:border-gray-600';
      case 'bg':
        if (levelLower === 'critical') return 'bg-red-100 dark:bg-red-900/30';
        if (levelLower === 'high') return 'bg-red-100 dark:bg-red-900/30';
        if (levelLower === 'medium') return 'bg-yellow-100 dark:bg-yellow-800/30'; // Adjusted yellow
        if (levelLower === 'low') return 'bg-green-100 dark:bg-green-900/30';
        return 'bg-gray-100 dark:bg-gray-800';
      case 'progress': // For ShadCN Progress component
        if (levelLower === 'critical') return 'bg-red-700 dark:bg-red-500';
        if (levelLower === 'high') return 'bg-red-600 dark:bg-red-400';
        if (levelLower === 'medium') return 'bg-yellow-500 dark:bg-yellow-400'; // Adjusted yellow
        if (levelLower === 'low') return 'bg-green-600 dark:bg-green-400';
        return 'bg-gray-500 dark:bg-gray-600';
      default: // text
        if (levelLower === 'critical') return 'text-red-700 dark:text-red-500';
        if (levelLower === 'high') return 'text-red-600 dark:text-red-400';
        if (levelLower === 'medium') return 'text-yellow-600 dark:text-yellow-500'; // Adjusted yellow
        if (levelLower === 'low') return 'text-green-600 dark:text-green-400';
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const username = user?.firstName || user?.username || "User";

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
            <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
            <DotLottieReact
            src="/loader.lottie" // Find a relevant Lottie animation
            loop
            autoplay
            style={{ width: '100%', height: '100%'}}
            />
            </div>;
    </div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">Error: {error}</p></div>;
  }

  // Default values if summaryData is null
  const trackedAppsCount = summaryData?.trackedAppsCount ?? 0;
  const vaultItemsCount = summaryData?.vaultItemsCount ?? 0;
  const userBreachesCount = summaryData?.userBreachesCount ?? 0;
  const overallRisk = summaryData?.overallRisk ?? { score: 0, level: 'Low' };
  // Assuming max possible score is around 30 for percentage calculation
  const maxRiskScore = 30;
  const riskPercentage = Math.min(100, Math.max(0, (overallRisk.score / maxRiskScore) * 100));


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"> {/* Adjusted grid */}

      {/* --- Welcome Banner (Spans more columns) --- */}
      <Card className="lg:col-span-2 xl:col-span-3 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-semibold mb-1">
              Welcome back, {username}! 👋
            </h2>
            <p className="text-muted-foreground mb-4">Your personalized privacy dashboard.</p>
             {/* Maybe link to a report page later */}
            {/* <Link href="/privacy-report">
               <Button variant="secondary">View Privacy Report</Button>
            </Link> */}
          </div>
          <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
            <DotLottieReact
              src="/loader.lottie" // Find a relevant Lottie animation
              loop
              autoplay
              style={{ width: '100%', height: '100%'}}
            />
          </div>
        </CardContent>
      </Card>

      {/* --- Overall Risk Card (More prominent) --- */}
      <Card className={`lg:col-span-1 xl:col-span-1 rounded-xl shadow-sm border-2 ${getRiskColorClass(overallRisk.level, 'border')} ${getRiskColorClass(overallRisk.level, 'bg')}`}>
         <CardHeader>
           <CardTitle className="text-center text-sm font-medium text-muted-foreground">Overall Risk Score</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-2 flex flex-col items-center">
           <div className={`text-6xl font-bold mb-2 ${getRiskColorClass(overallRisk.level, 'text')}`}>
               {overallRisk.score}
           </div>
           <Progress value={riskPercentage} className={`w-full h-2 mb-3 [&>*]:${getRiskColorClass(overallRisk.level, 'progress')}`} />
           <p className={`font-semibold text-lg ${getRiskColorClass(overallRisk.level, 'text')}`}>
            {overallRisk.level} Risk
           </p>
           <Link href="/apps" className="mt-4">
              <Button variant="link" size="sm" className={getRiskColorClass(overallRisk.level, 'text')}>
                Review Apps <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
           </Link>
        </CardContent>
      </Card>


      {/* --- Metric Cards (Improved Layout) --- */}
      <Card className="rounded-xl shadow-sm">
         <CardHeader>
           <CardTitle className="text-sm font-medium text-muted-foreground">Tracked Apps</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between gap-4">
             <LayoutGrid className="h-10 w-10 text-blue-500 flex-shrink-0" />
             <div className="text-right">
                <h3 className="text-4xl font-bold mb-1">{trackedAppsCount}</h3>
                <Link href="/apps">
                   <Button variant="link" size="sm">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
         <CardHeader>
           <CardTitle className="text-sm font-medium text-muted-foreground">Affected by Breaches</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-0">
           <div className="flex items-center justify-between gap-4">
             <ShieldAlert className={`h-10 w-10 flex-shrink-0 ${userBreachesCount > 0 ? 'text-rose-600' : 'text-gray-400'}`} />
             <div className="text-right">
                <h3 className={`text-4xl font-bold mb-1 ${userBreachesCount > 0 ? 'text-rose-600' : ''}`}>{userBreachesCount}</h3>
                 <Link href="/breaches">
                   <Button variant="link" size="sm">Check Now <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
         <CardHeader>
           <CardTitle className="text-sm font-medium text-muted-foreground">Vault Items</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between gap-4">
            <Lock className="h-10 w-10 text-purple-600 flex-shrink-0" />
             <div className="text-right">
                <h3 className="text-4xl font-bold mb-1">{vaultItemsCount}</h3>
                 <Link href="/data-vault">
                   <Button variant="link" size="sm">Open Vault <ArrowRight className="ml-1 h-4 w-4" /></Button>
                 </Link>
             </div>
           </div>
        </CardContent>
      </Card>

      {/* Placeholder for Fake Data Presets count */}
      {/* <Card className="rounded-xl shadow-sm"> ... </Card> */}


      {/* --- Privacy Tips (Spans columns on some layouts) --- */}
       <Card className="lg:col-span-3 xl:col-span-4 rounded-xl shadow-sm"> {/* Adjust span as needed */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Privacy Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Make these dynamic later */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
             <LayoutGrid className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"/>
             <p className="text-sm text-muted-foreground">Regularly review permissions and data shared with your <Link href="/apps" className="font-medium text-primary hover:underline">Tracked Apps</Link>.</p>
          </div>
           <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
             <ShieldAlert className="h-5 w-5 text-rose-500 mt-1 flex-shrink-0"/>
             <p className="text-sm text-muted-foreground">Check for new <Link href="/breaches" className="font-medium text-primary hover:underline">Data Breaches</Link> that might affect your linked accounts.</p>
          </div>
           <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
             <Lock className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0"/>
             <p className="text-sm text-muted-foreground">Use strong, unique passwords for each service and store them securely in your <Link href="/data-vault" className="font-medium text-primary hover:underline">Data Vault</Link>.</p>
          </div>
           <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
             <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/> {/* Example icon */}
             <p className="text-sm text-muted-foreground">Utilize the <Link href="/fake-data" className="font-medium text-primary hover:underline">Fake Data Generator</Link> when signing up for non-essential services.</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}