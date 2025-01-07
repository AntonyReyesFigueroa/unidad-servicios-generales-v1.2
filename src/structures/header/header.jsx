'use client';
import React, { useEffect, useState } from 'react';
import HeaderPC from '@/structures/header/header-pc';
import HeaderMovil from './header-movil';
import Cookie from 'js-cookie';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function HeaderPage() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`/api/user/email/${user.email}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
          }

          const userData = await response.json();

          // Guardar los datos del usuario en una cookie
          Cookie.set('userData', JSON.stringify(userData), { expires: 7 }); // Expira en 7 días

          // console.log('User data saved in cookie:', userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user information</p>;

  return (
    <div>
      <div style={{ width: 'auto', height: '61px' }}>
        <HeaderPC />
        <HeaderMovil />
      </div>
    </div>
  );
}
