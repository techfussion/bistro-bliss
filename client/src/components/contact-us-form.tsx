"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "./ui/textarea";

const contactFormSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    subject: z.string().nonempty("Subject is required"),
    message: z
      .string()
      .nonempty("Message cannot be empty")
      .max(160, "Message must not be longer than 160 characters"),
  });
  

export default function ContactUsForm() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 bg-white rounded-2xl shadow-xl max-w-lg mx-auto">
        <div className="flex justify-between gap-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    className="rounded-full"
                    {...field}
                  />
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
              <FormItem className="w-full">
                <FormLabel className="text-xs font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    className="rounded-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Subject</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Enter the subject"
                    className="rounded-full"
                    {...field}
                    />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Message</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Enter your message"
                    className="rounded-lg"
                    {...field}
                    />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-red-700 hover:bg-red-700/90 text-white rounded-full">
          Send
        </Button>
      </form>

      <div className="flex gap-6 justify-between mt-12 px-6">
        <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold">Call Us:</h3>
            <p className="text-xs text-red-700">+234-9069209111</p>
        </div>
        <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold">Hours:</h3>
            <p className="text-xs text-dark-700 leading-loose">Mon-Fri: 11am - 8pm <br /> Sat, Sun: 9am - 10pm</p>
        </div>
        <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold">Our Location:</h3>
            <p className="text-xs text-dark-700 leading-loose">123 Bridge Street Nowhere Land,<br /> LA 12345 United States</p>
        </div>
      </div>
    </Form>
  );
}
