"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  animate,
} from "motion/react";
import { MouseEventHandler, useEffect, useRef } from "react";

function Home() {
  const count = useMotionValue(0);
  const count2 = useMotionValue(0);
  const count3 = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const clients = useTransform(count2, Math.round);
  const rides = useTransform(count3, Math.round);

  useEffect(() => {
    const animation = animate(count, 51, {
      duration: 5,
    });
  }, []);
  useEffect(() => {
    const animation2 = animate(clients, 90, {
      duration: 7,
    });
  }, []);
  useEffect(() => {
    const animation3 = animate(rides, 39, {
      duration: 9,
    });
  }, []);
  return (
    <section className="pt-24 px-8 pb-20 md:pb-0 list-item bg-[url('/ben-guernsey.jpeg')] bg-cover bg-center bg-no-repeat relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/30 to-gray-900/50 mix-blend-multiply"></div>

      {/* Dotted grid overlay */}
      <div
        className="absolute inset-0 z-10"
        style={
          {
            "--dot-bg": "rgba(66 66 66 / 10%))",
            "--dot-color": "transparent",
            "--dot-size": "1px",
            "--dot-space": "22px",
            background: `
            linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
            linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
            var(--dot-color)
          `,
          } as React.CSSProperties
        }
      ></div>
      <div className="mx-auto grid min-h-[55vh] w-full grid-cols-1 place-items-start relative z-20"></div>
    </section>
  );
}

const MotionCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateXValues = window.innerWidth >= 640 ? [353, 353] : [0, 0];
  const rotateYValues = window.innerWidth >= 640 ? [6, 6] : [0, 0];
  const rotateX = useTransform(cardY, [-100, 2000], rotateXValues); // Updated to match rotateX(353deg)
  const rotateY = useTransform(cardX, [-200, 100], rotateYValues); // Updated to match rotateY(6deg)
  const cardRotateX = useTransform(cardY, [-100, 100], [25, -25]); // Adjusted rotation values
  const cardRotateY = useTransform(cardX, [-300, 300], [-25, 25]); // Adjusted rotation values

  // Add animation controls for automatic rotation
  const controls = useAnimation();
  const autoRotateRef = useRef<number | null>(null);

  // Function to handle automatic rotation
  const startAutoRotation = () => {
    let angleY = 0;
    let angleX = 0;
    let directionY = 1; // 1 for right, -1 for left
    let directionX = 1; // 1 for up, -1 for down
    let targetAngleY = 3; // Reduced from 100 to 15 for more balanced movement
    let targetAngleX = 3; // Increased from 5 to 15 for more balanced movement

    const animate = () => {
      // Move in current direction for Y axis
      angleY += 0.02 * directionY;

      // Move in current direction for X axis
      angleX += 0.02 * directionX; // Same speed as Y for balanced movement

      // Check if we've reached the target angle for Y axis
      if (directionY === -1 && angleY <= -targetAngleY) {
        // We've reached the left position, now move right
        directionY = 1;
      } else if (directionY === 1 && angleY >= targetAngleY) {
        // We've reached the right position, now move left
        directionY = -1;
      }

      // Check if we've reached the target angle for X axis
      if (directionX === -1 && angleX <= -targetAngleX) {
        // We've reached the down position, now move up
        directionX = 1;
      } else if (directionX === 1 && angleX >= targetAngleX) {
        // We've reached the up position, now move down
        directionX = -1;
      }

      controls.start({
        rotateY: angleY,
        rotateX: angleX,
        transition: { duration: 0.1, ease: "linear" },
      });

      autoRotateRef.current = requestAnimationFrame(animate);
    };

    autoRotateRef.current = requestAnimationFrame(animate);
  };

  // Start auto-rotation when component mounts
  useEffect(() => {
    // Only start animation on larger screens
    if (window.innerWidth >= 640) {
      startAutoRotation();
    }

    // Clean up animation on unmount
    return () => {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current);
      }
    };
  }, []);

  // Optional: Pause animation on hover
  const handleMouseEnter = () => {
    if (autoRotateRef.current) {
      cancelAnimationFrame(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  };

  // Optional: Resume animation on mouse leave
  const handleMouseLeave = () => {
    startAutoRotation();
  };
  return (
    <motion.div
      style={{
        perspective: 1200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
      }}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* this div can be used as the 'dotted grid' */}
      <motion.div
        style={{
          margin: "150px 0 0",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          rotateX,
          rotateY,
        }}
        transition={{ velocity: 0 }}
        className="sm:transform-none sm:rotate-0 sm:translate-x-0 sm:translate-y-0"
      >
        <motion.div
          key="card"
          style={{
            width: "90%",
            minWidth: window.innerWidth >= 640 ? 850 : 300,
            height: "auto",
            transformStyle: "preserve-3d",
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(13, 13, 13, 0.25)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
          animate={controls}
          transition={{ velocity: 2 }}
          className="sm:transform-none sm:rotate-0 sm:translate-x-0 sm:translate-y-0"
        >
          <div className="content">{children}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
export default Home;
