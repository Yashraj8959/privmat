"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Example display

const BreachChecker = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breaches, setBreaches] = useState(null); // null initially, array after check

  const handleCheckBreaches = async () => {
    setIsLoading(true);
    setError(null);
    setBreaches(null); // Reset previous results

    try {
      const response = await fetch('/api/breaches/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBreaches(data.breaches);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Check for Data Breaches</CardTitle>
        <CardDescription>Enter an email address to see if it has been exposed in known data breaches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleCheckBreaches} disabled={isLoading}>
            {isLoading ? "Checking..." : "Check"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">Error: {error}</p>}

        {/* Display Results */}
        {breaches !== null && (
          <div className="mt-4">
            {breaches.length === 0 ? (
              <p className="text-green-600">No breaches found for this email address.</p>
            ) : (
              <div>
                <h4 className="font-semibold mb-2">Breaches Found ({breaches.length}):</h4>
                <Accordion type="single" collapsible className="w-full">
                  {breaches.map((breach, index) => (
                    <AccordionItem value={`item-${index}`} key={breach.id || index}>
                      <AccordionTrigger>{breach.name} ({breach.date})</AccordionTrigger>
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