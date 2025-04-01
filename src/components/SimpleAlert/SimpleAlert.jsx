import React, { useEffect, useState } from "react";
import "./SimpleAlert.css";

const SimpleAlert = ({ color, setVisible, visible, text }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 1 : 0));
    }, 20);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="simple-alert" style={{ backgroundColor: color }}>
      <button onClick={() => setVisible(false)}>&times;</button>
      <p>{text}</p>
      <div
        style={{ width: `${progress}%` }}
        className="simple-alert-progress"
      />
    </div>
  );
};

export default SimpleAlert;
