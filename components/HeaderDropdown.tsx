import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserIcon, BookOpenIcon, Cog6ToothIcon, SparklesIcon } from './icons';

interface HeaderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onOpenUserProfile: () => void;
  onOpenPurchaseLibrary: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenVTTLibrary: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  isOpen,
  onClose,
  triggerRef,
  onOpenUserProfile,
  onOpenPurchaseLibrary,
  onOpenSettings,
  onOpenHelp,
  onOpenVTTLibrary,
  onSignOut,
  userEmail
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, // 8px de margen
        left: rect.right - 224 // 224px = w-56 (ancho del dropdown)
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const menuItemStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-border)',
    textAlign: 'left',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'color 0.1s, background 0.1s',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const handleMenuItemOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--color-accent)';
    e.currentTarget.style.background = 'var(--color-accent-dim)';
  };

  const handleMenuItemOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--color-text-muted)';
    e.currentTarget.style.background = 'transparent';
  };

  const dropdownContent = (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: 'var(--color-surface)',
        border: '2px solid var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        minWidth: 224,
        zIndex: 9999,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {userEmail && (
        <div style={{ padding: '10px 14px', borderBottom: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
          <div style={{ fontFamily: 'var(--font-comic)', fontSize: 13, letterSpacing: 1, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            {userEmail}
          </div>
        </div>
      )}
      <button
        style={menuItemStyle}
        onMouseOver={handleMenuItemOver}
        onMouseOut={handleMenuItemOut}
        onClick={onOpenUserProfile}
      >
        <UserIcon className="h-5 w-5" /> Mi Perfil
      </button>
      <button
        style={menuItemStyle}
        onMouseOver={handleMenuItemOver}
        onMouseOut={handleMenuItemOut}
        onClick={onOpenPurchaseLibrary}
      >
        <BookOpenIcon className="h-5 w-5" /> Mis Héroes
      </button>
      <button
        style={menuItemStyle}
        onMouseOver={handleMenuItemOver}
        onMouseOut={handleMenuItemOut}
        onClick={onOpenSettings}
      >
        <Cog6ToothIcon className="h-5 w-5" /> Ajustes
      </button>
      <button
        style={menuItemStyle}
        onMouseOver={handleMenuItemOver}
        onMouseOut={handleMenuItemOut}
        onClick={onOpenHelp}
      >
        <SparklesIcon className="h-5 w-5" /> Ayuda
      </button>
      <button
        style={menuItemStyle}
        onMouseOver={handleMenuItemOver}
        onMouseOut={handleMenuItemOut}
        onClick={onOpenVTTLibrary}
      >
        <span style={{ width: 20, height: 20 }}>🎲</span> Tokens VTT
      </button>
      <button
        style={{
          ...menuItemStyle,
          borderBottom: 'none',
          color: 'var(--color-error, #ef4444)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--color-accent-dim)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        onClick={onSignOut}
      >
        <span style={{ width: 20, height: 20 }}>🚪</span> Cerrar sesión
      </button>
    </div>
  );

  // Renderizar el dropdown directamente en el body usando portal
  return createPortal(dropdownContent, document.body);
};

export default HeaderDropdown;
