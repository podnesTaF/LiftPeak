import React from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

export const renderBottomSheetBackdrop = (props: any) => (
  <BottomSheetBackdrop
    opacity={0.7}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    enableTouchThrough={false}
    {...props}
  />
);
