import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { useRegion } from '../../../../contexts/RegionContext';

interface DocumentSection {
  title: string;
  content: string;
}

interface DocumentData {
  title: string;
  lastUpdated: string;
  sections: DocumentSection[];
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentData | null;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  onAccept,
  showAcceptButton = false
}) => {
  const { currentRegion } = useRegion();

  // Mapear região para idioma
  const getLanguageByRegion = (region: string) => {
    switch (region) {
      case 'BR': return 'PT';
      case 'US': return 'EN';
      default: return 'PT';
    }
  };

  const language = getLanguageByRegion(currentRegion);

  if (!document) return null;

  const handleAccept = () => {
    onAccept?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      size="xl"
    >
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Header with update date */}
        <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Documento Legal</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            {document.lastUpdated}
          </div>
        </div>

        {/* Document content */}
        <div className="space-y-8">
          {document.sections.map((section, index) => (
            <div key={index} className="group">
              {/* Section header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">
                    {section.title}
                  </h3>
                </div>
              </div>

              {/* Section content */}
              <div className="ml-11 text-sm text-gray-700 leading-relaxed">
                <div className="bg-gray-50 border-l-4 border-blue-200 pl-4 py-3 rounded-r-lg whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Importante</p>
                <p className="text-blue-700">
                  Este documento possui validade jurídica. Ao aceitar os termos, você concorda com todas as cláusulas descritas acima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-4 rounded-b-lg">
        <Button
          variant="secondary"
          onClick={onClose}
          className="min-w-[100px]"
        >
          {language === 'PT' ? 'Fechar' : language === 'EN' ? 'Close' : 'Cerrar'}
        </Button>

        {showAcceptButton && (
          <Button
            variant="primary"
            onClick={handleAccept}
            className="min-w-[140px]"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconPosition="left"
          >
            {language === 'PT' ? 'Aceitar Termos' : language === 'EN' ? 'Accept Terms' : 'Aceptar Términos'}
          </Button>
        )}
      </div>
    </Modal>
  );
};