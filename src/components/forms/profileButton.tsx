import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getBuyerDiffObject, type DiffObject, getSellerDiffObject } from "~/utils/helpers";
import { Button } from "../ui/button";
import { useState, useCallback } from "react";
import { type User } from "~/server/api/auth/types";
import { type UseFormReturn } from "react-hook-form";
import { type SecondDataStepBuyerFields } from "~/Screens/LoginRegisterFlow/hooks/useSecondDataStepBuyerSchema";
import { type SecondDataStepSellerFields } from "~/Screens/LoginRegisterFlow/hooks/useSecondDataStepSellerSchema";

export function ProfileButton({
  user,
  isEditing,
  form,
}: {
  user?: User 
  isEditing: boolean | undefined;
  form: UseFormReturn<SecondDataStepBuyerFields> |  UseFormReturn<SecondDataStepSellerFields>;
}) {
  const [diffEditingObject, setDiffEditingObject] = useState<DiffObject>(
    {} as DiffObject,
  );

  const onSave = useCallback(async () => {
    if (isEditing) {
      setDiffEditingObject(
        user?.role === 'buyer'
          ?  getBuyerDiffObject(form as UseFormReturn<SecondDataStepBuyerFields>, user) 
           : getSellerDiffObject(form as UseFormReturn<SecondDataStepSellerFields>, user) );   
           }
  }, [form, isEditing, user]);

  return (
    <>
      {isEditing ? (
        <Dialog>
          <DialogTrigger className="mt-7" asChild>
            <Button variant="default" onClick={onSave}>
              Salvar Alterações
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] md:w-auto">
            <DialogHeader>
              <DialogTitle className="mb-4">Alterações</DialogTitle>
              <div className="prose flex max-h-[60vh] flex-col items-start justify-start overflow-y-auto pb-3 text-justify md:px-4">
                {Object.keys(diffEditingObject).length === 0 ? (
                  <p className="text-slate-600">Nenhuma alteração realizada</p>
                ) : (
                  <ul className="px-4">
                  {Object.keys(diffEditingObject).map((field) => {
                    const shouldRenderItem = !!diffEditingObject?.[field]?.fieldName && !!diffEditingObject?.[field]?.currentValue; 
                    return shouldRenderItem ? (
                      <li className="text-slate-600" key={field}>
                        <span>
                          {diffEditingObject?.[field]?.fieldName} alterado para:
                        </span>
                        <div className="mb-3  text-lg text-black">
                          {diffEditingObject?.[field]?.currentValue?? ""} 
                        </div>
                      </li>
                    ) : null;
                  })}
                </ul>
                )}
              </div>
              {Object.keys(diffEditingObject).length !== 0 && <Button
                onClick={() => {
                  console.log("hey");
                }}
                className="ml-auto w-44"
                type="submit"
                variant="primary"
              > Salvar Alterações
              </Button>}
              <DialogClose />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          <p className="pb-3 text-sm">*Campo obrigatório</p>
          <Button variant="primary" className="w-full" type="submit">
            Cadastrar
          </Button>
        </div>
      )}
    </>
  );
}
