// "use client";

// import { 
//   Sheet, 
//   SheetContent, 
//   SheetHeader, 
//   SheetTitle, 
//   SheetFooter
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Trash2, Plus, Minus, ShoppingBasket } from 'lucide-react';
// import { useCart } from '@/context/CartContext';
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState } from "react";
// import { CheckoutSheet } from "./checkout-sheet";

// interface CartDrawerProps {
//     children?: React.ReactNode
// }

// export const CartDrawer = ({ children }: CartDrawerProps) => {
//   const [checkoutSheetOpen, setCheckoutSheetOpen] = useState<boolean>(false)
//   const { cart, setCart } = useCart();

//   const updateQuantity = (itemId: string, change: number) => {
//     const updatedItems = cart.items.map(item => 
//       item.id === itemId 
//         ? { 
//             ...item, 
//             quantity: Math.max(0, item.quantity + change)
//           } 
//         : item
//     ).filter(item => item.quantity > 0);

//     setCart({
//       items: updatedItems,
//       total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
//     });
//   };

//   const removeItem = (itemId: string) => {
//     const updatedItems = cart.items.filter(item => item.id !== itemId);
    
//     setCart({
//       items: updatedItems,
//       total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
//     });
//   };

//   return (
//     <Sheet>
//       {children}
//       <SheetContent className="w-[400px] sm:w-[540px]">
//         <SheetHeader>
//           <SheetTitle className="text-red-700 font-serif italic">Your Basket</SheetTitle>
//         </SheetHeader>
        
//         {cart.items.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <ShoppingBasket size={48} />
//             <p className="mt-4 text-xs">Your bascket is empty</p>
//           </div>
//         ) : (
//           <>
//             <ScrollArea className="h-[calc(100vh-200px)] pr-4">
//               {cart.items.map((item) => (
//                 <div 
//                   key={item.id} 
//                   className="flex items-center justify-between border-b py-4"
//                 >
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-deak-700 text-sm">{item.name}</h3>
//                     <p className="text-xs">
//                       ₦{item.price} × {item.quantity}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <Button 
//                       variant="outline" 
//                       size="icon" 
//                       onClick={() => updateQuantity(item.id, -1)}
//                     >
//                       <Minus size={12} />
//                     </Button>
//                     <span>{item.quantity}</span>
//                     <Button 
//                       variant="outline" 
//                       size="icon" 
//                       onClick={() => updateQuantity(item.id, 1)}
//                     >
//                       <Plus size={12} />
//                     </Button>
//                     <Button 
//                       variant="destructive" 
//                       size="icon" 
//                       onClick={() => removeItem(item.id)}
//                       className="bg-red-700"
//                     >
//                       <Trash2 size={12} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </ScrollArea>
            
//             <SheetFooter className="mt-4">
//               <div className="w-full">
//                 <div className="flex justify-between mb-4">
//                   <span className="font-semibold">Total</span>
//                   <span className="font-bold">₦{cart.total}</span>
//                 </div>
//                 <Button 
//                   onClick={() => setCheckoutSheetOpen(!checkoutSheetOpen)}
//                   className="w-full rounded-lg bg-red-700 hover:bg-red-700/90" disabled={cart.items.length === 0}
//                 >
//                   Proceed to Checkout
//                 </Button>
//               </div>
//             </SheetFooter>
//             <CheckoutSheet isOpen={checkoutSheetOpen} onClose={() => {}} />
//           </>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// };

"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBasket } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import CheckoutSheet from "./checkout-sheet";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  children?: React.ReactNode;
}

export const CartDrawer = ({ children }: CartDrawerProps) => {
  const { cart, setCart } = useCart();
  const [checkoutSheetOpen, setCheckoutSheetOpen] = useState<boolean>(false);

  const updateQuantity = (itemId: string, change: number) => {
    const updatedItems = cart.items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            quantity: Math.max(0, item.quantity + change)
          } 
        : item
    ).filter(item => item.quantity > 0);

    setCart({
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    setCart({
      items: updatedItems,
      total: calculateTotal(updatedItems)
    });
  };

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div>
      <Sheet>
        {children}
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-red-700 font-serif italic">Your Basket</SheetTitle>
          </SheetHeader>
          
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
              <ShoppingBasket className="w-12 h-12" />
              <p className="text-sm">Your basket is empty</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 h-[calc(100vh-200px)] pr-4">
                {cart.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between border-b py-4 space-x-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="h-8 w-8 bg-red-700 hover:bg-red-800"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              <SheetFooter className="border-t pt-4">
                <div className="w-full space-y-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">{formatCurrency(cart.total)}</span>
                  </div>
                  <Button 
                    onClick={() => setCheckoutSheetOpen(true)}
                    className="w-full bg-red-700 hover:bg-red-800 text-white" 
                    disabled={cart.items.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      <CheckoutSheet 
        isOpen={checkoutSheetOpen}
        onClose={() => setCheckoutSheetOpen(false)}
      />
    </div>
  );
};

export default CartDrawer;