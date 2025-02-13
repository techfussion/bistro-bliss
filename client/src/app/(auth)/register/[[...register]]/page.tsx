'use client';

import React, { Fragment, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/interceptor/axios.interceptor";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";

// Define validation schema with Zod
const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    firstName: z.string().min(3, { message: "Firstname must be at least 3 characters" }),
    lastName: z.string().min(3, { message: "Lastname must be at least 3 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })

// Define form data type
type SignupFormData = z.infer<typeof formSchema>;

export default function Register() {
  const { toast } = useToast();
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  
  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/auth/register`, data);
  
      // Extract token and user data
      const { token, user } = response.data;
  
      // Set credentials in AuthContext and localStorage
      setAuth({ isLoggedIn: true, user: user });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user details
  
      toast({
        variant: "default",
        description: `Account Created.`,
      });
  
      // Redirect to dashboard
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Signup failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-silk-50">
      <Header />
      <main className="flex justify-center items-center mt-12">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-2 font-serif">Welcome!</h2>

        {/* Form */}
        <div className="max-h-80 overflow-y-auto px-1">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {/* Firstname Field */}
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-xs font-semibold">First Name</FormLabel>
                    <FormControl className="rounded-lg">
                        <Input placeholder="Enter your firstname" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Lastname Field */}
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-xs font-semibold">Last Name</FormLabel>
                    <FormControl className="rounded-lg">
                        <Input placeholder="Enter your lastname" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Email Field */}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-xs font-semibold">Email</FormLabel>
                    <FormControl className="rounded-lg">
                        <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Password Field */}
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-xs font-semibold">Password</FormLabel>
                    <FormControl className="rounded-lg">
                        <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-red-700 rounded-full" disabled={loading}>
                 {
                    loading
                    ? 'Signing up...'
                    : 'Sign Up'
                 }
                </Button>
            </form>
            </Form>
        </div>
        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-4">
          &copy; <span className="font-serif">Bistro_Bliss</span>. All rights reserved.
        </p>
      </div>
      </main>
    </div>
  );
};