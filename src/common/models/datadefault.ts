export interface Activity {
    name: string;
    description: string;
}
  
export interface WalletCategory {
name: string;
description: string;
iconPath: string;
color: string;
walletTypeId: string;
activities: Activity[];
}

export interface MonthlyGoal {
totalAmount: number;
}

export interface GoalItem {
description: string;
minTargetPercentage: number;
maxTargetPercentage: number;
minAmount: number;
maxAmount: number;
}

export interface DataDefaultResponse {
walletCategories: WalletCategory[];
monthlyGoal: MonthlyGoal;
goalItem: GoalItem;
}
  