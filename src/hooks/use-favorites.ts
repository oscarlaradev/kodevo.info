"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'codecanvas-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
      // Initialize with empty array if localStorage is corrupt or inaccessible
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites, isMounted]);

  const addFavorite = useCallback((projectId: string) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.includes(projectId)) {
        return [...prevFavorites, projectId];
      }
      return prevFavorites;
    });
  }, []);

  const removeFavorite = useCallback((projectId: string) => {
    setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== projectId));
  }, []);

  const toggleFavorite = useCallback((projectId: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(projectId)) {
        return prevFavorites.filter((id) => id !== projectId);
      } else {
        return [...prevFavorites, projectId];
      }
    });
  }, []);
  
  const isFavorite = useCallback(
    (projectId: string) => {
      return favorites.includes(projectId);
    },
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, isMounted };
}
