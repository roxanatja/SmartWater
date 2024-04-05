// components/GoogleMapsProvider.tsx
"use client";

import React, { useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";


interface GoogleMapsProviderProps {
    children: React.ReactNode;
    googleMapsApiKey: string;
  }
  
  const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children, googleMapsApiKey }) => {  
    return <APIProvider apiKey={googleMapsApiKey}>{children}</APIProvider>;
  };
  
  export default GoogleMapsProvider;