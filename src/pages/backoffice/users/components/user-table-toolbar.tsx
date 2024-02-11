import { type Table } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import {
  type UserFacetedFilterOption,
  UserTableFacetedFilter,
} from "./user-table-faceted-filter";
import { RotateCwIcon } from "lucide-react";
import { UserTableViewOptions } from "./user-table-view-options";
import { getColumnLabel } from "./user-table-columns";
import { type TUserData } from "./user-table";
import {
  BusinessSectorLabel,
  UserActiveStateLabel,
  UserActiveState,
  BusinessSector,
} from "~/server/types/user.type";
import { useMemo } from "react";
import { Badge } from "~/components/ui/badge";

export function UserTableToolbar({ table }: { table: Table<TUserData> }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <ActiveStateFacetedFilter table={table} />
        <BusinessMainSectorFacetedFilter table={table} />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <RotateCwIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <UserTableViewOptions table={table} />
    </div>
  );
}

function ActiveStateFacetedFilter({ table }: { table: Table<TUserData> }) {
  const options = useMemo(
    () =>
      Object.values(UserActiveState).map((value) => ({
        value,
        label: UserActiveStateLabel[value],
        displayElement: (
          <Badge variant={value}>{UserActiveStateLabel[value]}</Badge>
        ),
      })) satisfies UserFacetedFilterOption<UserActiveState>[],
    [],
  );

  const column = table.getColumn("activeState");
  if (!column) {
    return null;
  }

  return (
    <UserTableFacetedFilter
      column={table.getColumn("activeState")}
      title={getColumnLabel("activeState")}
      options={options}
    />
  );
}

function BusinessMainSectorFacetedFilter({
  table,
}: {
  table: Table<TUserData>;
}) {
  const options = useMemo(
    () =>
      Object.values(BusinessSector).map((value) => ({
        value,
        label: BusinessSectorLabel[value],
      })) satisfies UserFacetedFilterOption<BusinessSector>[],
    [],
  );

  const column = table.getColumn("businessMainSector");
  if (!column) {
    return null;
  }

  return (
    <UserTableFacetedFilter
      column={table.getColumn("businessMainSector")}
      title={getColumnLabel("businessMainSector")}
      options={options}
    />
  );
}
