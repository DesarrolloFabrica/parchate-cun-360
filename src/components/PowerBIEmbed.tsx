import React from 'react';
import { AreaChart, HelpCircle, Info, RefreshCw, BarChart2, ShieldCheck, ExternalLink } from 'lucide-react';
import { onboardingConfig } from '../data';

export const PowerBIEmbed: React.FC = () => {
  const handleRefresh = () => {
    const iframe = document.getElementById('powerbi-report-frame') as HTMLIFrameElement;
    if (iframe) {
      // Reload iframe content
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="space-y-6" id="institutional-powerbi-containment">
      
      {/* Visual Title Header */}
      <div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-brand-green-600 bg-brand-green-50 border border-brand-green-100 mb-2">
          Estadísticas y Análisis
        </span>
        <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight">
          Información Institucional
        </h3>
        <p className="text-sm text-slate-500">
          Visualiza los reportes oficiales de la institución. Este reporte interactivo de Power BI te ayuda a comprender el comportamiento de la comunidad estudiantil.
        </p>
      </div>

      {/* Target styled large card */}
      <div className="bg-white rounded-3xl border-2 border-brand-green-300/80 shadow-md p-4 sm:p-6 overflow-hidden space-y-4">
        
        {/* Dashboard Bar Decoration */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand-green-50 text-brand-green-600 rounded-xl border border-brand-green-100">
              <BarChart2 className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 leading-tight">
                Tablero Consolidado CUN
              </h4>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                ORIGEN DE DATOS • POWER BI CLOUD REPORTE
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            {/* Secured badge */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100 text-[10px] font-bold text-teal-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>INFORMACIÓN VERIFICADA</span>
            </div>

            {/* Refresh emulator */}
            <button
              onClick={handleRefresh}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all cursor-pointer"
              title="Recargar reporte"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Frame Element */}
        <div className="relative aspect-video w-full min-h-[380px] md:min-h-[500px] bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden shadow-xs">
          <iframe
            id="powerbi-report-frame"
            title="Información Institucional CUN"
            src={onboardingConfig.powerBiEmbedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen={true}
          ></iframe>
        </div>

        {/* Dashboard helper explanation area (Lineart styled) */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center space-x-2 font-semibold text-slate-800">
              <Info className="w-4 h-4 text-brand-blue-500" />
              <span>¿Cómo interactuar con el reporte?</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-sans">
              Puedes hacer clic en los filtros laterales de cada página del reporte de Power BI para desglosar la información por trimestres, programas académicos o tipos de campus.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center space-x-2 font-semibold text-slate-800">
              <HelpCircle className="w-4 h-4 text-brand-green-500" />
              <span>¿No carga el documento?</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-sans">
              Si visualizas la pantalla en gris, verifica tu conexión a internet o haz <span className="text-brand-green-600 font-bold hover:underline cursor-pointer" onClick={handleRefresh}>clic aquí para recargar</span>. Recuerda que no requiere ninguna clave de ingreso institucional corporativo.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
