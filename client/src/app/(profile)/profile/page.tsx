// 'use client';

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Header from "@/components/header";
// import { CustomerGuard } from "@/components/hoc/customer-gaurd";

// function ProfilePage() {
//   const [firstName, setFirstName] = useState("John");
//   const [lastName, setLastName] = useState("Doe");
//   const [email, setEmail] = useState("john.doe@example.com");
//   const [phone, setPhone] = useState("1234567890");

//   const handleUpdate = () => {
//     // Handle user profile update logic here
//     alert("Profile updated successfully");
//   };

//   return (
//     <div>
//         <Header />
//         <div className="p-6 space-y-4 px-24">
        // <h1 className="text-xl font-bold font-serif text-red-700 italic">Profile</h1>
//         <Card className="p-4">
//                 <CardContent className="space-y-4">
//                 <div>
//                     <label className="block mb-1">First Name</label>
//                     <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                 </div>
//                 <div>
//                     <label className="block mb-1">Last Name</label>
//                     <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                 </div>
//                 <div>
//                     <label className="block mb-1">Email</label>
//                     <Input value={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//                 <div>
//                     <label className="block mb-1">Phone</label>
//                     <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
//                 </div>
//                 <Button onClick={handleUpdate}>Update Profile</Button>
//                 </CardContent>
//             </Card>
//         </div>
//     </div>
//   );
// }

// export default CustomerGuard(ProfilePage);

'use client';

import React, { Fragment, useState } from 'react';
import { 
  User, MapPin, Plus, Pencil, Trash2, 
  Phone, Mail, Check, X 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/header';
import { CustomerGuard } from '@/components/hoc/customer-gaurd';


const ProfilePage = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  // Sample user data
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 123 456 7890',
    addresses: [
      {
        id: '1',
        street: '123 Main Street',
        city: 'Lagos',
        state: 'Lagos State',
        postalCode: '100001',
        isDefault: true
      },
      {
        id: '2',
        street: '456 Side Road',
        city: 'Lagos',
        state: 'Lagos State',
        postalCode: '100002',
        isDefault: false
      }
    ]
  });

  return (
    <Fragment>
      <Header />
      <div className="py-6 px-24">
        <h1 className="text-xl font-bold font-serif text-red-700 italic">Profile</h1>
        <Card className='shadow-none border-none p-0'>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif italic font-bold flex items-center gap-2">
              basic
            </CardTitle>
            <Button 
              variant={editingProfile ? "ghost" : "outline"}
              size='sm'
              onClick={() => setEditingProfile(!editingProfile)}
            >
              {editingProfile ? (
                <span className="flex items-center gap-2">
                  <X className="h-2 w-2" /> Cancel
                </span>
              ) : (
                <span className="flex items-center gap-2 text-xs">
                  <Pencil className="h-2 w-2" /> Edit Profile
                </span>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {editingProfile ? (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className='text-xs font-semibold'>First Name</Label>
                    <Input id="firstName" defaultValue={user.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className='text-xs font-semibold'>Last Name</Label>
                    <Input id="lastName" defaultValue={user.lastName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className='text-xs font-semibold'>Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className='text-xs font-semibold'>Phone</Label>
                    <Input id="phone" defaultValue={user.phone} />
                  </div>
                  <div className="md:col-span-2">
                    <Button size='sm' className="mr-2 bg-red-700 hover:bg-red-700/90">
                      <Check className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className='text-xs font-semibold'>First Name</Label>
                    <p className="text-xs">{user.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className='text-xs font-semibold'>Last Name</Label>
                    <p className="text-xs">{user.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className='text-xs font-semibold'>Email</Label>
                    <p className="text-xs flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className='text-xs font-semibold'>Phone</Label>
                    <p className="text-xs flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none border-none p-0'>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif italic font-bold flex items-center gap-2">
              Addresses
            </CardTitle>
            <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
              <DialogTrigger asChild>
                <Button size='sm' className='text-xs bg-red-700 hover:bg-red-700/90'>
                  <Plus className="h-4 w-4 mr-2" /> Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className='text-sm'>Add New Address</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className='font-semibold text-xs'>Street Address</Label>
                    <Input id="street" placeholder="Enter street address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className='font-semibold text-xs'>City</Label>
                      <Input id="city" placeholder="Enter city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className='font-semibold text-xs'>State</Label>
                      <Input id="state" placeholder="Enter state" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className='font-semibold text-xs'>Postal Code</Label>
                    <Input id="postalCode" placeholder="Enter postal code" />
                  </div>
                  <div className="space-y-2">
                    <Label className='font-semibold text-xs'>Address Type</Label>
                    <RadioGroup defaultValue="home" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home" className='text-xs'>Home</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="work" id="work" />
                        <Label htmlFor="work" className='text-xs'>Work</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button size='sm' className='text-xs' variant="outline" onClick={() => setShowAddAddress(false)}>
                      Cancel
                    </Button>
                    <Button size='sm' className='text-xs bg-red-700 hover:bg-red-700/90'>Save Address</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-lg border ${
                    address.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{address.street}</p>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
    
  );
};

export default CustomerGuard(ProfilePage);