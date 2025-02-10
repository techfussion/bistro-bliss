'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MainLayout from '@/app/admin/components/main-layout';
import Header from '../../components/header';
import MenuItemForm from '../../components/menu-item-form';
import { AdminGuard } from '@/components/hoc/admin-gaurd';

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState([
    { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Pizza', description: 'Classic tomato and mozzarella', isAvailable: true },
    { id: 2, name: 'Pepperoni Pizza', price: 14.99, category: 'Pizza', description: 'Spicy pepperoni with cheese', isAvailable: true },
    { id: 3, name: 'Caesar Salad', price: 8.99, category: 'Salads', description: 'Fresh romaine lettuce with caesar dressing', isAvailable: true },
  ]);

  interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    isAvailable: boolean;
  }
  
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSaveItem = (formData: any) => {
    if (editItem) {
      setItems(items.map(item => 
        item.id === editItem?.id ? { ...item, ...formData } : item
      ));
      setEditItem(null);
    } else {
      setItems([...items, { ...formData, id: items.length + 1 }]);
    }
    setIsAddDialogOpen(false);
  };

  const handleDeleteItem = (id: any) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <MainLayout>
        <Header
            activePage='Menu'
            actionButton={
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button size='sm' className="flex items-center gap-2 text-xs bg-red-700 hover:bg-red-700/90">
                        <Plus className="w-4 h-4" />
                        Add Menu Item
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle className='text-sm'>{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                    </DialogHeader>
                    <MenuItemForm
                    initialData={editItem}
                    onSave={handleSaveItem}
                    onCancel={() => {
                        setEditItem(null);
                        setIsAddDialogOpen(false);
                    }}
                    />
                </DialogContent>
            </Dialog>
        }
        />
        <div className="mt-6 space-y-6">
            <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className='text-xs' value="all">All Categories</SelectItem>
                    <SelectItem className='text-xs' value="Pizza">Pizza</SelectItem>
                    <SelectItem className='text-xs' value="Salads">Salads</SelectItem>
                    <SelectItem className='text-xs' value="Beverages">Beverages</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items
                .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                .map((item) => (
                    <Card key={item.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold">{item.name}</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                setEditItem(item);
                                setIsAddDialogOpen(true);
                                }}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                        <p className="text-xs text-gray-500">{item.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-xs">${item.price.toFixed(2)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                            item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </MainLayout>
  );
};

export default AdminGuard(MenuManagement);