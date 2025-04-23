import { View, GestureResponderEvent } from "react-native";
import React, { useRef } from "react";

const DOUBLE_TAP_DELAY = 300; // milliseconds

export const DoubleTapView = ({
  onDoubleTap,
  children,
}: {
  onDoubleTap: () => void;
  children: React.ReactNode;
}) => {
  const lastTap = useRef<number | null>(null);

  const handleTap = (event: GestureResponderEvent) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      onDoubleTap();
    }
    lastTap.current = now;
  };

  return <View onTouchEnd={handleTap}>{children}</View>;
};
