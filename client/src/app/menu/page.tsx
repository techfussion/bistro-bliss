"use client";

import { useState, useEffect, Fragment } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/header';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import apiClient from '@/interceptor/axios.interceptor';
import menuItemImg from '@/assets/images/menuItemImg1.png';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  categoryId: string;
  isAvailable: boolean;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

const MenuPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { cart, setCart } = useCart();
  const token = localStorage.getItem('token');

  const fetchMenuItems = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/menu/items?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { meta, data } = response.data;
      
      const categoryMap: { [key: string]: MenuCategory } = {};
      data.forEach((item: any) => {
        if (!categoryMap[item.category.id]) {
          categoryMap[item.category.id] = { id: item.category.id, name: item.category.name, items: [] };
        }
        categoryMap[item.category.id].items.push(item);
      });
      
      setCategories(Object.values(categoryMap));
      setTotalPages(meta.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const existingItemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += 1;
      
      setCart({
        items: updatedItems,
        total: cart.total + item.price
      });
    } else {
      // New item to cart
      setCart({
        items: [...cart.items, { 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          quantity: 1 
        }],
        total: cart.total + item.price
      });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    pages.push(1);
    
    let start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    
    if (end === totalPages) {
      start = Math.max(2, totalPages - maxPagesToShow + 1);
    }
    
    for (let i = start; i < end && i < totalPages; i++) {
      pages.push(i);
    }
    
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

  return (
    <Fragment>
      <Header />
      <main className="p-6 px-24 bg-silk-50 min-h-screen">
        <div className="flex flex-col items-center mx-auto w-1/2 gap-4 z-10 mb-8">
          <h1 className="text-6xl text-dark-700 font-serif tracking-wider">Our Menu</h1>
          <p className="text-dark-100 text-sm text-center w-2/3">
            We consider all the drivers of change gives you the components you need to change to create a truly happens.
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={(val) => setSelectedCategory(val === 'all' ? null : val)}>
          <TabsList className="gap-2 mb-8 flex justify-center bg-silk-50">
            <TabsTrigger value="all" className="w-max rounded-full px-6 border hover:bg-red-50">
              All
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="w-max rounded-full px-6 border hover:bg-red-50">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* {(selectedCategory ? categories.filter(cat => cat.id === selectedCategory) : categories).map(category => ( */}
          {(selectedCategory
            ? categories.filter(cat => cat.id === selectedCategory)
            : [{ id: "all", name: "All", items: categories.flatMap(cat => cat.items) }]
          ).map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-6">
                {category.items.slice((currentPage - 1) * 9, currentPage * 9).map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow max-w-[250px] rounded-lg transition duration-500 hover:translate-y-3 cursor-pointer hover:scale-105">
                    {/* {item.image && ( */}
                      <div className="h-48 overflow-hidden">
                        <Image 
                          src={menuItemImg}
                          alt='default' 
                          width={300}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                    {/* )} */}
                    <CardContent className='flex flex-col items-center gap-y-4'>
                      <p className='text-red-700 font-semibold mt-6 font-serif'>₦ {item.price}</p>
                      <p className='font-semibold'>{item.name}</p>
                      <p className="text-dark-50 text-sm text-center">{item.description}</p>
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable}
                        variant='link'
                        className='font-serif text-red-700 italic text-xs font-medium'
                      >
                        {item.isAvailable ? 'Add to Basket' : 'Unavailable'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
    </Fragment>
  );
};

export default MenuPage;
