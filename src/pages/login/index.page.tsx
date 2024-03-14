import { ChooseRoleScreen } from "~/pages/login/LoginRegisterFlow/screens/ChooseRoleScreen";
import { FirstDataStepScreen } from "~/pages/login/LoginRegisterFlow/screens/FirstDataStepScreen";
import { GreetingScreen } from "~/pages/login/LoginRegisterFlow/screens/GreetingScreen";
import { WelcomeBackScreen } from "~/pages/login/LoginRegisterFlow/screens/WelcomeBackScreen";
import { SecondDataStepSellerScreen } from "~/pages/login/LoginRegisterFlow/screens/SecondDataStepSellerScreen";
import { useLoginRegisterFlow } from "~/pages/login/LoginRegisterFlow/state/machine";
import { SecondDataStepBuyerScreen } from "~/pages/login/LoginRegisterFlow/screens/SecondDataStepBuyerScreen";

import { AnimatePresence, motion } from "framer-motion";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { useRouter } from "next/router";
import { z } from "zod";
import { useInvokeCallbackOnce } from "~/hooks/useInvokeCallbackOnce";
import { useToastMustSignIn } from "~/pages/login/LoginRegisterFlow/useToastMustSignIn";
import {
  Direction,
  variants,
  transition,
} from "~/animation/horizontalCrossfade";
import useBeforeUnloadAndPopState from "~/pages/login/LoginRegisterFlow/hooks/useBeforeUnloadAndPopState";

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
  useBeforeUnloadAndPopState();

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
