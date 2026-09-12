import React from 'react';
import { useStore } from '../context/StoreContext';
import { AuthPage } from '../pages/Auth';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalReason, authModalMode } = useStore();

  if (!isAuthModalOpen) return null;

  return (
    <AuthPage
      isModal
      onClose={closeAuthModal}
      reason={authModalReason || undefined}
      initialMode={authModalMode}
    />
  );
};
