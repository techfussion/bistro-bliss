'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("1234567890");

  const handleUpdate = () => {
    // Handle user profile update logic here
    alert("Profile updated successfully");
  };

  return (
    <div>
        <Header />
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Card className="p-4">
                <CardContent className="space-y-4">
                <div>
                    <label className="block mb-1">First Name</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Last Name</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Email</label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Phone</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <Button onClick={handleUpdate}>Update Profile</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}