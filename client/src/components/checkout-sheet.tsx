// "use client";

// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/context/CartContext";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface CheckoutSheetProps {
//   isOpen: boolean;
//   onClose?: () => void;
// }

// export const CheckoutSheet = ({ isOpen, onClose }: CheckoutSheetProps) => {
//   const { cart } = useCart();

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="w-[400px] sm:w-[540px]">
//         <SheetHeader>
//           <SheetTitle className="text-red-700 font-serif italic">
//             Checkout Summary
//           </SheetTitle>
//         </SheetHeader>

//         <ScrollArea className="h-[calc(100vh-220px)] pr-4">
//           {cart.items.map((item) => (
//             <div key={item.id} className="flex justify-between py-4 border-b">
//               <div>
//                 <h3 className="font-semibold text-deak-700 text-sm">{item.name}</h3>
//                 <p className="text-xs">
//                   ₦{item.price} × {item.quantity}
//                 </p>
//               </div>
//               <span className="font-bold">₦{(item.price * item.quantity)}</span>
//             </div>
//           ))}
//         </ScrollArea>

//         <SheetFooter className="mt-4">
//           <div className="w-full">
//             <div className="flex justify-between mb-4">
//               <span className="font-semibold">Total</span>
//               <span className="font-bold">₦{cart.total}</span>
//             </div>
//             <Button
//               className="w-full rounded-lg bg-green-600 hover:bg-green-700"
//               disabled={cart.items.length === 0}
//             >
//               Confirm Payment
//             </Button>
//           </div>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };


// "use client";

// import { useState } from "react";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { useCart } from "@/context/CartContext";
// import { PaystackButton } from "react-paystack";

// interface CheckoutSheetProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const CheckoutSheet = ({ isOpen, onClose }: CheckoutSheetProps) => {
//   const { cart } = useCart();
//   const [deliveryOption, setDeliveryOption] = useState("pickup");
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const addresses = ["Home", "Office", "Other"];

//   const paystackConfig = {
//     reference: new Date().getTime().toString(),
//     email: "user@example.com", // Replace with dynamic user email
//     amount: cart.total * 100, // Convert to kobo
//     publicKey: "your-paystack-public-key",
//     onSuccess: () => alert("Payment Successful!"),
//     onClose: () => alert("Payment window closed"),
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="w-[400px] sm:w-[540px]">
//         <SheetHeader>
//           <SheetTitle className="text-red-700 font-serif italic">Checkout</SheetTitle>
//         </SheetHeader>

//         <div className="mt-4">
//           <Label className="font-semibold">Delivery Option</Label>
//           <RadioGroup value={deliveryOption} onChange={(e) => setDeliveryOption((e.target as HTMLInputElement).value)} className="mt-2 space-y-2">
//             <Label className="flex items-center space-x-2">
//               <RadioGroupItem value="pickup" />
//               <span>Pickup</span>
//             </Label>
//             <Label className="flex items-center space-x-2">
//               <RadioGroupItem value="delivery" />
//               <span>Delivery</span>
//             </Label>
//           </RadioGroup>
//         </div>

//         {deliveryOption === "delivery" && (
//           <div className="mt-4">
//             <Label className="font-semibold">Select Delivery Address</Label>
//             <select
//               value={selectedAddress}
//               onChange={(e) => setSelectedAddress(e.target.value)}
//               className="w-full mt-2 p-2 border rounded"
//             >
//               <option value="">Select an address</option>
//               {addresses.map((address, index) => (
//                 <option key={index} value={address}>{address}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         <SheetFooter className="mt-6">
//           <PaystackButton
//             {...paystackConfig}
//             className="w-full py-2 text-white bg-red-700 rounded-lg hover:bg-red-700/90"
//             disabled={deliveryOption === "delivery" && !selectedAddress}
//           >
//             Pay ₦{cart.total}
//           </PaystackButton>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };


"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
}

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutSheet = ({ isOpen, onClose }: CheckoutSheetProps) => {
  const { cart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { auth } = useAuth();
  const { user } = auth;

  // This would come from user context/API
  const sampleAddresses: Address[] = [
    {
      id: "1",
      street: "123 Sample Street",
      city: "Lagos",
      state: "Lagos State"
    }
  ];

  const deliveryFee = deliveryMethod === "delivery" ? 2000 : 0;
  const totalWithDelivery = cart.total + deliveryFee;

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email || "",
    amount: totalWithDelivery * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    onSuccess: () => {
      // Handle successful payment
      setIsProcessing(false);
      onClose();
      // Call API here to save the order
    },
    onCancel: () => {
      setIsProcessing(false);
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleCheckout = () => {
    if (deliveryMethod === "delivery" && !selectedAddress) {
      // Show error - need to select address
      return;
    }
    setIsProcessing(true);
    initializePayment({
      onSuccess: config.onSuccess,
      onClose: config.onCancel,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-red-700 font-serif italic">Checkout</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Delivery Method</h3>
            <RadioGroup
              defaultValue="pickup"
              value={deliveryMethod}
              onValueChange={(value) => setDeliveryMethod(value as "pickup" | "delivery")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup">Pickup from Store</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Home Delivery (+{formatCurrency(2000)})</Label>
              </div>
            </RadioGroup>
          </div>

          {deliveryMethod === "delivery" && (
            <div>
              <h3 className="text-sm font-medium mb-4">Delivery Address</h3>
              <RadioGroup
                value={selectedAddress}
                onValueChange={setSelectedAddress}
                className="space-y-3"
              >
                {sampleAddresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <Label htmlFor={address.id} className="leading-tight">
                      <div>{address.street}</div>
                      <div className="text-sm text-gray-500">
                        {address.city}, {address.state}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => {/* Handle adding new address */}}
              >
                Add New Address
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
            {deliveryMethod === "delivery" && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-3">
              <span>Total</span>
              <span>{formatCurrency(totalWithDelivery)}</span>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button
            className="w-full bg-red-700 hover:bg-red-800 text-white"
            onClick={handleCheckout}
            disabled={isProcessing || (deliveryMethod === "delivery" && !selectedAddress)}
          >
            {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalWithDelivery)}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutSheet;