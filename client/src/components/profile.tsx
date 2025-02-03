"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart, LogOut, UserRound } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Profile = () => {
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, user: null });
  };

  if (auth.isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="relative text-xs" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-700 text-xs text-white flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>
        </Button>

        <Popover>
          <PopoverTrigger>
            <UserRound className="text-xs h-5 w-5" />
          </PopoverTrigger>
          <PopoverContent className="w-max">
            <div className="flex flex-col items-center gap-1">
              <Button variant="link" size="sm" className="text-xs" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="link" size="sm" className="text-xs" asChild>
                <Link href="/reservations">My Reservations</Link>
              </Button>
              <Button variant="link" size="sm" className="text-xs" asChild>
                <Link href="/orders">My Orders</Link>
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="text-xs" asChild>
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </Button>
      <Button asChild variant="link" size="sm" className="text-xs">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild size="sm" className="text-xs rounded-full bg-red-700">
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  );
};

export default Profile;
