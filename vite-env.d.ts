/// <reference types="vite/client" />

import React from "react";

declare module "react" {
  interface HTMLAttributes<T> {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler;
    onPointerLeaveCapture?: React.PointerEventHandler;
  }
}
