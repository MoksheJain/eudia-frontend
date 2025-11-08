"use client";
import { cn } from "@/lib/utils";
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";

// Existing Star interface
interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

// NEW INTERFACE for shooting stars
interface ShootingStar {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number; // Angle of movement in radians
  life: number; // Remaining life (frames)
  maxLife: number; // Total lifespan
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  shootingStarProbability?: number; // NEW PROP for frequency
  className?: string;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.0005,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  shootingStarProbability = 0.005, // 0.5% chance per frame
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  // NEW STATE for shooting stars
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const canvasRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
        };
      });
    },
    [
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
    ]
  );

  useEffect(() => {
    // ... (Star generation and resize logic remains the same)
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        setStars(generateStars(width, height));
      }
    };

    updateStars();

    const resizeObserver = new ResizeObserver(updateStars);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        resizeObserver.unobserve(canvasRef.current);
      }
    };
  }, [
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Light mode background color
    const backgroundColor = "rgba(255, 255, 255, 1)";
    // Dark blue star color
    const starBaseColorRgb = "0, 0, 100";
    // Shooting star color (e.g., bright white or yellow for contrast)
    const shootingStarColor = "rgba(255, 255, 0, 1)";

    // Function to create a new shooting star
    const createShootingStar = (
      width: number,
      height: number
    ): ShootingStar => {
      const angle = Math.random() * Math.PI * 2; // Random angle
      const speed = Math.random() * 5 + 3; // Speed 3 to 8
      const maxLife = Math.floor(Math.random() * 40) + 60; // Life 60 to 100 frames

      return {
        id: Date.now() + Math.random(),
        // Start near the edge or slightly off-screen
        x: Math.random() < 0.5 ? 0 : width,
        y: Math.random() * height,
        length: Math.random() * 30 + 50,
        speed: speed,
        angle: angle,
        life: maxLife,
        maxLife: maxLife,
      };
    };

    const render = () => {
      // 1. Draw the light background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw static stars and update their twinkle
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        // Use the dark blue star color with the calculated opacity
        ctx.fillStyle = `rgba(${starBaseColorRgb}, ${star.opacity})`;
        ctx.fill();

        if (star.twinkleSpeed !== null) {
          star.opacity =
            0.5 +
            Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        }
      });

      // 3. Update and Draw Shooting Stars
      let nextShootingStars: ShootingStar[] = [];
      const { width, height } = canvas;

      // Check for new shooting star
      if (Math.random() < shootingStarProbability) {
        nextShootingStars.push(createShootingStar(width, height));
      }

      // Update existing shooting stars
      shootingStars.forEach((star) => {
        star.x += star.speed * Math.cos(star.angle);
        star.y += star.speed * Math.sin(star.angle);
        star.life -= 1;

        if (star.life > 0) {
          nextShootingStars.push(star);

          // Draw the shooting star trail
          const opacity = star.life / star.maxLife; // Fade out near the end
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`; // Yellow streak for contrast
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";

          // Calculate the starting point (tail) of the streak
          const tailX = star.x - star.length * Math.cos(star.angle);
          const tailY = star.y - star.length * Math.sin(star.angle);

          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
        }
      });

      // Update the state for the next frame
      setShootingStars(nextShootingStars);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars, shootingStars, shootingStarProbability]); // Add new dependencies

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full absolute inset-0", className)}
    />
  );
};
