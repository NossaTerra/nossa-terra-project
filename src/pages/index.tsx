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

enum Direction {
  Left = "left",
  Right = "right",
}

const variants = {
  enter: (direction: Direction) => ({
    x: direction === Direction.Left ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === Direction.Left ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
  }),
} as const satisfies Variants;

const transition: Transition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

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
