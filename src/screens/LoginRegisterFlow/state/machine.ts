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

    firstDataStep:
      | { command: "goBack"; nextStep: "chooseRole" }
      | {
          command: "nextSeller";
          data: StepData["firstDataStep"];
          nextStep: "secondDataStepSeller";
        }
      | {
          command: "nextBuyer";
          data: StepData["firstDataStep"];
          nextStep: "secondDataStepBuyer";
        };

    secondDataStepSeller: { command: "goBack"; nextStep: "firstDataStep" };
    secondDataStepBuyer: { command: "goBack"; nextStep: "firstDataStep" };
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
  secondDataStepSellerAction: (
    action: StepAction["secondDataStepSeller"],
  ) => void;
  secondDataStepBuyerAction: (
    action: StepAction["secondDataStepBuyer"],
  ) => void;
}

export const useLoginRegisterFlow = create<LoginRegisterFlowStore>()(
  (set, get) => ({
    state: {
      stepKey: "greeting",
      accumulatedContext: {},
    },
    // state: {
    //   stepKey: "secondDataStepBuyer",
    //   accumulatedContext: {
    //     name: "Josue Comprador",
    //     role: "buyer",
    //     agreeToTermsAndConditions: true,
    //     password: "senha123",
    //     confirmPassword: "senha123",
    //     cpf: "047.685.271-40",
    //     email: "comprador@email.com",
    //   },
    // },
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

      if (action.command === "nextSeller") {
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

      if (action.command === "nextBuyer") {
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

    secondDataStepSellerAction: (action) => {
      const currentState = get().state;
      if (currentState.stepKey !== "secondDataStepSeller") {
        return console.warn(
          `Invalid action for current step " ${currentState.stepKey}"`,
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

    secondDataStepBuyerAction: (action) => {
      const currentState = get().state;
      if (currentState.stepKey !== "secondDataStepBuyer") {
        return console.warn(
          `Invalid action for current step but is second " ${currentState.stepKey}"`,
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
