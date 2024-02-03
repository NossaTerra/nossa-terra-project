import { ChooseRoleScreen } from "~/screens/LoginRegisterFlow/screens/ChooseRoleScreen";
import { FirstDataStepScreen } from "~/screens/LoginRegisterFlow/screens/FirstDataStepScreen";
import { GreetingScreen } from "~/screens/LoginRegisterFlow/screens/GreetingScreen";
import { WelcomeBackScreen } from "~/screens/LoginRegisterFlow/screens/WelcomeBackScreen";
import { SecondDataStepSellerScreen } from "~/screens/LoginRegisterFlow/screens/SecondDataStepSellerScreen";
import { useLoginRegisterFlow } from "~/screens/LoginRegisterFlow/state/machine";
import { SecondDataStepBuyerScreen } from "~/screens/LoginRegisterFlow/screens/SecondDataStepBuyerScreen";

import {
  AnimatePresence,
  type Variants,
  motion,
  type Transition,
} from "framer-motion";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { useRouter } from "next/router";
import { z } from "zod";
import { useInvokeCallbackOnce } from "~/hooks/useInvokeCallbackOnce";
import { useToastMustSignIn } from "~/screens/LoginRegisterFlow/useToastMustSignIn";
import { Direction, variants, transition } from "~/animation/horizontalCrossfade";

export const getServerSideProps = redirectGetServerSideProps.Public;

function useToastWhenRedirected() {
  const toastMustSignIn = useToastMustSignIn();

  const router = useRouter();
  const hasRedirectQueryParam = z
    .string()
    .safeParse(router.query.redirect).success;

  useInvokeCallbackOnce({
    callback: toastMustSignIn,
    shouldInvoke: hasRedirectQueryParam,
  });
}

export default function RootScreen() {
  useToastWhenRedirected();

  const stepKey = useLoginRegisterFlow((s) => s.state.stepKey);
  const lastCommand = useLoginRegisterFlow((s) => s.lastCommand);

  const direction = lastCommand === "goBack" ? Direction.Left : Direction.Right;

  return (
    <div className="w-screen overflow-x-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={stepKey}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          variants={variants}
          transition={transition}
          className="w-screen"
        >
          {stepKey === "greeting" && <GreetingScreen />}
          {stepKey === "welcomeBack" && <WelcomeBackScreen />}
          {stepKey === "chooseRole" && <ChooseRoleScreen />}
          {stepKey === "firstDataStep" && <FirstDataStepScreen />}
          {stepKey === "secondDataStepSeller" && <SecondDataStepSellerScreen />}
          {stepKey === "secondDataStepBuyer" && <SecondDataStepBuyerScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
