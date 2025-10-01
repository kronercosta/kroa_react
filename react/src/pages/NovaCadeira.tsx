import React from 'react';

const NovaCadeira: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nova Cadeira</h1>
        <p className="text-gray-600 mt-2">Configure uma nova cadeira odontológica para sua clínica</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Principais</h2>
            <p className="text-gray-600">
              Use o painel lateral para configurar os detalhes da nova cadeira.
              O aside com efeito glassmorphism aparece automaticamente nesta página.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Status</h3>
              <p className="text-sm text-gray-600">Configure o status inicial da cadeira no painel lateral</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Equipamentos</h3>
              <p className="text-sm text-gray-600">Selecione os equipamentos disponíveis</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-blue-800">
                O painel lateral à direita contém o formulário completo para cadastro da cadeira com efeito glassmorphism.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaCadeira;