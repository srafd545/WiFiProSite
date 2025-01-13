import React, { useState, useEffect } from 'react';
import { registerUser, loginUser, initiatePasswordRecovery, verifyRecoveryCode, updatePassword } from './utils/auth';
import { translations } from './utils/translations';

function App() {
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const t = translations[language];
  const [formMode, setFormMode] = useState<'login' | 'register' | 'recovery' | 'verify-code' | 'new-password'>('login');
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState('');
  const [networkDetails, setNetworkDetails] = useState({
    name: '',
    speed: '',
    signal: '',
    ipAddress: '',
    macAddress: '',
  });

  useEffect(() => {
    if (isConnected) {
      updateNetworkInfo();
    }
  }, [isConnected]);

  const updateNetworkInfo = async () => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      setNetworkDetails({
        name: connection?.type === 'wifi' ? 'WiFi' : 'Unknown Network',
        speed: connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown',
        signal: connection?.signalStrength ? `${connection.signalStrength}%` : 'Good',
        ipAddress: data.ip || 'Unknown',
        macAddress: 'Not Available',
      });
    } catch (error) {
      console.error('Failed to fetch network info:', error);
      setNetworkDetails({
        name: connection?.type === 'wifi' ? 'WiFi' : 'Unknown Network',
        speed: connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown',
        signal: connection?.signalStrength ? `${connection.signalStrength}%` : 'Good',
        ipAddress: 'Unable to fetch',
        macAddress: 'Not Available',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (formMode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          return;
        }
        
        const result = await registerUser(email, password);
        if (result.success) {
          setFormMode('login');
          alert('Registration successful! Please login.');
        } else {
          setError(result.message);
        }
      } else if (formMode === 'login') {
        const result = await loginUser(email, password);
        if (result.success) {
          setIsConnected(true);
        } else {
          setError(result.message);
        }
      } else if (formMode === 'recovery') {
        const result = await initiatePasswordRecovery(email);
        if (result.success) {
          setFormMode('verify-code');
          alert('Recovery code generated! Check the console for the code.');
        } else {
          setError(result.message);
        }
      } else if (formMode === 'verify-code') {
        const isValid = verifyRecoveryCode(email, recoveryCode);
        if (isValid) {
          setFormMode('new-password');
        } else {
          setError('Invalid or expired recovery code');
        }
      } else if (formMode === 'new-password') {
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          return;
        }
        const result = await updatePassword(email, recoveryCode, password);
        if (result.success) {
          setFormMode('login');
          alert('Password updated successfully! Please login.');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const LanguageSelector = () => (
    <div className="absolute top-4 right-4 flex space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-lg ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-lg ${language === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        RU
      </button>
    </div>
  );

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 relative">
        <LanguageSelector />
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t.connectedTitle}</h2>
              <p className="text-gray-500">{t.connectedSubtitle}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t.networkName}:</span>
                <span className="font-medium text-gray-800">{networkDetails.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t.speed}:</span>
                <span className="font-medium text-gray-800">{networkDetails.speed}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t.signal}:</span>
                <span className="font-medium text-gray-800">{networkDetails.signal}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t.ipAddress}:</span>
                <span className="font-medium text-gray-800">{networkDetails.ipAddress}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t.macAddress}:</span>
                <span className="font-medium text-gray-800">{networkDetails.macAddress}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsConnected(false);
                setNetworkDetails({
                  name: '',
                  speed: '',
                  signal: '',
                  ipAddress: '',
                  macAddress: '',
                });
              }}
              className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors mt-6"
            >
              {t.disconnect}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 relative">
      <LanguageSelector />
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
          <p className="text-gray-500 mt-2">{t.subtitle}</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {formMode !== 'verify-code' && (
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          {formMode === 'verify-code' && (
            <div>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder={t.recoveryCode}
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          {(formMode === 'login' || formMode === 'register' || formMode === 'new-password') && (
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          {(formMode === 'register' || formMode === 'new-password') && (
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.confirmPassword}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            {formMode === 'login' ? t.connect :
             formMode === 'register' ? t.register :
             formMode === 'recovery' ? t.sendRecoveryCode :
             formMode === 'verify-code' ? t.verifyCode :
             t.updatePassword}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          {formMode === 'login' && (
            <>
              <button
                onClick={() => setFormMode('register')}
                className="text-blue-500 hover:text-blue-700 text-sm block w-full"
              >
                {t.createAccount}
              </button>
              <button
                onClick={() => setFormMode('recovery')}
                className="text-blue-500 hover:text-blue-700 text-sm block w-full"
              >
                {t.forgotPassword}
              </button>
            </>
          )}
          {(formMode !== 'login') && (
            <button
              onClick={() => setFormMode('login')}
              className="text-blue-500 hover:text-blue-700 text-sm block w-full"
            >
              {t.backToLogin}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;