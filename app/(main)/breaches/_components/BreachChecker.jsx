"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Example display
import toast from 'react-hot-toast'; // Optional for notifications
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import axios from 'axios'; // Optional for API calls

const BreachChecker = () => {
  const [emailToCheck, setEmailToCheck] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breachResults, setBreachResults] = useState(null); // Stores results from direct API call

  const handlePublicCheck = async () => {
    if (!emailToCheck || !/\S+@\S+\.\S+/.test(emailToCheck)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setBreachResults(null);
  
    try {
      const response = await axios.get(`/api/breaches/check-new-email?email=${emailToCheck}`);
      const data = response.data;
  
      if (data.Error === "Not found") {
        setBreachResults([]); // No breaches
        toast.success("No breaches found for this email.");
        return;
      }
  
      if (data.Error) {
        throw new Error(data.Error);
      }
  
      let breachesFound = [];
      if (data.ExposedBreaches?.breaches_details?.length > 0) {
        breachesFound = data.ExposedBreaches.breaches_details.map((detail) => ({
          name: detail.breach,
          date: detail.xposed_date
            ? new Date(parseInt(detail.xposed_date, 10), 0, 1).toISOString().split('T')[0]
            : 'N/A',
          description: detail.details || "No description available.",
          compromisedData: detail.xposed_data?.split(';') || [],
        }));
      }
  
      setBreachResults(breachesFound);
    } catch (err) {
      const message =
        err.response?.data?.Error ||
        err.response?.data?.message ||
        err.message ||
        "Unknown error";
      console.error("Error checking breaches:", message);
      setError(message);
      toast.error(`Error: ${message}`);
      setBreachResults(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (

    
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Check Any Email for Data Breaches</CardTitle>
        <CardDescription>Instantly check if an email address to see if it has been exposed in known data breaches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2 mb-4">
          <Input
            type="email"
            placeholder="Enter email address"
            value={emailToCheck}
            onChange={(e) => setEmailToCheck(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handlePublicCheck} disabled={isLoading}>
            {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
            {isLoading ? "Checking..." : "Check"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">Error: {error}</p>}

        {/* Display Results */}
        {breachResults !== null && (
          <div className="mt-4">
            {breachResults.length === 0 ? (<p className="text-green-600 flex items-center"><ShieldCheck className='mr-2'/> <span> No breaches found for this email.</span> </p>
            ) : (
              <div>
                <h4 className="font-semibold text-amber-500 mb-2 flex items-center"><ShieldAlert className='mr-2'/> <span>Warning:  {breachResults.length} Breaches Found</span></h4>
                <Accordion type="single" collapsible className="w-full">
                  {breachResults.map((breach, index) => (
                    <AccordionItem value={`item-${index}`} key={breach.id || index}>
                      <AccordionTrigger className={"text-"}>{breach.name} ({breach.date})</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{breach.description || "No description available."}</p>
                        <strong>Compromised Data:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {breach.compromisedData.length > 0 ? breach.compromisedData.map((data, i) => <li key={i}>{data}</li>) : <li>Data types not specified.</li>}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreachChecker;