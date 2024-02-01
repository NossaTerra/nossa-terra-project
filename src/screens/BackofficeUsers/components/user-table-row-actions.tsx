import { type Row } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { UserActiveState } from "~/server/api/auth/types";
import { type TUserData } from "./user-table";
import { useUserTableActions } from "./user-table-actions";
import { useCallback } from "react";

export function UserTableRowActions({ row }: { row: Row<TUserData> }) {
  const { activeState } = row.original;
  const {
    openModalActivateUser,
    openModalDeactivateUser,
    openModalDeleteUser,
  } = useUserTableActions();

  const onActivate = useCallback(
    () => openModalActivateUser(row.original),
    [openModalActivateUser, row.original],
  );

  const onDeactivate = useCallback(
    () => openModalDeactivateUser(row.original),
    [openModalDeactivateUser, row.original],
  );

  const onDelete = useCallback(
    () => openModalDeleteUser(row.original),
    [openModalDeleteUser, row.original],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          disabled={activeState === UserActiveState.active}
          onClick={onActivate}
        >
          <div className="mr-2 h-2 w-2 rounded-full bg-green-900" />
          Ativar
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={activeState === UserActiveState.inactive}
          onClick={onDeactivate}
        >
          <div className="mr-2 h-2 w-2 rounded-full bg-red-900" />
          Desativar
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          disabled={activeState !== UserActiveState.inactive}
          onClick={onDelete}
        >
          <Trash2Icon className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
