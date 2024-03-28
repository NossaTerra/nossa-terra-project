import { create } from "zustand";
import { type TUserData } from "./user-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { AlertTriangleIcon } from "lucide-react";
import toast from "react-hot-toast";

interface UserActionsStore {
  action: "activate" | "deactivate" | "delete" | null;
  userData: TUserData | null;
  isOpen: boolean;

  openModalActivateUser: (userData: TUserData) => void;
  openModalDeactivateUser: (userData: TUserData) => void;
  openModalDeleteUser: (userData: TUserData) => void;

  closeModal: () => void;
}

export const useUserTableActions = create<UserActionsStore>()((set) => ({
  action: null,
  userData: null,
  isOpen: false,

  openModalActivateUser: (userData) =>
    set({ isOpen: true, userData, action: "activate" }),
  openModalDeactivateUser: (userData) =>
    set({ isOpen: true, userData, action: "deactivate" }),
  openModalDeleteUser: (userData) =>
    set({ isOpen: true, userData, action: "delete" }),

  closeModal: () => set({ isOpen: false }),
}));

export function ModalProviderUserActions() {
  const { action, userData, isOpen, closeModal } = useUserTableActions();

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeModal();
      }
    },
    [closeModal],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!!userData && (
        <>
          {action === "activate" && <ActivateDialogBody userData={userData} />}
          {action === "deactivate" && (
            <DeactivateDialogBody userData={userData} />
          )}
          {action === "delete" && <DeleteDialogBody userData={userData} />}
        </>
      )}
    </Dialog>
  );
}

function ActivateDialogBody({ userData }: { userData: TUserData }) {
  const closeModal = useUserTableActions((s) => s.closeModal);

  const apiUtils = api.useUtils();

  const apiChangeActiveState = api.backoffice.changeUserActiveState.useMutation(
    {
      onSuccess() {
        void apiUtils.backoffice.getAllBuyers.invalidate();
      },
      onError() {
        toast.error("Erro ao alterar estado de ativação");
      },
    },
  );

  const onActivate = useCallback(async () => {
    try {
      await apiChangeActiveState.mutateAsync({
        userId: userData.id,
        activeState: "active",
      });
      closeModal();
    } catch {
      console.log("Error changing activation state");
    }
  }, [apiChangeActiveState, closeModal, userData.id]);

  return (
    <>
      <DialogContent>
        <DialogTitle>Ativar {userData.name}</DialogTitle>
        <DialogDescription>
          Você tem certeza que deseja ativar{" "}
          <span className="font-bold">{userData.name}</span>?
          <ul className="ml-4 list-disc">
            <li>CPF/CNPJ: {userData.cpf}</li>
          </ul>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onActivate}>
            Ativar
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}

function DeactivateDialogBody({ userData }: { userData: TUserData }) {
  const closeModal = useUserTableActions((s) => s.closeModal);

  const apiUtils = api.useUtils();

  const apiChangeActiveState = api.backoffice.changeUserActiveState.useMutation(
    {
      onSuccess() {
        void apiUtils.backoffice.getAllBuyers.invalidate();
      },
      onError() {
        toast.error("Erro ao alterar estado de ativação");
      },
    },
  );

  const onDeactivate = useCallback(async () => {
    try {
      await apiChangeActiveState.mutateAsync({
        userId: userData.id,
        activeState: "inactive",
      });
      closeModal();
    } catch {
      console.log("Error changing activation state");
    }
  }, [apiChangeActiveState, closeModal, userData.id]);

  return (
    <>
      <DialogContent>
        <DialogTitle>Desativar {userData.name}</DialogTitle>
        <DialogDescription>
          Você tem certeza que deseja ativar{" "}
          <span className="font-bold">{userData.name}</span>?
          <ul className="ml-4 list-disc">
            <li>CPF/CNPJ: {userData.cpf}</li>
          </ul>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDeactivate}>
            Desativar
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}

function DeleteDialogBody({ userData }: { userData: TUserData }) {
  const closeModal = useUserTableActions((s) => s.closeModal);

  const apiUtils = api.useUtils();

  const apiDeleteUser = api.backoffice.deleteUser.useMutation({
    onSuccess() {
      void apiUtils.backoffice.getAllBuyers.invalidate();
    },
    onError() {
      toast.error("Erro ao deletar usuário");
    },
  });

  const onDelete = useCallback(async () => {
    try {
      await apiDeleteUser.mutateAsync({
        userId: userData.id,
      });
      toast.success("Usuário deletado com sucesso!");
      closeModal();
    } catch {
      console.log("Error deleting user");
    }
  }, [apiDeleteUser, closeModal, userData.id]);

  return (
    <>
      <DialogContent>
        <DialogTitle>
          <AlertTriangleIcon className="mb-3" />
          <div className="font-bold text-red-600">Remover {userData.name}</div>
        </DialogTitle>
        <DialogDescription>
          Você tem certeza que deseja{" "}
          <span className="font-bold text-red-600">Remover</span>{" "}
          <span className="font-bold">{userData.name}</span>?
          <ul className="ml-4 list-disc">
            <li>CPF/CNPJ: {userData.cpf}</li>
          </ul>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
