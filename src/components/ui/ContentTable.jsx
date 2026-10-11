/** Simple responsive table for page copy: { head: string[], rows: string[][] }. */
export default function ContentTable({ table }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-section">
            {table.head.map((heading) => (
              <th key={heading} className="px-4 py-3 font-semibold text-primary">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-border last:border-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cell}
                  className={`px-4 py-3 align-top ${cellIndex === 0 ? 'font-medium text-primary' : 'text-textSecondary'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
