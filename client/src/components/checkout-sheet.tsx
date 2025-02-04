"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CheckoutSheet = ({ isOpen, onClose }: CheckoutSheetProps) => {
  const { cart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-red-700 font-serif italic">
            Checkout Summary
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-220px)] pr-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between py-4 border-b">
              <div>
                <h3 className="font-semibold text-deak-700 text-sm">{item.name}</h3>
                <p className="text-xs">
                  ₦{item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <span className="font-bold">₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </ScrollArea>

        <SheetFooter className="mt-4">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold">₦{cart.total.toFixed(2)}</span>
            </div>
            <Button
              className="w-full rounded-lg bg-green-600 hover:bg-green-700"
              disabled={cart.items.length === 0}
            >
              Confirm Payment
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
