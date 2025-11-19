"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarCard = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="flex items-center">
      <div className="border-2 border-gray-300 dark:border-gray-600 py-3 px-5 flex gap-4 shadow-2xl rounded-xl bg-background/80 backdrop-blur-md">
        {/* Home Icon */}
        <Link href="/" className="group relative px-4 cursor-pointer">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
            isActive('/') 
              ? 'bg-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-200 dark:ring-blue-800' 
              : 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/') ? "currentColor" : "none"} viewBox="0 0 24 24" height={32} width={32}>
              <path stroke={isActive('/') ? "none" : "currentColor"} strokeWidth="2" d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
            </svg>
          </div>
          <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
            Home
          </span>
        </Link>
        
        {/* Store/Marketplace Icon - Changed from Chat */}
        <Link href="/marketplace" className="group relative px-4 cursor-pointer">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
            isActive('/marketplace') 
              ? 'bg-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-200 dark:ring-blue-800' 
              : 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/marketplace') ? "currentColor" : "none"} viewBox="0 0 24 24" height={32} width={32}>
              <path stroke={isActive('/marketplace') ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
            Marketplace
          </span>
        </Link>
        
        {/* Dashboard Icon */}
        <Link href="/dashboard" className="group relative px-4 cursor-pointer">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
            isActive('/dashboard') 
              ? 'bg-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-200 dark:ring-blue-800' 
              : 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/dashboard') ? "currentColor" : "none"} viewBox="0 0 24 24" height={32} width={32}>
              <path stroke={isActive('/dashboard') ? "none" : "currentColor"} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" />
            </svg>
          </div>
          <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
            Dashboard
          </span>
        </Link>
        
        {/* Plus/Create Icon - Changed from Settings */}
        <Link href="/create" className="group relative px-4 cursor-pointer">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
            isActive('/create') 
              ? 'bg-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-200 dark:ring-blue-800' 
              : 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/create') ? "currentColor" : "none"} viewBox="0 0 24 24" height={32} width={32}>
              <path stroke={isActive('/create') ? "none" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
            </svg>
          </div>
          <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 whitespace-nowrap">
            Create NFT
          </span>
        </Link>
      </div>
    </div>
  );
}

export default NavbarCard;
