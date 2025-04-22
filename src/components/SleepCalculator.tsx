
import React, { useState, useEffect } from "react";
import { format, differenceInMinutes } from "date-fns";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { OwlIllustration } from "./OwlIllustration";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Helper to pad numbers with zero
const pad = (num: number) => num.toString().padStart(2, "0");

// All possible hour, minute, am/pm options
const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5));
const AMPM = ["AM", "PM"];

function to24Hour(hour: string, ampm: string) {
  let h = parseInt(hour, 10);
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h;
}

const SleepCalculator: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Default wake-up: 8:00 AM
  const defaultWakeHour = "8";
  const defaultWakeMinute = "00";
  const defaultWakeAmPm = "AM";

  // State for selected dropdowns
  const [wakeHour, setWakeHour] = useState<string>(defaultWakeHour);
  const [wakeMinute, setWakeMinute] = useState<string>(defaultWakeMinute);
  const [wakeAmPm, setWakeAmPm] = useState<string>(defaultWakeAmPm);

  const [sleepDuration, setSleepDuration] = useState<{ hours: number; minutes: number }>({ hours: 0, minutes: 0 });
  const [message, setMessage] = useState<string>("");
  const [messageStyle, setMessageStyle] = useState<string>("");

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync dropdowns if currentTime changes (not required to update to current time, but for reset logic on user side)
  // Not needed unless you want to sync dropdowns with browser time, so skip

  // Calculate on dropdown change or current time change
  useEffect(() => {
    calculateSleepDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wakeHour, wakeMinute, wakeAmPm, currentTime]);

  const calculateSleepDuration = () => {
    // Get selected wake time as Date object
    const wakeDate = new Date(currentTime);
    // Assign hour and minute based on dropdown (converted to 24 hour)
    wakeDate.setSeconds(0, 0);
    wakeDate.setHours(to24Hour(wakeHour, wakeAmPm), parseInt(wakeMinute || "0"));
    // If wake up time today is before current time, move to next day
    if (wakeDate < currentTime) wakeDate.setDate(wakeDate.getDate() + 1);
    const totalMinutes = differenceInMinutes(wakeDate, currentTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    setSleepDuration({ hours, minutes });

    // Set message and style
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

  // Format function for current and wake times (display)
  const formatTime = (date: Date) => format(date, "h:mm a");

  return (
    <div className="flex flex-col items-center p-6 bg-night-lighter bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full mx-auto transform transition-all duration-300 hover:scale-[1.01]">
      <div className="mb-5 transform transition hover:rotate-3 cursor-pointer">
        <OwlIllustration />
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-owl-light mb-6">
        Sleep Calculator
      </h2>

      <div className="w-full mb-6">
        <Label htmlFor="wakeup-time-hour" className="text-owl-light mb-2 block">
          What time do you want to wake up?
        </Label>
        <div className="flex flex-row gap-3 items-center">
          {/* Hour Dropdown */}
          <Select value={wakeHour} onValueChange={setWakeHour}>
            <SelectTrigger id="wakeup-time-hour" className="w-20 bg-night-darker text-owl-light border-owl-dark focus:border-owl focus:ring-owl">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="bg-night-darker text-owl-light border-owl-dark z-50">
              {HOURS.map((h) => (
                <SelectItem key={h} value={h} className="text-lg">{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-owl-light text-xl font-semibold">:</span>

          {/* Minute Dropdown */}
          <Select value={wakeMinute} onValueChange={setWakeMinute}>
            <SelectTrigger id="wakeup-time-minute" className="w-20 bg-night-darker text-owl-light border-owl-dark focus:border-owl focus:ring-owl">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent className="bg-night-darker text-owl-light border-owl-dark z-50">
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m} className="text-lg">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* AM/PM Dropdown */}
          <Select value={wakeAmPm} onValueChange={setWakeAmPm}>
            <SelectTrigger id="wakeup-time-ampm" className="w-20 bg-night-darker text-owl-light border-owl-dark focus:border-owl focus:ring-owl">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent className="bg-night-darker text-owl-light border-owl-dark z-50">
              {AMPM.map((ap) => (
                <SelectItem key={ap} value={ap} className="text-lg">{ap}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-center mb-6 bg-night-darker bg-opacity-50 p-4 rounded-lg w-full">
        <div className="flex justify-between items-center mb-3">
          <p className="text-owl-light text-lg">Current time:</p>
          <p className="font-medium text-owl text-lg">{formatTime(currentTime)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-owl-light text-lg">Wake-up time:</p>
          <p className="font-medium text-owl text-lg">
            {`${wakeHour}:${wakeMinute} ${wakeAmPm}`}
          </p>
        </div>
      </div>

      <div className="w-full bg-night-darker bg-opacity-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-center">
          <Clock className="mr-2 text-owl h-6 w-6" />
          <p className="text-owl-light text-lg">
            You'll get{" "}
            <span className="font-bold text-owl">
              {sleepDuration.hours} hours{sleepDuration.minutes > 0 ? ` and ${sleepDuration.minutes} minutes` : ""}
            </span>{" "}
            of sleep
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
