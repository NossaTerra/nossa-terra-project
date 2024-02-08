import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  getBuyerDiffObject,
  type DiffObject,
  getSellerDiffObject,
} from "~/utils/formHelpers";
import { Button } from "../ui/button";
import { useState, useCallback } from "react";
import { type User } from "~/server/api/auth/types";
import { type UseFormReturn } from "react-hook-form";
import { type SecondDataStepBuyerFields } from "~/screens/LoginRegisterFlow/hooks/useSecondDataStepBuyerSchema";
import { type SecondDataStepSellerFields } from "~/screens/LoginRegisterFlow/hooks/useSecondDataStepSellerSchema";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { formatPhone } from "~/utils/formatters";

export function ProfileButton({
  user,
  isEditing,
  form,
  userLatitude,
  userLongitude,
}: {
  user?: User;
  userLatitude?: number | undefined;
  userLongitude?: number | undefined;
  isEditing: boolean | undefined;
  form:
    | UseFormReturn<SecondDataStepBuyerFields>
    | UseFormReturn<SecondDataStepSellerFields>;
}) {
  const [diffEditingObject, setDiffEditingObject] = useState<DiffObject>(
    {} as DiffObject,
  );
  const [open, setOpen] = useState(false);

  const onSave = useCallback(async () => {
    if (Object.keys(form.formState.errors).length > 0) {
      return;
    }
    if (isEditing) {
      setDiffEditingObject(
        user?.role === "buyer"
          ? getBuyerDiffObject(
              form as UseFormReturn<SecondDataStepBuyerFields>,
              user,
            )
          : getSellerDiffObject(
              form as UseFormReturn<SecondDataStepSellerFields>,
              user,
            ),
      );
    }
  }, [form, isEditing, user]);
  const editBuyer = api.profile.editBuyer.useMutation();
  const editSeller = api.profile.editSeller.useMutation();

  const onEdit = useCallback(async () => {
    if (user && user?.role === "buyer") {
      try {
        const buyerForm: SecondDataStepBuyerFields = form.getValues() as SecondDataStepBuyerFields;
        await editBuyer.mutateAsync({
          id: user.id,
          input: {
            avatarImage: buyerForm.avatarImage,
            businessMainSector: buyerForm.businessMainSector,
            social: {
              phone: formatPhone(buyerForm.phone),
              phoneUsesWhatsapp: buyerForm.phoneUsesWhatsapp,
              secondaryPhone: buyerForm.secondaryPhone
                ? formatPhone(buyerForm.secondaryPhone)
                : undefined,
              secondaryPhoneUsesWhatsapp: buyerForm.secondaryPhoneUsesWhatsapp,
              instagram: buyerForm.instagram,
            },
            address: {
              zipCode: buyerForm.zipCode,
              city: buyerForm.city,
              province: buyerForm.province,
              street: buyerForm.street,
              neighborhood: buyerForm.neighborhood,
              complementary: buyerForm.complementary,
              streetNumber: buyerForm.streetNumber,
              latitude: userLatitude,
              longitude: userLongitude,
            },
          },
        });
        window.location.reload();
      } catch (error) {
        setOpen(false);
        toast.error("Erro ao realizar alterações");
      }
    } else if (user && user?.role === "seller") {
      try {
        const sellerForm: SecondDataStepSellerFields = form.getValues() as SecondDataStepSellerFields;;
        await editSeller.mutateAsync({
          id: user.id,
          input: {
            rg: sellerForm.rg,
            social: {
              phone: formatPhone(sellerForm.phone),
              phoneUsesWhatsapp: sellerForm.phoneUsesWhatsapp,
            },
            address: {
              zipCode: sellerForm.zipCode,
              city: sellerForm.city,
              province: sellerForm.province,
              street: sellerForm.street,
              neighborhood: sellerForm.neighborhood,
              complementary: sellerForm.complementary,
              streetNumber: sellerForm.streetNumber,
              latitude: userLatitude,
              longitude: userLongitude,
            },
          },
        });
        toast.success("Alterações realizadas com sucesso");
        setOpen(false);
      } catch {
        toast.error("Erro ao realizar alterações");
        setOpen(false);
      }
    }
  }, [editBuyer, editSeller, form, user, userLatitude, userLongitude]);

  return (
    <div>
      <p className="text-sm">*Campo obrigatório</p>
      {isEditing ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="mt-3 w-full" asChild>
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              variant="default"
              onClick={onSave}
            >
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
                      const shouldRenderItem =
                        !!diffEditingObject?.[field]?.fieldName &&
                        !!diffEditingObject?.[field]?.currentValue;
                      return shouldRenderItem ? (
                        <li className="text-slate-600" key={field}>
                          <span>
                            {diffEditingObject?.[field]?.fieldName} alterado
                            para:
                          </span>
                          <div className="mb-3  text-lg text-black">
                            {diffEditingObject?.[field]?.currentValue ?? ""}
                          </div>
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
              {Object.keys(diffEditingObject).length !== 0 && (
                <Button
                  onClick={onEdit}
                  className="ml-auto w-44"
                  type="submit"
                  variant="primary"
                >
                  {" "}
                  Salvar Alterações
                </Button>
              )}
              <DialogClose />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          <Button variant="primary" className="mt-3 w-full" type="submit">
            Cadastrar
          </Button>
        </div>
      )}
    </div>
  );
}
