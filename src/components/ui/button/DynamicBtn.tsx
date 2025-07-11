// DynamicProductionButton.tsx

import React from "react";
import Button from "./Button";


interface DynamicButtonProps {
  onClick: () => void;
  disabled: boolean;
  loadingStage: boolean;
  buttonText: string;
  startIcon?: React.ElementType; // For startIcon prop, if needed
}

const DynamicProductionButton: React.FC<DynamicButtonProps> = ({
  onClick,
  disabled,
  loadingStage,
  buttonText,
  startIcon,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loadingStage} // Combine passed disabled with internal loadingStage
      startIcon={startIcon ? React.createElement(startIcon) : undefined}
      variant="sync" // Assuming 'sync' variant is defined in your theme
      className={`w-full min-w-[200px] ${
        (disabled || loadingStage) ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loadingStage ? "loading..." : buttonText}
    </Button>
  );
};

export default DynamicProductionButton;