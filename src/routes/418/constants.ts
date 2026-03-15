export const ALLOWED_ADDITIONS = ["cream", "half-and-half", "milk", "sugar", "sweetener", "vanilla", "cinnamon", "hazelnut", "syrup"] as const;
export type AllowedAdditions = typeof ALLOWED_ADDITIONS[number];

export const AVAILABLE_POTS = ["pot-1", "pot-2", "pot-3"] as const;
export type AvailablePots = typeof AVAILABLE_POTS[number];

export type PotState = {
    hasWater: boolean;
    hasCoffee: boolean;
    isOperational: boolean;
};

const defaultPotState = (): PotState => ({
    hasWater: true,
    hasCoffee: true,
    isOperational: true,
});

// Use if potStates are changed during runtime
// export const potStates = new Map<AvailablePots, PotState>(
//     AVAILABLE_POTS.map((pot) => [pot, defaultPotState()]),
// );
export const potStates = new Map<AvailablePots, PotState>([
    ["pot-1", { hasWater: true, hasCoffee: true, isOperational: true }],
    ["pot-2", { hasWater: false, hasCoffee: false, isOperational: true }],
    ["pot-3", { hasWater: true, hasCoffee: true, isOperational: false }],
]);

export type PotInfo = {
    name: string;
    age: string;
    capacity: string;
    availableAdditions: typeof ALLOWED_ADDITIONS;
    status: PotState;
    brewerVersion: string;
};
