import React from 'react';
import { useUITranslation } from '../../hooks/useUITranslation';

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
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = '',
  hoverable = true,
  striped = false,
  sticky = false,
  emptyMessage
}) => {
  const uiTranslations = useUITranslation();
  const getAlignmentClass = (align: 'left' | 'center' | 'right' = 'left') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

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
                  {emptyMessage || uiTranslations?.table?.emptyMessage || 'Nenhum dado encontrado'}
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