import { type ExaustiveMap } from "~/utils/typescript";
import { type StepKey, type StepState, type StepData } from "./types";
import { create } from "zustand";

type ActionShape = {
  command: string;
  data?: unknown;
  nextStep: StepKey;
};

export type StepAction = ExaustiveMap<
  StepKey,
  {
    greeting:
      | {
          command: "loginFlow";
          data: StepData["greeting"];
          nextStep: "welcomeBack";
        }
      | {
          command: "newUserFlow";
          data: StepData["greeting"];
          nextStep: "chooseRole";
        };

    welcomeBack: { command: "goBack"; nextStep: "greeting" };

    chooseRole:
      | { command: "goBack"; nextStep: "greeting" }
      | {
          command: "next";
          data: StepData["chooseRole"];
          nextStep: "firstDataStep";
        };

    firstDataStep: { command: "goBack"; nextStep: "chooseRole" };
  },
  ActionShape
>;

interface LoginRegisterFlowStore {
  state: StepState;
  lastCommand: string;
  resetState: () => void;
  greetingAction: (action: StepAction["greeting"]) => void;
  welcomeBackAction: (action: StepAction["welcomeBack"]) => void;
  chooseRoleAction: (action: StepAction["chooseRole"]) => void;
  firstDataStepAction: (action: StepAction["firstDataStep"]) => void;
}

export const useLoginRegisterFlow = create<LoginRegisterFlowStore>()(
  (set, get) => ({
    state: {
      stepKey: "greeting",
      accumulatedContext: {},
    },
    lastCommand: "",
    resetState: () =>
      set({ state: { stepKey: "greeting", accumulatedContext: {} } }),

    greetingAction: (action) => {
      const currentState = get().state;
      if (currentState.stepKey !== "greeting") {
        return console.warn(
          `Invalid action for current step "${currentState.stepKey}"`,
        );
      }

      if (action.command === "loginFlow") {
        return set({
          lastCommand: action.command,
          state: {
            stepKey: action.nextStep,
            accumulatedContext: {
              ...currentState.accumulatedContext,
              ...action.data,
            },
          },
        });
      }

      if (action.command === "newUserFlow") {
        return set({
          lastCommand: action.command,
          state: {
            stepKey: action.nextStep,
            accumulatedContext: {
              ...currentState.accumulatedContext,
              ...action.data,
            },
          },
        });
      }
    },

    welcomeBackAction: (action) => {
      const currentState = get().state;
      if (currentState.stepKey !== "welcomeBack") {
        return console.warn(
          `Invalid action for current step "${currentState.stepKey}"`,
        );
      }

      if (action.command === "goBack") {
        return set({
          lastCommand: action.command,
          state: {
            stepKey: action.nextStep,
            accumulatedContext: {},
          },
        });
      }
    },

    chooseRoleAction: (action) => {
      const currentState = get().state;
      if (currentState.stepKey !== "chooseRole") {
        return console.warn(
          `Invalid action for current step "${currentState.stepKey}"`,
        );
      }

      if (action.command === "goBack") {
        return set({
          lastCommand: action.command,
          state: {
            stepKey: action.nextStep,
            accumulatedContext: {},
          },
        });
      }

      if (action.command === "next") {
        return set({
          lastCommand: action.command,
          state: {
            stepKey: action.nextStep,
            accumulatedContext: {
              ...currentState.accumulatedContext,
              ...action.data,
            },
          },
        });
      }
    },

    firstDataStepAction: (action) => {
      const currentState = get().state;
      if (currentState.stepKey !== "firstDataStep") {
        return console.warn(
          `Invalid action for current step "${currentState.stepKey}"`,
        );
      }

      if (action.command === "goBack") {
        return set({
          lastCommand: action.command,
          state: {
            stepKey: action.nextStep,
            accumulatedContext: {
              ...currentState.accumulatedContext,
            },
          },
        });
      }
    },
  }),
);
