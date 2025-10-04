import React from 'react';

interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
  hoverable?: boolean;
  striped?: boolean;
  sticky?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = '',
  hoverable = true,
  striped = false,
  sticky = false,
  loading = false,
  emptyMessage = 'Nenhum dado encontrado'
}) => {
  const getAlignmentClass = (align: 'left' | 'center' | 'right' = 'left') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (loading) {
    return (
      <div className="min-w-full bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-krooa-green"></div>
          <span className="ml-3 text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className={`bg-gray-50 ${sticky ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`
                    ${getAlignmentClass(column.align)}
                    py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50
                    ${index === 0 ? 'first:rounded-tl-lg' : ''}
                    ${index === columns.length - 1 ? 'last:rounded-tr-lg' : ''}
                  `}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y divide-gray-100' : ''}`}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    ${hoverable ? 'hover:bg-gray-50' : ''}
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-25' : ''}
                    transition-colors duration-150
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        ${getAlignmentClass(column.align)}
                        py-2.5 px-4 text-sm text-gray-900
                      `}
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key] || '-'
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componentes auxiliares para melhor organização
export const TableActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`flex items-center justify-end gap-1 ${className}`}>
    {children}
  </div>
);

export const TableCell: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}> = ({
  children,
  align = 'left',
  className = ''
}) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <div className={`${alignClass} ${className}`}>
      {children}
    </div>
  );
};