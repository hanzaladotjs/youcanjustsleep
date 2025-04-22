
import React, { useEffect, useRef } from "react";

export const OwlIllustration: React.FC = () => {
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    // Owl eye animation - follows cursor
    const handleMouseMove = (e: MouseEvent) => {
      if (!leftPupilRef.current || !rightPupilRef.current) return;
      
      const leftPupil = leftPupilRef.current;
      const rightPupil = rightPupilRef.current;
      
      // Get the center of each eye
      const leftEyeX = 80;
      const rightEyeX = 120;
      const eyeY = 75;
      
      // Get mouse position relative to viewport
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate mouse position on the page
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate normalized position (-1 to 1)
      const normalizedX = (mouseX / windowWidth) * 2 - 1;
      const normalizedY = (mouseY / windowHeight) * 2 - 1;
      
      // Move pupils (max 3px in any direction)
      const maxMovement = 3;
      const leftPupilX = leftEyeX + normalizedX * maxMovement;
      const rightPupilX = rightEyeX + normalizedX * maxMovement;
      const pupilY = eyeY + normalizedY * maxMovement;
      
      // Apply movement
      leftPupil.setAttribute("cx", leftPupilX.toString());
      leftPupil.setAttribute("cy", pupilY.toString());
      rightPupil.setAttribute("cx", rightPupilX.toString());
      rightPupil.setAttribute("cy", pupilY.toString());
    };
    
    // Occasionally blink
    const blinkInterval = setInterval(() => {
      const leftEye = document.querySelector(".owl-eye:nth-of-type(1)");
      const rightEye = document.querySelector(".owl-eye:nth-of-type(2)");
      
      if (leftEye && rightEye) {
        leftEye.classList.add("scale-y-[0.1]");
        rightEye.classList.add("scale-y-[0.1]");
        
        setTimeout(() => {
          leftEye.classList.remove("scale-y-[0.1]");
          rightEye.classList.remove("scale-y-[0.1]");
        }, 200);
      }
    }, 5000 + Math.random() * 5000); // Blink every 5-10 seconds
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);
  
  return (
    <div className="w-32 h-32 md:w-48 md:h-48 relative animate-float">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        {/* Owl body */}
        <ellipse
          cx="100"
          cy="100"
          rx="60"
          ry="70"
          className="fill-owl-dark"
        />
        {/* Owl face */}
        <ellipse
          cx="100"
          cy="90"
          rx="45"
          ry="50"
          className="fill-owl"
        />
        {/* Left eye */}
        <g className="owl-eye transition-transform duration-200">
          <circle
            cx="80"
            cy="75"
            r="15"
            className="fill-white"
          />
          <circle
            cx="80"
            cy="75"
            r="8"
            className="fill-night-darker"
            ref={leftPupilRef}
          />
        </g>
        {/* Right eye */}
        <g className="owl-eye transition-transform duration-200">
          <circle
            cx="120"
            cy="75"
            r="15"
            className="fill-white"
          />
          <circle
            cx="120"
            cy="75"
            r="8"
            className="fill-night-darker"
            ref={rightPupilRef}
          />
        </g>
        {/* Beak */}
        <path
          d="M95,90 L105,90 L100,100 Z"
          className="fill-night-darker"
        />
        {/* Ears/Feather tufts */}
        <path
          d="M70,45 L85,65 L65,65 Z"
          className="fill-owl-dark"
        />
        <path
          d="M130,45 L115,65 L135,65 Z"
          className="fill-owl-dark"
        />
      </svg>
    </div>
  );
};
