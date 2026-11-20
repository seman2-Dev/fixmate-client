"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
    /** hide the mobile label (e.g. for the primary cell) */
    noLabel?: boolean;
  }
}

/**
 * Sortable + paginated table built on TanStack Table (headless) and the shadcn Table.
 * Phase 2: switch to server-side sorting/pagination by flipping manualSorting/manualPagination.
 */
export function DataTable<T>({
  columns,
  data,
  pageSize = 8,
  initialSort,
  className,
}: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  pageSize?: number;
  initialSort?: SortingState;
  className?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSort ?? []);
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is safe here; the table instance is not passed to memoized children
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const sortable = table.getAllLeafColumns().filter((c) => c.getCanSort());
  const { pageIndex } = table.getState().pagination;
  const total = data.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);
  const active = sorting[0];

  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      {/* Phones hide the header row, so sorting moves into a compact control */}
      {sortable.length > 0 && (
        <div className="flex items-center gap-2 border-b p-3 md:hidden">
          <label htmlFor="dt-sort" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Sort
          </label>
          <NativeSelect
            id="dt-sort"
            className="h-9 text-sm"
            value={active?.id ?? ""}
            onChange={(e) => setSorting(e.target.value ? [{ id: e.target.value, desc: active?.desc ?? false }] : [])}
          >
            <option value="">Default order</option>
            {sortable.map((c) => (
              <option key={c.id} value={c.id}>
                {String(c.columnDef.header)}
              </option>
            ))}
          </NativeSelect>
          <Button
            variant="outline"
            size="icon-sm"
            className="shrink-0"
            disabled={!active}
            aria-label={active?.desc ? "Sorted descending" : "Sorted ascending"}
            onClick={() => active && setSorting([{ id: active.id, desc: !active.desc }])}
          >
            {active?.desc ? <ArrowDown /> : <ArrowUp />}
          </Button>
        </div>
      )}

      <Table stacked>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h) => {
                const canSort = h.column.getCanSort();
                const dir = h.column.getIsSorted();
                return (
                  <TableHead
                    key={h.id}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : canSort ? "none" : undefined}
                    className={h.column.columnDef.meta?.className}
                  >
                    {h.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={h.column.getToggleSortingHandler()}
                        className="-mx-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 uppercase transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {dir === "asc" ? (
                          <ArrowUp className="size-3.5 text-primary" />
                        ) : dir === "desc" ? (
                          <ArrowDown className="size-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  data-label={cell.column.columnDef.meta?.noLabel ? "" : String(cell.column.columnDef.header ?? "")}
                  className={cell.column.columnDef.meta?.className}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {total > pageSize && (
        <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm sm:flex-row">
          <p className="text-muted-foreground" aria-live="polite">
            Showing <strong className="text-foreground">{from}–{to}</strong> of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft /> Prev
            </Button>
            <span className="min-w-16 text-center text-xs font-semibold text-muted-foreground tabular-nums">
              {pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
