import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useId } from "react";
import toast from "react-hot-toast";

const duration = 4000;

export const useToastMustSignIn = () => {
  const key = useId();

  return useCallback(
    () =>
      toast.custom(
        (t) => (
          <AnimatePresence>
            {t.visible && (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-200 p-6 shadow-md"
              >
                <h4 className="text-lg text-red-500">
                  Por favor se autentique para acessar esta página
                </h4>
              </motion.div>
            )}
          </AnimatePresence>
        ),
        {
          duration,
        },
      ),
    [key],
  );
};
