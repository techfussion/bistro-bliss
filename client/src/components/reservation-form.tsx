"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import apiClient from "@/interceptor/axios.interceptor";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const schema = z.object({
  date: z.date().refine((value) => value !== undefined, "Please select a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
  partySize: z.number().nonnegative().max(20, "Sorry we can't handle above 20 people"),
  notes: z.string().max(160, { message: "Note must not be longer than 160 characters." }), // Changed from note to notes
});

type ReservationFormData = z.infer<typeof schema>;

export default function ReservationForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const { auth, setAuth } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const token = localStorage.getItem('token')

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      notes: "",
    }
  });

  const onSubmit: SubmitHandler<ReservationFormData> = async (data) => {
    if (!auth.isLoggedIn){
      toast({
        variant: "destructive",
        description: `You need to be logged in to make reservation.`,
      })

      router.push('/login')
      
      return;
    }

    try {
      setLoading(true);
      
      // Create an ISO date string by combining date and time
      const dateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const requestData = {
        ...data,
        time: dateTime.toISOString(), // Convert to ISO 8601 format
      };

      await apiClient.post(`/reservations`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        variant: "default",
        description: `Reservation made.`,
      })

      // reset the form
      form.reset();
    } catch (error: any) {
        toast({
          variant: 'destructive',
          description: `Failed to make reservation: ${error.message}`
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 bg-white rounded-2xl shadow-xl max-w-lg mx-auto relative -top-16">
        <div className="flex justify-between gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs font-semibold">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left rounded-full ${field.value ? "" : "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "MM/dd/yyyy") : "Select Date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs font-semibold">Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={field.value}
                    className="rounded-full"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="partySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Party Size</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter total persons"
                  value={field.value}
                  className="rounded-full"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value || /^\d+$/.test(value)) {
                      field.onChange(parseInt(value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Note (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Give use some additional information"
                  className="rounded-2xl"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                This could be information that'll help us serve you better.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-700/90 text-white rounded-full"
        >
          {loading ? "Booking..." : "Book A Table"}
        </Button>
      </form>
    </Form>
  );
}