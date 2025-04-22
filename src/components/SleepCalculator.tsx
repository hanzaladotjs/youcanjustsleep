
import React, { useState, useEffect } from "react";
import { format, addHours, differenceInHours, differenceInMinutes, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { OwlIllustration } from "./OwlIllustration";

const SleepCalculator: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [wakeUpTime, setWakeUpTime] = useState<Date>(() => {
    // Default wake-up time to 8:00 AM
    const tomorrow = new Date();
    tomorrow.setHours(8, 0, 0, 0);
    if (tomorrow < currentTime) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return tomorrow;
  });
  
  const [sleepDuration, setSleepDuration] = useState<{hours: number, minutes: number}>({ hours: 0, minutes: 0 });
  const [message, setMessage] = useState<string>("");
  const [messageStyle, setMessageStyle] = useState<string>("");

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  // Calculate sleep duration whenever current time or wake-up time changes
  useEffect(() => {
    calculateSleepDuration();
  }, [currentTime, wakeUpTime]);

  const calculateSleepDuration = () => {
    let sleepEnd = new Date(wakeUpTime);
    let sleepStart = new Date(currentTime);

    // If wake-up time is earlier today, assume it's for the next day
    if (sleepEnd < sleepStart) {
      sleepEnd.setDate(sleepEnd.getDate() + 1);
    }

    const totalMinutes = differenceInMinutes(sleepEnd, sleepStart);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    setSleepDuration({ hours, minutes });

    // Set message based on hours of sleep
    if (hours < 4) {
      setMessage("Fix your damn schedule!");
      setMessageStyle("text-sleep-bad font-bold text-2xl md:text-3xl animate-pulse");
    } else if (hours < 6) {
      setMessage("Try sleeping earlier.");
      setMessageStyle("text-sleep-warning font-semibold text-xl md:text-2xl");
    } else {
      setMessage("Healthy sleep!");
      setMessageStyle("text-sleep-good font-semibold text-xl md:text-2xl");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    const [hours, minutes] = timeValue.split(':').map(Number);
    
    const newWakeUpTime = new Date();
    newWakeUpTime.setHours(hours, minutes, 0, 0);
    
    // If the time is earlier today, assume it's for the next day
    if (newWakeUpTime < currentTime) {
      newWakeUpTime.setDate(newWakeUpTime.getDate() + 1);
    }
    
    setWakeUpTime(newWakeUpTime);
  };

  // Format time in 12-hour format with AM/PM
  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };
  
  return (
    <div className="flex flex-col items-center p-6 bg-night-lighter bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full mx-auto transform transition-all duration-300 hover:scale-[1.01]">
      <div className="mb-5 transform transition hover:rotate-3 cursor-pointer">
        <OwlIllustration />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-semibold text-owl-light mb-6">
        Sleep Calculator
      </h2>
      
      <div className="w-full mb-6">
        <Label htmlFor="wakeup-time" className="text-owl-light mb-2 block">
          What time do you want to wake up?
        </Label>
        <div className="relative">
          <Input
            id="wakeup-time"
            type="time"
            value={format(wakeUpTime, 'HH:mm')}
            onChange={handleTimeChange}
            className="pr-10 bg-night-darker text-owl-light border-owl-dark focus:border-owl focus:ring-owl"
          />
          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-owl-dark h-5 w-5" />
        </div>
      </div>
      
      <div className="text-center mb-6 bg-night-darker bg-opacity-50 p-4 rounded-lg w-full">
        <div className="flex justify-between items-center mb-3">
          <p className="text-owl-light text-lg">Current time:</p>
          <p className="font-medium text-owl text-lg">{formatTime(currentTime)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-owl-light text-lg">Wake-up time:</p>
          <p className="font-medium text-owl text-lg">{formatTime(wakeUpTime)}</p>
        </div>
      </div>
      
      <div className="w-full bg-night-darker bg-opacity-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-center">
          <Clock className="mr-2 text-owl h-6 w-6" />
          <p className="text-owl-light text-lg">
            You'll get <span className="font-bold text-owl">{sleepDuration.hours} hours {sleepDuration.minutes > 0 ? `and ${sleepDuration.minutes} minutes` : ''}</span> of sleep
          </p>
        </div>
      </div>
      
      <div className={`text-center transition-all duration-500 p-3 rounded-lg w-full ${messageStyle}`}>
        {message}
      </div>
    </div>
  );
};

export default SleepCalculator;
