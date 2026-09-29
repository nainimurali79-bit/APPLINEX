import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, role } = useAuth();
  const { addToast } = useNotification();

  const getWishlistKey = () => {
    if (!user) return 'applinex_wishlist_guest';
    return `applinex_wishlist_${user.role}_${user.id}`;
  };

  const getCompareKey = () => {
    if (!user) return 'applinex_compare_guest';
    return `applinex_compare_${user.role}_${user.id}`;
  };

  // Admin and support do not have personal shopping wishlists
  const isShoppingRole = role !== 'admin' && role !== 'support';

  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false);

  // Sync wishlist & compare whenever logged-in user/role changes
  useEffect(() => {
    if (!isShoppingRole) {
      setWishlist([]);
      setCompareList([]);
      return;
    }

    try {
      const savedWishlist = localStorage.getItem(getWishlistKey());
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    } catch {
      setWishlist([]);
    }

    try {
      const savedCompare = localStorage.getItem(getCompareKey());
      setCompareList(savedCompare ? JSON.parse(savedCompare) : []);
    } catch {
      setCompareList([]);
    }
  }, [user?.id, role]);

  // Save to user-scoped storage only for valid customer/guest
  useEffect(() => {
    if (isShoppingRole) {
      localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
    }
  }, [wishlist, user?.id, role]);

  useEffect(() => {
    if (isShoppingRole) {
      localStorage.setItem(getCompareKey(), JSON.stringify(compareList));
    }
  }, [compareList, user?.id, role]);

  const toggleWishlist = (appliance) => {
    if (!appliance || !isShoppingRole) return;
    const exists = wishlist.some((item) => item.id === appliance.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== appliance.id));
      addToast(`Removed "${appliance.name}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, appliance]);
      addToast(`Added "${appliance.name}" to wishlist!`, 'success');
    }
  };

  const isInWishlist = (applianceId) => {
    if (!isShoppingRole) return false;
    return wishlist.some((item) => item.id === applianceId);
  };

  const removeFromWishlist = (applianceId) => {
    if (!isShoppingRole) return;
    setWishlist((prev) => prev.filter((item) => item.id !== applianceId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (isShoppingRole) {
      localStorage.removeItem(getWishlistKey());
    }
  };

  // Compare actions
  const toggleCompare = (appliance) => {
    if (!appliance) return;
    const exists = compareList.some((item) => item.id === appliance.id);
    if (exists) {
      setCompareList((prev) => prev.filter((item) => item.id !== appliance.id));
      addToast(`Removed "${appliance.name}" from comparison`, 'info');
    } else {
      if (compareList.length >= 4) {
        addToast('You can compare up to 4 appliances at a time.', 'warning');
        return;
      }
      setCompareList((prev) => [...prev, appliance]);
      addToast(`Added "${appliance.name}" to comparison!`, 'success');
    }
  };

  const isInCompare = (applianceId) => {
    return compareList.some((item) => item.id === applianceId);
  };

  const removeFromCompare = (applianceId) => {
    setCompareList((prev) => prev.filter((item) => item.id !== applianceId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        compareList,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        clearCompare,
        compareCount: compareList.length,
        isAiConciergeOpen,
        setIsAiConciergeOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
