
import React from "react";
import StarryBackground from "@/components/StarryBackground";
import SleepCalculator from "@/components/SleepCalculator";

const Index = () => {
  return (
    <div className="min-h-screen font-poppins bg-gradient-to-b from-night to-night-darker flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Animated starry background */}
      <StarryBackground />
      
      {/* Main content */}
      <div className="container max-w-xl px-4 z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 text-owl-light">
          YouCanJustSleep
        </h1>
        <p className="text-center text-owl opacity-75 mb-8">
          Calculate how much sleep you'll get tonight
        </p>
        
        <SleepCalculator />
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-4 w-full text-center text-owl-dark text-sm z-10">
        <p>vibe coded by hanzala</p>
      </footer>
    </div>
  );
};

export default Index;
