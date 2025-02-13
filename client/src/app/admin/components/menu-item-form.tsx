'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface MenuItem {
  id?: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  isAvailable: boolean;
}

const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  isAvailable: z.boolean(),
});

export type MenuItemSchema = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  initialData?: MenuItem | null;
  categories: Category[];
  onSave: (data: MenuItem) => void;
  onCancel: () => void;
}

export default function MenuItemForm({ initialData, categories, onSave, onCancel }: MenuItemFormProps) {
  const form = useForm<MenuItem>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      categoryId: "",
      description: "",
      isAvailable: true,
    },
  });

  const { handleSubmit, control, formState: { isSubmitting } } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <FormField control={control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter menu item name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={control} name="price" render={({ field }) => (
          <FormItem>
            <FormLabel>Price (₦)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                placeholder="Enter price" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Enter description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={control} name="isAvailable" render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <input 
                type="checkbox" 
                checked={field.value} 
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="!mt-0">Available</FormLabel>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}