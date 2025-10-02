import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { EnhancedInput } from '../../../components/ui/EnhancedInput';

export default function EnhancedShowcase() {
  // Estados para os campos
  const [phoneIntl, setPhoneIntl] = useState('');
  const [phoneIntlData, setPhoneIntlData] = useState<any>(null);

  const [creditCard, setCreditCard] = useState('');
  const [creditCardData, setCreditCardData] = useState<any>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [addressNumber, setAddressNumber] = useState('');
  const [addressNumberData, setAddressNumberData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Componentes Avançados</h1>

        {/* Telefone Internacional */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">
            Telefone Internacional
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EnhancedInput
                label="Telefone Internacional"
                mask="internationalPhone"
                value={phoneIntl}
                onChange={(value, isValid, data) => {
                  setPhoneIntl(value);
                  setPhoneIntlData(data);
                }}
                required
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Dados Capturados:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Valor formatado:</span>
                    <span className="ml-2 font-mono text-krooa-blue">{phoneIntl || '(vazio)'}</span>
                  </div>
                  {phoneIntlData && (
                    <>
                      <div>
                        <span className="font-medium">País:</span>
                        <span className="ml-2">{phoneIntlData.country?.flag} {phoneIntlData.country?.name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Número completo:</span>
                        <span className="ml-2 font-mono text-green-600">{phoneIntlData.fullNumber}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Recursos:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✓ Seletor de país com bandeiras</li>
                <li>✓ Código do país automático</li>
                <li>✓ Máscara específica por país</li>
                <li>✓ 12 países pré-configurados</li>
                <li>✓ Número completo com código internacional</li>
              </ul>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <pre className="text-xs font-mono text-blue-900">
{`<EnhancedInput
  label="Telefone Internacional"
  mask="internationalPhone"
  defaultCountry="BR"
  onChange={(value, isValid, data) => {
    // data.country - país selecionado
    // data.fullNumber - número completo
  }}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Cartão de Crédito */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">
            Cartão de Crédito com Detecção de Bandeira
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EnhancedInput
                label="Número do Cartão"
                mask="creditCard"
                validation="creditCard"
                value={creditCard}
                onChange={(value, isValid, data) => {
                  setCreditCard(value);
                  setCreditCardData(data);
                }}
                placeholder="0000 0000 0000 0000"
                required
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Dados Capturados:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Número:</span>
                    <span className="ml-2 font-mono text-krooa-blue">{creditCard || '(vazio)'}</span>
                  </div>
                  {creditCardData?.brand && (
                    <div>
                      <span className="font-medium">Bandeira detectada:</span>
                      <span className="ml-2 text-green-600 font-semibold">{creditCardData.brand}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Teste com números:</strong><br />
                  • Visa: 4111 1111 1111 1111<br />
                  • Mastercard: 5200 0000 0000 0000<br />
                  • Amex: 3400 0000 0000 000<br />
                  • Elo: 6363 6800 0000 0000
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Recursos:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✓ Detecção automática da bandeira</li>
                <li>✓ Logo da bandeira no campo</li>
                <li>✓ Máscara de 16 dígitos</li>
                <li>✓ Validação de número</li>
                <li>✓ Suporte: Visa, Master, Amex, Elo, etc</li>
              </ul>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <pre className="text-xs font-mono text-blue-900">
{`<EnhancedInput
  label="Número do Cartão"
  mask="creditCard"
  validation="creditCard"
  onChange={(value, isValid, data) => {
    // data.brand - bandeira detectada
  }}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Campo de Senha */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">
            Campo de Senha com Visualização
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EnhancedInput
                label="Senha"
                mask="password"
                value={password}
                onChange={setPassword}
                showPasswordToggle
                required
              />

              <EnhancedInput
                label="Confirmar Senha"
                mask="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPasswordToggle
                error={confirmPassword && confirmPassword !== password ? 'As senhas não coincidem' : ''}
                required
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Status:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Senha:</span>
                    <span className="ml-2 font-mono">{password ? '••••••••' : '(vazio)'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Senhas coincidem:</span>
                    <span className={`ml-2 font-semibold ${password && confirmPassword && password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                      {password && confirmPassword ? (password === confirmPassword ? '✓ Sim' : '✗ Não') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Recursos:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✓ Botão de mostrar/ocultar senha</li>
                <li>✓ Ícone de olho intuitivo</li>
                <li>✓ Validação de confirmação</li>
                <li>✓ Campo seguro (type="password")</li>
                <li>✓ Toggle individual por campo</li>
              </ul>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <pre className="text-xs font-mono text-blue-900">
{`<EnhancedInput
  label="Senha"
  mask="password"
  showPasswordToggle={true}
  onChange={setPassword}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Número de Endereço */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b">
            Número de Endereço com Opção "Sem Número"
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EnhancedInput
                label="Número"
                mask="addressNumber"
                value={addressNumber}
                onChange={(value, isValid, data) => {
                  setAddressNumber(value);
                  setAddressNumberData(data);
                }}
                allowNoNumber
                noNumberText="S/N"
                required
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Dados Capturados:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Valor:</span>
                    <span className="ml-2 font-mono text-krooa-blue">{addressNumber || '(vazio)'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Sem número:</span>
                    <span className={`ml-2 font-semibold ${addressNumberData?.noNumber ? 'text-green-600' : 'text-gray-600'}`}>
                      {addressNumberData?.noNumber ? '✓ Sim' : '✗ Não'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Comportamento:</strong><br />
                  • Marque "S/N" para endereços sem número<br />
                  • O campo é desabilitado quando marcado<br />
                  • Valor enviado: "S/N" quando marcado
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Recursos:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✓ Checkbox "Sem número" integrado</li>
                <li>✓ Campo desabilitado quando S/N</li>
                <li>✓ Valor "S/N" automático</li>
                <li>✓ Aceita apenas números</li>
                <li>✓ Texto customizável do checkbox</li>
              </ul>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <pre className="text-xs font-mono text-blue-900">
{`<EnhancedInput
  label="Número"
  mask="addressNumber"
  allowNoNumber={true}
  noNumberText="S/N"
  onChange={(value, isValid, data) => {
    // data.noNumber - true se S/N
  }}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}