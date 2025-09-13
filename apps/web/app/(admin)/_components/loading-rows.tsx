import { TableCell, TableRow } from '@kiriha/ui/table'

interface LoadingRowsProps {
  cells: number
  rows?: number
}

export function LoadingRows({ rows, cells }: LoadingRowsProps) {
  return Array.from({ length: rows ?? 10 }, (_, idx) => (
    <TableRow key={idx} className='h-14'>
      {Array.from({ length: cells }, (_, cellIdx) => (
        <TableCell key={cellIdx}>
          <div className='animate-pulse rounded-sm bg-muted-foreground'>
            &nbsp;
          </div>
        </TableCell>
      ))}
    </TableRow>
  ))
}
