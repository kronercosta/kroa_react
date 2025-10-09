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
  loading?: boolean;
  emptyMessage?: string;
  responsive?: 'scroll' | 'stack' | 'cards';
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = '',
  hoverable = true,
  striped = false,
  sticky = false,
  loading = false,
  emptyMessage,
  responsive = 'scroll',
  mobileBreakpoint = 'md'
}) => {
  const uiTranslations = useUITranslation();

  const getAlignmentClass = (align: 'left' | 'center' | 'right' = 'left') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const getBreakpointClass = () => {
    switch (mobileBreakpoint) {
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      default: return 'md';
    }
  };

  const breakpoint = getBreakpointClass();

  // Cards view for mobile
  if (responsive === 'cards') {
    return (
      <div className={className}>
        {/* Desktop Table */}
        <div className={`hidden ${breakpoint}:block overflow-hidden bg-white rounded-lg border border-gray-200`}>
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
                    <td colSpan={columns.length} className="py-12 text-center text-gray-500">
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

        {/* Mobile Cards */}
        <div className={`${breakpoint}:hidden space-y-4`}>
          {data.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              {emptyMessage || uiTranslations?.table?.emptyMessage || 'Nenhum dado encontrado'}
            </div>
          ) : (
            data.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`
                  bg-white rounded-lg border border-gray-200 p-4 space-y-3
                  ${hoverable ? 'hover:shadow-md transition-shadow' : ''}
                `}
              >
                {columns.map((column) => (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 flex-shrink-0 mr-3">
                      {column.title}:
                    </span>
                    <span className="text-sm text-gray-900 text-right flex-1">
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key] || '-'
                      }
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Stack view for mobile
  if (responsive === 'stack') {
    return (
      <div className={className}>
        {/* Desktop Table */}
        <div className={`hidden ${breakpoint}:block overflow-hidden bg-white rounded-lg border border-gray-200`}>
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
                    <td colSpan={columns.length} className="py-12 text-center text-gray-500">
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

        {/* Mobile Stack */}
        <div className={`${breakpoint}:hidden bg-white rounded-lg border border-gray-200 overflow-hidden`}>
          {data.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              {emptyMessage || uiTranslations?.table?.emptyMessage || 'Nenhum dado encontrado'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`
                    p-4 space-y-2
                    ${hoverable ? 'hover:bg-gray-50' : ''}
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-25' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <div key={column.key}>
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                        {column.title}
                      </div>
                      <div className="text-sm text-gray-900">
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : row[column.key] || '-'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default scroll view with better mobile optimization
  return (
    <div className={`w-full max-w-full ${className}`}>
      {/* Enhanced scroll container for mobile */}
      <div className="overflow-hidden bg-white rounded-lg border border-gray-200 w-full">
        <div
          className="overflow-x-auto w-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <table className="min-w-full table-fixed sm:table-auto">
            <thead className={`bg-gray-50 ${sticky ? 'sticky top-0 z-10' : ''}`}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className={`
                      ${getAlignmentClass(column.align)}
                      py-3 px-2 sm:px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50
                      ${index === 0 ? 'first:rounded-tl-lg' : ''}
                      ${index === columns.length - 1 ? 'last:rounded-tr-lg' : ''}
                      min-w-[100px] sm:min-w-0
                    `}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    <div className="truncate" title={column.title}>
                      {column.title}
                    </div>
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
                    {emptyMessage || uiTranslations?.table?.emptyMessage || 'Nenhum dados encontrado'}
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
                          py-2.5 px-2 sm:px-4 text-sm text-gray-900
                          min-w-[100px] sm:min-w-0
                        `}
                      >
                        <div className="truncate sm:whitespace-normal" title={
                          column.render ? undefined : (row[column.key] || '-').toString()
                        }>
                          {column.render
                            ? column.render(row[column.key], row, rowIndex)
                            : row[column.key] || '-'
                          }
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile hint for scrolling */}
      <div className="sm:hidden text-xs text-gray-500 text-center mt-2 px-4">
        ← Deslize para ver mais colunas →
      </div>
    </div>
  );
};