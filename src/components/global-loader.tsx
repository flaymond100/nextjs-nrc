"use client";
import { useNavigation } from "@/contexts/navigation-context";
import { Loader } from "./loader";

export function GlobalLoader() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-40 z-[40] flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
      <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200 pointer-events-auto">
        <Loader />
      </div>
    </div>
  );
}
