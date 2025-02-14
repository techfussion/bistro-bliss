// "use client";

// import { useState } from "react";
// import { usePaystackPayment } from "react-paystack";
// import { 
//   Sheet, 
//   SheetContent, 
//   SheetHeader, 
//   SheetTitle,
//   SheetFooter
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { useCart } from "@/context/CartContext";
// import { formatCurrency } from "@/lib/utils";
// import { useAuth } from "@/context/AuthContext";
// import apiClient from "@/interceptor/axios.interceptor";

// interface Address {
//   id: string;
//   street: string;
//   city: string;
//   state: string;
// }

// interface CheckoutSheetProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const CheckoutSheet = ({ isOpen, onClose }: CheckoutSheetProps) => {
//   const { cart } = useCart();
//   const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
//   const [selectedAddress, setSelectedAddress] = useState<string>("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const { auth } = useAuth();
//   const { user } = auth;

//   const token = localStorage.getItem('token');

//   // This would come from user context/API
//   const sampleAddresses: Address[] = [
//     {
//       id: "1",
//       street: "123 Sample Street",
//       city: "Lagos",
//       state: "Lagos State"
//     }
//   ];

//   const handlePaymentSuccess = async (data: any) => {
//     try {
//       setIsProcessing(true);
      
//       // Prepare order data
//       const orderData = {
//         items: cart.items.map(item => ({
//           menuItemId: item.id,
//           quantity: item.quantity,
//         })),
//         type: deliveryMethod.toUpperCase(),
//         addressId: deliveryMethod === "delivery" ? selectedAddress : undefined,
//         specialNotes: "", // Add a field in the UI if you want to collect special notes
//         // Include payment information from Paystack
//         paymentInfo: {
//           reference: data.reference,
//           transactionId: data.transaction,
//           status: data.status
//         }
//       };

//       // Send order to your backend
//       const response = await apiClient.post('/orders', orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
      
//       if (response.data) {
//         // cart.clear();
//         onClose();
//       }
//     } catch (error: any) {
//       console.error('Error creating order:', error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const deliveryFee = deliveryMethod === "delivery" ? 2000 : 0;
//   const totalWithDelivery = cart.total + deliveryFee;

//   const config = {
//     reference: new Date().getTime().toString(),
//     email: user?.email || "",
//     amount: totalWithDelivery * 100,
//     publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
//     // onSuccess: (data: any) => {
//     //   // Handle successful payment
//     //   setIsProcessing(false);
//     //   onClose();
//     //   // Call API here to save the order
//     //   console.log(data)
//     // },
//     onSuccess: handlePaymentSuccess,
//     onCancel: () => {
//       setIsProcessing(false);
//     }
//   };

//   const initializePayment = usePaystackPayment(config);

//   const handleCheckout = () => {
//     if (deliveryMethod === "delivery" && !selectedAddress) {
//       // Show error - need to select address
//       return;
//     }
//     setIsProcessing(true);
//     initializePayment({
//       onSuccess: config.onSuccess,
//       onClose: config.onCancel,
//     });
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="w-full sm:max-w-md">
//         <SheetHeader>
//           <SheetTitle className="text-red-700 font-serif italic">Checkout</SheetTitle>
//         </SheetHeader>

//         <div className="space-y-6 py-6">
//           <div>
//             <h3 className="text-sm font-medium mb-4">Delivery Method</h3>
//             <RadioGroup
//               defaultValue="pickup"
//               value={deliveryMethod}
//               onValueChange={(value) => setDeliveryMethod(value as "pickup" | "delivery")}
//               className="space-y-3"
//             >
//               <div className="flex items-center space-x-3">
//                 <RadioGroupItem value="pickup" id="pickup" />
//                 <Label htmlFor="pickup">Pickup from Store</Label>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <RadioGroupItem value="delivery" id="delivery" />
//                 <Label htmlFor="delivery">Home Delivery (+{formatCurrency(2000)})</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           {deliveryMethod === "delivery" && (
//             <div>
//               <h3 className="text-sm font-medium mb-4">Delivery Address</h3>
//               <RadioGroup
//                 value={selectedAddress}
//                 onValueChange={setSelectedAddress}
//                 className="space-y-3"
//               >
//                 {sampleAddresses.map((address) => (
//                   <div key={address.id} className="flex items-start space-x-3">
//                     <RadioGroupItem value={address.id} id={address.id} />
//                     <Label htmlFor={address.id} className="leading-tight">
//                       <div>{address.street}</div>
//                       <div className="text-sm text-gray-500">
//                         {address.city}, {address.state}
//                       </div>
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//               <Button 
//                 variant="outline" 
//                 className="mt-4 w-full"
//                 onClick={() => {/* Handle adding new address */}}
//               >
//                 Add New Address
//               </Button>
//             </div>
//           )}

//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>{formatCurrency(cart.total)}</span>
//             </div>
//             {deliveryMethod === "delivery" && (
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>{formatCurrency(deliveryFee)}</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold border-t pt-3">
//               <span>Total</span>
//               <span>{formatCurrency(totalWithDelivery)}</span>
//             </div>
//           </div>
//         </div>

//         <SheetFooter>
//           <Button
//             className="w-full bg-red-700 hover:bg-red-800 text-white"
//             onClick={handleCheckout}
//             disabled={isProcessing || (deliveryMethod === "delivery" && !selectedAddress)}
//           >
//             {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalWithDelivery)}`}
//           </Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default CheckoutSheet;

"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
// import { toast } from "sonner";
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
import apiClient from "@/interceptor/axios.interceptor";

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
  const { cart, setCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { auth } = useAuth();
  const { user } = auth;
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const deliveryFee = deliveryMethod === "delivery" ? 2000 : 0;
  const totalWithDelivery = +cart.total + +deliveryFee;

  // Sample addresses - replace with actual data fetching
  const sampleAddresses: Address[] = [
    {
      id: "1",
      street: "123 Sample Street",
      city: "Lagos",
      state: "Lagos State"
    }
  ];

  const createOrder = async () => {
    try {
      const orderData = {
        items: cart.items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        type: deliveryMethod.toUpperCase(),
        addressId: deliveryMethod === "delivery" ? selectedAddress : undefined,
        specialNotes: "",
      };

      const response = await apiClient.post('/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentData: any, orderId: string) => {
    console.log("HANDLING SUCCESSFUL PAYMENT", orderId);
    try {
      if (!orderId) {
        throw new Error('No order ID found');
      }
  
      // Update payment status
      await apiClient.post(`/payments`, {
        orderId: orderId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setCart({ items: [], total: 0});
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (deliveryMethod === "delivery" && !selectedAddress) {
      // toast.error("Please select a delivery address");
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create order first
      const order = await createOrder();
      const orderId = order.id;

      // Initialize Paystack payment
      const config = {
        reference: new Date().getTime().toString(),
        email: user?.email || "",
        amount: totalWithDelivery * 100,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        metadata: {
          orderId: order.id,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: order.id,
            },
          ],
        },
        onSuccess: (paymentData: any) => handlePaymentSuccess(paymentData, orderId),
        onCancel: () => {
          setIsProcessing(false);
          // toast.error("Payment cancelled");
        }
      };

      const initializePayment = usePaystackPayment(config);
      initializePayment({
        onSuccess: config.onSuccess,
        onClose: config.onCancel,
      });

    } catch (error) {
      setIsProcessing(false);
      // toast.error("Failed to create order. Please try again.");
      console.error('Error in checkout process:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-red-700 font-serif italic">Checkout</SheetTitle>
        </SheetHeader>

        {/* Rest of your JSX remains the same */}
        <div className="space-y-6 py-6">
          {/* Delivery Method Section */}
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
                <Label htmlFor="delivery">Home Delivery (+{formatCurrency(deliveryFee)})</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Address Selection Section */}
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

          {/* Price Summary Section */}
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