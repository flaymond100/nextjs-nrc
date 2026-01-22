"use client";
import { Suspense } from "react";
import Modal from "./modal";

export default function ModalWrapper() {
  return (
    <Suspense fallback={null}>
      <Modal />
    </Suspense>
  );
}
