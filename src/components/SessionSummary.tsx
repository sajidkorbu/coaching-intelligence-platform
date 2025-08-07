import React, { useState, useEffect } from 'react';
import { SessionSummary as SessionSummaryType } from '../services/SessionSummaryService';

interface SessionSummaryProps {
  summary: SessionSummaryType;
  personaName: string;
  exchangeCount: number;
  onClose: () => void;
  isVisible: boolean;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  summary,
  personaName,
  exchangeCount,
  onClose,
  isVisible
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-close after 15 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 15000);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className={`w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 ${
            isVisible 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-gray-900">Session Summary</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-blue-600">After {exchangeCount} exchanges:</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-gray-800 leading-relaxed">
                {summary.summaryText}
              </p>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Auto-closes in 15 seconds</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
