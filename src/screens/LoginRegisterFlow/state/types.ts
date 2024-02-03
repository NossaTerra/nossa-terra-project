import { type GreetingFields } from "../hooks/useGreetingSchema";
import { type WelcomeBackFields } from "../hooks/useWelcomeBackSchema";
import { type ChooseRoleFields } from "../hooks/useChooseRoleSchema";
import { type ExaustiveMap } from "~/utils/typescript";
import { type SecondDataStepSellerFields } from "../hooks/useSecondDataStepSellerSchema";
import { type SecondDataStepBuyerFields } from "../hooks/useSecondDataStepBuyerSchema";
import { type FirstDataStepFields } from "../hooks/useFirstDataStepSchema";

export const stepKeys = [
  "greeting",
  "welcomeBack",
  "chooseRole",
  "firstDataStep",
  "secondDataStepSeller",
  "secondDataStepBuyer",
] as const;
export type StepKey = (typeof stepKeys)[number];

export type StepData = ExaustiveMap<
  StepKey,
  {
    greeting: GreetingFields;
    welcomeBack: WelcomeBackFields;
    chooseRole: ChooseRoleFields;
    firstDataStep: FirstDataStepFields;
    secondDataStepSeller: SecondDataStepSellerFields;
    secondDataStepBuyer: SecondDataStepBuyerFields;
  }
>;

export type StepAccumulatedContext = ExaustiveMap<
  StepKey,
  {
    greeting: Record<string, never>;
    welcomeBack: StepData["greeting"];
    chooseRole: StepData["greeting"];
    firstDataStep: StepData["greeting"] & StepData["chooseRole"];
    secondDataStepSeller: StepData["greeting"] &
      StepData["chooseRole"] &
      StepData["firstDataStep"];
    secondDataStepBuyer: StepData["greeting"] &
      StepData["chooseRole"] &
      StepData["firstDataStep"];
  }
>;

export type StepState = {
  [K in StepKey]: {
    stepKey: K;
    accumulatedContext: StepAccumulatedContext[K];
  };
}[StepKey];
