import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, FolderKanban, CheckSquare, GraduationCap, FileCheck, LifeBuoy, Eye, Monitor, Check, Sparkles } from 'lucide-react';
import { platformFeatures } from '../data';
import { PlatformFeature } from '../types';
import * as LucideIcons from 'lucide-react';

interface UserPlatformPreviewProps {
  accentColor: 'blue' | 'green';
}

export const UserPlatformPreview: React.FC<UserPlatformPreviewProps> = ({ accentColor }) => {
  const [selectedFeature, setSelectedFeature] = useState<PlatformFeature>(platformFeatures[0]);

  const isBlue = accentColor === 'blue';
  const textAccent = isBlue ? 'text-brand-blue-600' : 'text-brand-green-600';
  const bgAccentLight = isBlue ? 'bg-brand-blue-50/50' : 'bg-brand-green-50/50';
  const bgAccentActive = isBlue ? 'bg-brand-blue-500 text-white' : 'bg-brand-green-500 text-white';
  const borderIcon = isBlue ? 'border-brand-blue-200 text-brand-blue-600' : 'border-brand-green-200 text-brand-green-600';
  const borderActive = isBlue ? 'border-brand-blue-500 ring-2 ring-brand-blue-100' : 'border-brand-green-500 ring-2 ring-brand-green-100';

  return (
    <div className="space-y-8" id="platform-user-preview">
      {/* Title block */}
      <div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${textAccent} ${isBlue ? 'bg-brand-blue-50' : 'bg-brand-green-50'} ${isBlue ? 'border-brand-blue-100' : 'border-brand-green-100'} border mb-2`}>
          Descubre tu Ecosistema CUN
        </span>
        <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight">
          ¿Qué encontrarás en tu usuario institucional?
        </h3>
        <p className="text-sm text-slate-500 max-w-3xl">
          Explora los módulos esenciales de tu aula virtual antes de entrar. Haz clic en las tarjetas para interactuar y ver un desglose interactivo del contenido.
        </p>
      </div>

      {/* Grid: Left side cards, Right side dynamic interactive dashboard simulator */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left side: 6 Interactive Lineart Cards (7 Cols on desktop) */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          {platformFeatures.map((feat) => {
            const IconComponent = (LucideIcons as any)[feat.iconName] || BookOpen;
            const isSelected = selectedFeature.id === feat.id;

            return (
              <motion.div
                key={feat.id}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedFeature(feat)}
                className={`p-5 bg-white border-2 rounded-2xl cursor-pointer transition-all ${
                  isSelected 
                    ? `${borderActive} shadow-md` 
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  {/* Rounded icon box with lineart styling */}
                  <div className={`p-3 rounded-xl border-2 ${isSelected ? bgAccentActive + ' border-transparent' : `${borderIcon} ${bgAccentLight}`} transition-colors`}>
                    <IconComponent className="w-5 h-5" strokeWidth={2} />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-sm tracking-tight text-slate-800">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 group">
                  <span className={`${isSelected ? textAccent : 'text-slate-400'}`}>
                    {isSelected ? 'Módulo activo' : 'Haga clic para ver'}
                  </span>
                  <Eye className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'scale-110 ' + textAccent : 'text-slate-300'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right side: Interactive Dashboard Simulator Pane (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-3xl border-4 border-slate-900 shadow-xl overflow-hidden self-stretch flex flex-col justify-between">
          
          {/* Mock Browser Header */}
          <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-500 font-mono tracking-wider ml-4">PLATAFORMA_CUN_PREVIEW.JSX</span>
            </div>
            <Monitor className="w-4 h-4 text-slate-600" />
          </div>

          {/* Simulated Web UI Canvas */}
          <div className="p-6 grow bg-slate-900/60 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
            {/* Grid helper overlay lines (subtle blueprint lineart) */}
            <div className="absolute inset-0 bg-radial from-slate-900/10 via-transparent opacity-20 pointer-events-none" />
            
            {/* Animated card display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Simulated Panel Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-3 rounded-full bg-brand-blue-500" />
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">Vista del Estudiante</span>
                  </div>
                  <Sparkles className={`w-4 h-4 ${textAccent}`} />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-extrabold text-2xl text-white tracking-tight">
                    {selectedFeature.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {selectedFeature.description}
                  </p>
                </div>

                {/* Sub-components list dynamically compiled below */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[10px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">
                    ATRIBUTOS CLAVE EN PANTALLA:
                  </p>

                  <div className="grid gap-2">
                    {selectedFeature.details.map((det, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-center space-x-3 bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-xl text-slate-300"
                      >
                        <div className={`p-1 rounded-md ${isBlue ? 'bg-brand-blue-500/10 text-brand-blue-400 border border-brand-blue-500/20' : 'bg-brand-green-500/10 text-brand-green-400 border border-brand-green-500/20'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className="text-xs font-medium font-sans">{det}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Simulated navigation and status helper */}
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Sincronizado vía CUN cloud</span>
              <span className="animate-pulse flex items-center text-emerald-500 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />
                Interactivo
              </span>
            </div>

          </div>

          {/* Simulation Footer Button representing active registration link */}
          <div className="bg-slate-950 p-4 border-t border-slate-800/65 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <span className="text-slate-400 font-medium font-sans">
              ¿Listo para dar el paso real?
            </span>
            <button
              onClick={() => {
                alert("Redireccionando a la mesa de soporte real CUN...");
              }}
              className={`p-2 px-4 rounded-xl font-display font-extrabold ${bgAccentActive} hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer`}
            >
              Ingresar al portal CUN
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
