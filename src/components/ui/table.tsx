import { cn } from "@/lib/utils";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-body">{children}</table>
    </div>
  );
}

export function Thead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-line bg-raised border-b">
        {columns.map((column, index) => (
          <th
            // Action columns have empty labels, so position is the only unique key.
            key={`${index}-${column}`}
            scope="col"
            className="text-muted px-5 py-2.5 text-left text-tiny font-semibold tracking-wide whitespace-nowrap uppercase"
          >
            {column === "" ? <span className="sr-only">Actions</span> : column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Tr({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-line hover:bg-raised border-b transition-colors last:border-b-0",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("text-secondary px-5 py-3 align-middle", className)}>{children}</td>;
}
