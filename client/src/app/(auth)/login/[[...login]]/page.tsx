'use client';

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "@/interceptor/axios.interceptor";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";

// Define validation schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
});

// Define form data type
type LoginFormData = z.infer<typeof formSchema>;

export default function Login() {
  const { toast } = useToast();
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/auth/login`, data);
  
      // Extract token and user data
      const { token, user } = response.data;
  
      // Set credentials in AuthContext and localStorage
      setAuth({ isLoggedIn: true, user: user });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user details
  
      toast({
        variant: "default",
        description: `Login successful. Welcome back, ${user.firstName}!`,
      });
  
      // Redirect to dashboard
      router.push(user.role === "ADMIN" ? "/admin" : "/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Login failed. ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="min-h-screen bg-silk-50">
      <Header />
      <main className="flex justify-center items-center pt-16">
        <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center mb-2 font-serif">Welcome Back!</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" className="w-full rounded-full bg-red-700" disabled={loading}>
                {
                  loading
                  ? 'Logging in...'
                  : 'Login'
                }
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
    
  );
};