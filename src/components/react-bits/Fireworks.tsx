import React from "react";

const Fireworks: React.FC = () => {
  const colors = ["bg-red-500", "bg-yellow-400", "bg-green-400", "bg-blue-400"];

  return (
    <>
      {[...Array(12)].map((_, i) => {
        // Random position
        const top = Math.random() * 100;
        const left = Math.random() * 100;

        // Skip rendering if it's too close to center (e.g. 30%–70%)
        if (top > 30 && top < 70 && left > 30 && left < 70) return null;

        return (
          <span
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              colors[i % colors.length]
            } animate-explode`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        );
      })}
    </>
  );
};

export default Fireworks;
