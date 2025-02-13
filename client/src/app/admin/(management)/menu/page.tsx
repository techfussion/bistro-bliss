'use client';

import React, { useEffect, useState } from 'react';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import MainLayout from '@/app/admin/components/main-layout';
import Header from '../../components/header';
import MenuItemForm from '../../components/menu-item-form';
import { AdminGuard } from '@/components/hoc/admin-gaurd';
import apiClient from '@/interceptor/axios.interceptor';
import { useToast } from '@/hooks/use-toast';
import { CategoryForm } from '../../components/category-form';

interface MenuItem {
  id?: string;
  name: string;
  price: number;
  category: string;
  categoryId: string;
  description: string;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

const MenuManagement = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const token = localStorage.getItem('token');

  const fetchMenuItems = async (page = 1) => {
    try {
        setLoading(true);
  
        const response = await apiClient.get(`/menu/items?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const { meta, data } = response.data
        
        setItems(data)
        setTotalPages(meta.totalPages)
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  }

  const fetchCategories = async (page = 1) => {
    try {
        setLoading(true);
  
        const response = await apiClient.get(`/menu/categories?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const { data } = response.data
        
        setCategories(data)
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  }

  const updateMenuItem = async (data: MenuItem) => {
    try {
      setLoading(true);

      await apiClient.put(`/menu/items/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        description: `Menu item updated`,
      })  

      fetchMenuItems(currentPage);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: `Failed to update: ${err.message}`,
      })
    } finally {
        setLoading(false);
        setIsAddDialogOpen(false);
    }
  };

  const createCategory = async (data: { name: string }) => {
    try {
      setLoading(true);

      await apiClient.post(`/menu/categories`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        description: `Category created`,
      })  

      fetchCategories(1);
      setIsCategoryDialogOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: `Failed to create: ${err.message}`,
      })
    } finally {
        setLoading(false);
    }
  };

  const createMenuItem = async (data: MenuItem) => {
    try {
      setLoading(true);

      await apiClient.post(`/menu/items`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        description: `Menu item created`,
      })  

      fetchMenuItems(currentPage);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: `Failed to create: ${err.message}`,
      })
    } finally {
        setLoading(false);
        setIsAddDialogOpen(false);
    }
  };

  const deleteMenuItem = async (id: any) => {
    try {
      setLoading(true);

      await apiClient.delete(`/menu/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        description: `Menu item deleted`,
      })  

      fetchMenuItems(currentPage);
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: `Failed to delete: ${err.message}`,
      })
    } finally {
        setLoading(false);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end for middle pages
    let start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(2, totalPages - maxPagesToShow + 1);
    }
    
    // Add middle pages
    for (let i = start; i < end && i < totalPages; i++) {
      pages.push(i);
    }
    
    // Add last page if not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
      
    return pages;
  };

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      }
  };

  useEffect(() => {
    fetchMenuItems(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
      return (
        <MainLayout>
          <Header activePage='Reservations'/>
          <main className="p-6 space-y-4">
            <p className="text-xs">Loading menu...</p>
          </main>
        </MainLayout>
      );
  }

  if (items.length === 0) (
      <MainLayout>
          <Header activePage='Reservations' />
          <main>
              <p className="text-center text-gray-500">No menu item found.</p>
          </main>
      </MainLayout>
  )

  return (
    <MainLayout>
        <Header
          activePage='Menu'
          actionButton={
            <div className="flex gap-2">
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  onSave={createCategory}
                  onCancel={() => setIsCategoryDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
      
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="text-xs bg-red-700 hover:bg-red-700/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                </DialogHeader>
                <MenuItemForm
                  initialData={editItem}
                  categories={categories}
                  onSave={async (formData) => {
                    if (editItem) {
                      await updateMenuItem({ ...formData, id: editItem.id, category: editItem.category });
                    } else {
                      await createMenuItem({ ...formData, category: selectedCategory });
                    }
                  }}
                  onCancel={() => {
                    setEditItem(null);
                    setIsAddDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          }
        />
        <main className="mt-6 space-y-6">
            <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] text-xs">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className='text-xs' value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} className='text-xs' value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items
                .filter(item => selectedCategory === 'all' || item.categoryId === selectedCategory)
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
                          onClick={() => deleteMenuItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs">₦{item.price}</span>
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
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                      <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                  </PaginationItem>

                  {generatePageNumbers().map((page, index) => (
                      <PaginationItem key={page}>
                      {index > 0 && page - generatePageNumbers()[index - 1] > 1 && (
                          <PaginationEllipsis />
                      )}
                      <PaginationLink 
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                      >
                          {page}
                      </PaginationLink>
                      </PaginationItem>
                  ))}

                  <PaginationItem>
                      <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                  </PaginationItem>
                </PaginationContent>
            </Pagination>
          )}
        </main>
    </MainLayout>
  );
};

export default AdminGuard(MenuManagement);