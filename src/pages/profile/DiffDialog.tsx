import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { create } from "zustand";
import { type DiffObject } from "~/utils/formHelpers";
import { Button, type ButtonProps } from "~/components/ui/button";
import { useCallback } from "react";

interface DiffDialogStore {
  isOpen: boolean;
  diffObject: DiffObject | null;
  onClose: () => void;

  onConfirm?: () => void;
  onCancel?: () => void;
}

const useDiffDialogStore = create<DiffDialogStore>((set) => ({
  isOpen: false,
  diffObject: null,
  onClose: () => set({ isOpen: false }),
}));

export function awaitDiffConfirmationDialog(diffObject: DiffObject) {
  return new Promise<void>((resolve, reject) => {
    useDiffDialogStore.setState({
      diffObject,
      isOpen: true,
      onConfirm: resolve,
      onCancel: reject,
    });
  });
}

export function DiffDialog({ buttonProps }: { buttonProps?: ButtonProps }) {
  const { isOpen, diffObject, onClose, onCancel, onConfirm } =
    useDiffDialogStore();

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel?.();
        onClose();
      }
    },
    [onCancel, onClose],
  );

  const onConfirmButton = useCallback(() => {
    console.log(onConfirm);
    onConfirm?.();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:w-auto">
        {diffObject && <DiffContent diffObject={diffObject} />}
        {diffObject && Object.keys(diffObject).length !== 0 && (
          <Button
            onClick={onConfirmButton}
            className="ml-auto w-44"
            type="submit"
            variant="primary"
            {...buttonProps}
          >
            {" "}
            Salvar Alterações
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DiffContent({ diffObject }: { diffObject: DiffObject }) {
  return (
    <DialogHeader>
      <DialogTitle className="mb-4">Alterações</DialogTitle>
      <div className="prose flex max-h-[60vh] flex-col items-start justify-start overflow-y-auto pb-3 text-justify md:px-4">
        {Object.keys(diffObject).length === 0 ? (
          <p className="text-slate-600">Nenhuma alteração realizada</p>
        ) : (
          <ul className="px-4">
            {Object.keys(diffObject).map((field) => {
              const shouldRenderItem =
                !!diffObject?.[field]?.fieldName &&
                !!diffObject?.[field]?.currentValue;

              return shouldRenderItem ? (
                <li className="text-slate-600" key={field}>
                  <span>{diffObject?.[field]?.fieldName} alterado para:</span>
                  <div className="mb-3  text-lg text-black">
                    {diffObject?.[field]?.currentValue ?? ""}
                  </div>
                </li>
              ) : null;
            })}
          </ul>
        )}
      </div>
      <DialogClose />
    </DialogHeader>
  );
}
