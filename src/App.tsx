import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-gray-600">
            Migration in progress — routes wired in stage 6.
          </div>
        }
      />
    </Routes>
  );
}
