"use client";
import { Suspense } from "react";
import LoginModal from "./login-modal";

export default function LoginModalWrapper() {
  return (
    <Suspense fallback={null}>
      <LoginModal />
    </Suspense>
  );
}
