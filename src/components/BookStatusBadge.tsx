export function BookStatusBadge({ status, className }: { status: string; className?: string }) {
  const statusInfo: { [key: string]: { style: string; text: string } } = {
    exchange: { style: "bg-blue-100 text-blue-800", text: "Exchange" },
    sale: { style: "bg-green-100 text-green-800", text: "Sale" },
    sold: { style: "bg-gray-200 text-gray-800", text: "Sold" }
  };

  return (
    statusInfo[status] && (
      <span
        className={`inline-block px-3 py-1 mb-3 text-sm font-semibold rounded-full ${statusInfo[status].style} ${className}`}
      >
        {statusInfo[status].text}
      </span>
    )
  );
}
