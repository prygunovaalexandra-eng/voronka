import React, { useState, useEffect, useRef } from 'react';
import { Funnel } from '../types';
import { MODAL_ANIMATION_DELAY, MODAL_IMAGE_FALLBACK } from '../constants';

interface FunnelModalProps {
  funnel: Funnel;
  onClose: () => void;
}

const FunnelModal: React.FC<FunnelModalProps> = ({ funnel, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const nextStep = () => {
    if (currentStep < funnel.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the close button when modal opens
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, MODAL_ANIMATION_DELAY);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, currentStep]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background-invert/90 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-text/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-text/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-text">{funnel.title}</h2>
                              <p id="modal-description" className="text-text/70">{funnel.company} • {funnel.category || funnel.industry}</p>
            </div>
            <button 
              ref={closeButtonRef}
              onClick={onClose}
              className="text-text/40 hover:text-text/70 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Step {currentStep + 1} of {funnel.steps.length}: {funnel.steps[currentStep].title}
            </h3>
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {funnel.steps.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / funnel.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center">
            <img 
              src={funnel.steps[currentStep].screenshot} 
              alt={`${funnel.steps[currentStep].title} - Step ${currentStep + 1} of ${funnel.title}`}
              className="max-w-full max-h-[500px] mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = MODAL_IMAGE_FALLBACK;
              }}
              loading="lazy"
            />
            {funnel.steps[currentStep].description && (
              <p className="mt-4 text-gray-600">
                {funnel.steps[currentStep].description}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Step indicators */}
            <div className="flex space-x-2">
              {funnel.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-blue-600' 
                      : index < currentStep 
                        ? 'bg-blue-300' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === funnel.steps.length - 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelModal; 