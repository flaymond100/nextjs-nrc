import { useEffect } from "react";

const REDIRECT_URL = "https://ventrocycling.com/plans-and-pricing/";

export default function PersonalCoachingRedirect() {
  useEffect(() => {
    window.location.replace(REDIRECT_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Redirecting to{" "}
      <a
        href={REDIRECT_URL}
        className="underline ml-1"
        rel="noopener noreferrer"
      >
        ventrocycling.com
      </a>
      …
    </div>
  );
}
