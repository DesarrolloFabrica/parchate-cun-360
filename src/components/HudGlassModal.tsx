import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import '../styles/hud-glass-modal.css';

export type HudGlassModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type HudGlassModalVariant = 'emerald' | 'amber';

const sizeClasses: Record<HudGlassModalSize, string> = {
  sm: 'w-[min(420px,92vw)]',
  md: 'w-[min(640px,92vw)]',
  lg: 'w-[min(920px,92vw)]',
  xl: 'w-[min(960px,92vw)]',
};

export interface HudGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: HudGlassModalSize;
  variant?: HudGlassModalVariant;
  panelClassName?: string;
  bodyClassName?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  closeAriaLabel?: string;
  zIndex?: 'default' | 'warning';
}

export const HudGlassModal: React.FC<HudGlassModalProps> = ({
  isOpen,
  onClose,
  title,
  meta,
  children,
  footer,
  size = 'lg',
  variant = 'emerald',
  panelClassName = '',
  bodyClassName = '',
  overlayClassName = '',
  showCloseButton = true,
  closeAriaLabel = 'Cerrar',
  zIndex = 'default',
}) => {
  const panelVariantClass = variant === 'amber' ? 'hud-glass-modal__panel--amber' : '';
  const overlayVariantClass = zIndex === 'warning' ? 'hud-glass-modal__overlay--warning' : '';
  const showHeader = Boolean(title || meta || showCloseButton);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`hud-glass-modal__overlay ${overlayVariantClass} ${overlayClassName}`.trim()}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`hud-glass-modal__panel ${sizeClasses[size]} ${panelVariantClass} ${panelClassName}`.trim()}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : 'Ventana emergente'}
          >
            <div className="hud-glass-modal__decor" aria-hidden="true">
              <div className="hud-glass-modal__glass-layer" />
              <div className="hud-glass-modal__inner-border" />
              <span className="hud-glass-modal__dot hud-glass-modal__dot--tl" />
              <span className="hud-glass-modal__dot hud-glass-modal__dot--br" />
              <span className="hud-glass-modal__corner-tab hud-glass-modal__corner-tab--tl" />
              <span className="hud-glass-modal__corner-tab hud-glass-modal__corner-tab--br" />
            </div>

            <div className="hud-glass-modal__stack">
              {showHeader && (
                <header className="hud-glass-modal__header">
                  <div className="hud-glass-modal__header-text">
                    {title && <h3 className="hud-glass-modal__title">{title}</h3>}
                    {meta && <div className="hud-glass-modal__meta">{meta}</div>}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      className="hud-glass-modal__close"
                      onClick={onClose}
                      aria-label={closeAriaLabel}
                    >
                      x
                    </button>
                  )}
                </header>
              )}

              <div className="hud-glass-modal__body">
                <div className={`hud-glass-modal__content ${bodyClassName}`.trim()}>
                  {children}
                </div>
              </div>

              {footer && <footer className="hud-glass-modal__footer">{footer}</footer>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HudGlassModal;
