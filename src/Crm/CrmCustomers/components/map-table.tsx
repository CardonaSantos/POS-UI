import { flexRender, Table } from "@tanstack/react-table";
import { ClienteTableDto } from "../CustomerTable";

interface Props {
  table: Table<ClienteTableDto>;
}

const CustomersTable = ({ table }: Props) => {
  return (
    <div className="w-full overflow-x-auto ">
      <table className="w-full  border-collapse">
        {/* HEADER */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b ">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-white uppercase tracking-wide"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody className="divide-y ">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={` transition-colors ${idx % 2 === 0 ? "" : ""}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-1 text-sm text-gray-700 border-b border-gray-100"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="text-center py-8 text-sm text-gray-400"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
