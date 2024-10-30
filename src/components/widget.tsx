"use client";
import { useEffect } from "react";

export const CalendlyWidget = () => {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js"
    );
    head?.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={"https://calendly.com/konstantin-garbar"}
      style={{ marginTop: "20px", width: "100%" }}
      data-resize={"true"}
    ></div>
  );
};
