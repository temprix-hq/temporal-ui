---
"@temporal-ui/core": minor
"@temporal-ui/react": minor
"@temporal-ui/solid": minor
---

Migrate `DataTable` to TanStack Table v9 (`@tanstack/react-table` and `@tanstack/solid-table` 9.2.4).

- Both packages create the table with one fixed feature set, exported as `dataTableFeatures` / `DataTableFeatures`: column visibility, row selection (rows keep `data-state="selected"`) and column filtering with the filtered row model. React now supports column filtering like Solid.
- `ColumnDef<TData>` and `AccessorKeyColumnDef<TData>` are aliases bound to that feature set, so existing column definitions keep their single-generic shape. `VisibilityState` and `RowData` are still exported.
- `DataTableProps` is now a type alias and no longer accepts `getCoreRowModel`; pass `columns`, `data`, `state` and `on*Change` handlers as before.
- The `data-table` entry points export a curated list instead of `export * from "@tanstack/*-table"`. Import any other TanStack symbol from `@tanstack/react-table` or `@tanstack/solid-table` directly.
- `@temporal-ui/solid` now requires `solid-js` `>=1.3.0`.
