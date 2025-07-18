import { ProductionStage } from "../types/production/prodStage";

// Utility function to determine status (updated)
export const getProductionOrderStatus = (
  isFinished: boolean,
  isApproved: boolean,
  isPosted: boolean,
  isCancelled: boolean // Added
): string => {
  if (isCancelled) return "Cancelled"; // Highest precedence
  if (isPosted) return "Posted";
  if (isApproved) return "Approved";
  if (isFinished) return "Finished";
  return "Pending"; // Default for not yet finished/approved/posted
};

export const getSalesOrderStatus = (
  isCancelled: boolean // Added
): string => {
  if (isCancelled) return "Cancelled"; // Highest precedence
  return "Pending"; // Default for not yet finished/approved/posted
};

  interface StageConfig {
    text: string;
    action: () => Promise<void>;
    loadingStage: boolean;
    disabled: boolean;
  }
  
  export const getStageConfig = (
    currentStage: ProductionStage,
    handlers: {
      handleFinishProduction: () => Promise<void>;
      handleApproveProduction: () => Promise<void>;
      handlePostToSAP: () => Promise<void>;
    },
    states: {
      finalLoading: boolean;
      approveLoading: boolean;
      posting: boolean;
      isFinalized: boolean;
      isApprovedInstant: boolean;
      isPostedInstant: boolean;
    }
  ): StageConfig => {
    switch (currentStage) {
      case ProductionStage.FINISH:
        return {
          text: states.finalLoading ? "Processing..." : "Finish Production",
          action: handlers.handleFinishProduction,
          loadingStage: states.finalLoading,
          disabled: states.finalLoading || states.isFinalized
        };
  
      case ProductionStage.APPROVE:
        return {
          text: states.approveLoading ? "Processing..." : "Approve Production",
          action: handlers.handleApproveProduction,
          loadingStage: states.approveLoading,
          disabled: states.approveLoading || states.isApprovedInstant
        };
  
      case ProductionStage.POST:
        return {
          text: states.posting ? "Posting..." : "Post to SAP",
          action: handlers.handlePostToSAP,
          loadingStage: states.posting,
          disabled: states.posting || states.isPostedInstant
        };
  
      case ProductionStage.DONE:
      default:
        return {
          text: "Process Completed",
          action: async () => {},
          loadingStage: false,
          disabled: true
        };
    }
  };

  export const getCurrentStage = (
    isFinishedStage: boolean,
    isApprovedStage: boolean,
    isPostedStage: boolean
  ): ProductionStage => {
    if (isPostedStage) return ProductionStage.DONE;
    if (isApprovedStage) return ProductionStage.POST;
    if (isFinishedStage) return ProductionStage.APPROVE;
    return ProductionStage.FINISH;
  };