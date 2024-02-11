import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "~/components/ui/checkbox";

import { UserTableColumnHeader } from "./user-table-column-header";
import { UserTableRowActions } from "./user-table-row-actions";
import { type TUserData } from "./user-table";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  BusinessSectorLabel,
  UserActiveStateLabel,
} from "~/server/types/user.type";
import { Badge } from "~/components/ui/badge";

export const userColumns = [
  {
    id: "select" as const,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { name } = row.original;
      const fallbackInitials = name.slice(0, 2).toUpperCase();

      return (
        <div className="flex items-center gap-2 space-x-2">
          <Avatar className="">
            <AvatarImage
              src={row.original.avatarImage ?? undefined}
              alt="User Image"
            />
            <AvatarFallback>{fallbackInitials}</AvatarFallback>
          </Avatar>
          <span className="max-w-[500px] truncate font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "businessMainSector" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { businessMainSector } = row.original;
      if (!businessMainSector) return null;

      return (
        <div className="flex items-center">
          <span>{BusinessSectorLabel[businessMainSector]}</span>
        </div>
      );
    },
    filterFn: (row, colId, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.getValue(colId));
    },
  },
  {
    accessorKey: "email" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { email } = row.original;
      return (
        <div className="flex items-center">
          <span>{email}</span>
        </div>
      );
    },
    filterFn: (row, colId, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.getValue(colId));
    },
  },
  {
    accessorKey: "cpf" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { cpf } = row.original;
      return (
        <div className="flex items-center">
          <span>{cpf}</span>
        </div>
      );
    },
    filterFn: (row, colId, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.getValue(colId));
    },
  },
  {
    accessorKey: "rg" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { rg } = row.original;
      return (
        <div className="flex items-center">
          <span>{rg}</span>
        </div>
      );
    },
    filterFn: (row, colId, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.getValue(colId));
    },
  },
  {
    accessorKey: "activeState" as const,
    header: ({ column }) => <UserTableColumnHeader column={column} />,
    cell: ({ row }) => {
      const { activeState } = row.original;
      return (
        <div className="flex w-[100px] items-center">
          <Badge variant={activeState}>
            {UserActiveStateLabel[activeState]}
          </Badge>
        </div>
      );
    },
    filterFn: (row, colId, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.includes(row.getValue(colId));
    },
  },
  {
    id: "actions" as const,
    cell: ({ row }) => <UserTableRowActions row={row} />,
  },
] satisfies ColumnDef<TUserData>[];

export const userColumnKeys = userColumns
  .map((column) => column.id ?? column.accessorKey)
  .filter(Boolean);

export type UserColumnKey = (typeof userColumnKeys)[number];

export function getColumnLabel(columnKey: UserColumnKey) {
  if (columnKey === "id") return "Id";
  if (columnKey === "name") return "Nome";
  if (columnKey === "email") return "Email";
  if (columnKey === "businessMainSector") return "Ramo Principal";
  if (columnKey === "actions") return "Ações";
  if (columnKey === "activeState") return "Ativação";
  if (columnKey === "cpf") return "CPF / CNPJ";

  return columnKey;
}

export type UserColumnVisibilityState = {
  [K in UserColumnKey]?: boolean;
};

export const initialColumnVisibility: UserColumnVisibilityState = {
  id: false,
  cpf: false,
  rg: false,
};
