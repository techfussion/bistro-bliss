'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

interface MenuItemFormProps {
    initialData: any;
    onSave: (formData: any) => void;
    onCancel: () => void;
}

const MenuItemForm = ({ initialData, onSave, onCancel }: MenuItemFormProps) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className='text-xs'>Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className='text-xs'>Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price" className='text-xs'>Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category" className='text-xs'>Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger className='text-xs'>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className='text-xs' value="Pizza">Pizza</SelectItem>
            <SelectItem className='text-xs' value="Salads">Salads</SelectItem>
            <SelectItem className='text-xs' value="Beverages">Beverages</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isAvailable"
          checked={formData.isAvailable}
          onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
          className='bg-red-700'
        />
        <Label htmlFor="isAvailable" className='text-xs'>Available</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button size='sm' className='text-xs' type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button size='sm' className='text-xs bg-red-700 hover:bg-red-700/90' type="submit">
          {initialData ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;