// components/Vault.jsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Vault = () => {
  const [vaultItems, setVaultItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVaultItem, setNewVaultItem] = useState({
    website: "",
    username: "",
    password: "",
    notes: "",
  });

  useEffect(() => {
    // Fetch vault items when the component mounts
    const fetchVaultItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/vault');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVaultItems(data);
      } catch (err) {
        console.error("Failed to fetch vault items:", err);
        setError(err.message || "Failed to fetch vault items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultItems();
  }, []); // Empty dependency array means this runs only once on component mount

  const handleInputChange = (e) => {
    setNewVaultItem({ ...newVaultItem, [e.target.name]: e.target.value });
  };

  const handleCreateVaultItem = async () => {
    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVaultItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the vault items after creating a new one
      const data = await response.json()
      setVaultItems(prevItems => [...prevItems, data]) //Appending data

    } catch (error) {
      console.error("Error creating vault item:", error);
      setError(error.message || "Failed to create vault item");
    } finally {
      setNewVaultItem({ website: "", username: "", password: "", notes: "" });
       // Clear the input fields
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Data Vault</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p>Loading vault items...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Display Vault Items */}
        {vaultItems.length > 0 ? (
          <ul>
            {vaultItems.map((item,key) => (
              <li key={key} className="border rounded-md p-4">
                <p><strong>Website:</strong> {item.website}</p>
                <p><strong>Username:</strong> {item.username}</p>
                 <p><strong>Password:</strong> {item.encryptedPassword}</p>
                  <p><strong>Notes:</strong> {item.notes}</p>
                {/* Add more details here */}
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p>No vault items found.</p>
        )}

        {/* Add New Vault Item Form */}
        <div>
          <h3 className="text-lg font-semibold">Add New Item</h3>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                type="text"
                id="website"
                name="website"
                value={newVaultItem.website}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={newVaultItem.username}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={newVaultItem.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                type="text"
                id="notes"
                name="notes"
                value={newVaultItem.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateVaultItem}>Create Vault Item</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Vault;