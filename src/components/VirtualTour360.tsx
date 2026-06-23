import React, { useEffect, useMemo, useRef, useState } from 'react';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';

type Zone = { id: string; label: string; yaw: number; pitch: number; targetStationId?: string; targetSceneId?: string };
type Hotspot = { id: string; yaw: number; pitch: number; label?: string; targetStationId?: string; targetSceneId?: string };
type Scene = { id: string; panoramaUrl: string; name?: string; yaw?: number; pitch?: number; hotspots?: Hotspot[]; zones?: Zone[] };

interface VirtualTour360Props {
  scenes: Scene[];
  initialSceneId?: string;
  onHotspotClick?: (hotspotId: string, targetStationId?: string) => void;
}

export const VirtualTour360: React.FC<VirtualTour360Props> = ({ scenes, initialSceneId, onHotspotClick }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const [activeSceneId, setActiveSceneId] = useState<string>(initialSceneId ?? scenes[0]?.id ?? '');

  const activeScene = useMemo(() => scenes.find(scene => scene.id === activeSceneId) ?? scenes[0], [activeSceneId, scenes]);

  const getViewer = () => viewerRef.current;

  const updateScene = async (sceneId: string) => {
    const viewer = getViewer();
    const scene = scenes.find(item => item.id === sceneId);
    if (!viewer || !scene) return;

    const panoramaUrl = scene.panoramaUrl;
    if (viewer.setPanorama) {
      await viewer.setPanorama(panoramaUrl, { transition: true, transitionDuration: 800 });
    } else if (viewer.setPanoramaUrl) {
      await viewer.setPanoramaUrl(panoramaUrl, { transition: true, transitionDuration: 800 });
    } else {
      viewer.setContent?.({ panorama: panoramaUrl });
    }
  };

  const moveCamera = (deltaYaw: number, deltaPitch: number) => {
    const viewer = getViewer();
    if (!viewer) return;

    const currentPosition = viewer.getPosition?.() ?? viewer.getViewerPosition?.();
    const yaw = (currentPosition?.yaw ?? 0) + deltaYaw;
    const pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, (currentPosition?.pitch ?? 0) + deltaPitch));

    if (viewer.animate) {
      viewer.animate({ yaw, pitch, duration: 600 });
    } else if (viewer.rotate) {
      viewer.rotate({ yaw, pitch, duration: 600 });
    } else {
      viewer.setPosition?.({ yaw, pitch });
    }
  };

  const goToZone = async (zone: Zone) => {
    await moveCamera(zone.yaw * (Math.PI / 180), zone.pitch * (Math.PI / 180));
    if (zone.targetSceneId) {
      setActiveSceneId(zone.targetSceneId);
      return;
    }
    if (zone.targetStationId) {
      onHotspotClick?.(zone.id, zone.targetStationId);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const PSV = await import('@photo-sphere-viewer/core');
        const VTP = await import('@photo-sphere-viewer/virtual-tour-plugin');

        const Viewer = (PSV as any).Viewer ?? (PSV as any).default ?? PSV;
        const VirtualTourPlugin = (VTP as any).VirtualTourPlugin ?? (VTP as any).default ?? VTP;

        if (!containerRef.current) return;

        const initial = scenes.find(scene => scene.id === activeSceneId) ?? scenes[0];

        const viewer = new (Viewer as any)({
          container: containerRef.current,
          panorama: initial?.panoramaUrl,
          defaultYaw: (initial?.yaw ?? 0) * (Math.PI / 180),
          defaultPitch: (initial?.pitch ?? 0) * (Math.PI / 180),
          navbar: false,
          mousewheel: true,
          size: { width: '100%', height: '100%' },
        });

        new (VirtualTourPlugin as any)(viewer, {
          nodes: scenes.map(scene => ({
            id: scene.id,
            panorama: scene.panoramaUrl,
            name: scene.name,
            links: []
          })),
          startNodeId: initial?.id,
          renderMode: '2d',
          preload: true,
          positionMode: 'manual',
          showLinkTooltip: false
        });

        viewerRef.current = viewer;

        try {
          const psv = viewer;
          
          // Clear existing markers
          try { psv.clearMarkers?.(); } catch {}
          
          scenes.forEach(scene => {
            scene.hotspots?.forEach(hotspot => {
              try {
                psv.addMarker?.({
                  id: `${scene.id}-${hotspot.id}`,
                  longitude: (hotspot.yaw || 0) * (Math.PI / 180),
                  latitude: (hotspot.pitch || 0) * (Math.PI / 180),
                  tooltip: hotspot.targetSceneId ? false : hotspot.label ?? hotspot.id,
                  width: 120,
                  height: 64,
                  anchor: 'bottom',
                  className: hotspot.targetSceneId ? 'psv-marker-arrow-3d' : undefined,
                  content: hotspot.targetSceneId
                    ? `<div class="psv-marker-arrow-inner"><span class="psv-marker-arrow-label">ENTRADA</span><strong class="psv-marker-arrow-symbol">→</strong></div>`
                    : undefined,
                  data: { targetStationId: hotspot.targetStationId, targetSceneId: hotspot.targetSceneId }
                });
              } catch (error) {
                console.debug('Marker error:', error);
              }
            });
          });

          psv.on?.('select-marker', (e: any) => {
            const id = e?.marker?.id;
            const data = e?.marker?.data;
            if (!id) return;
            if (data?.targetSceneId) {
              setActiveSceneId(data.targetSceneId);
              return;
            }
            onHotspotClick?.(id, data?.targetStationId);
          });
        } catch (error) {
          console.debug('Marker attach error:', error);
        }
      } catch (error) {
        // console.error('VirtualTour360 init error', error);
      }
    })();

    return () => {
      cancelled = true;
      if (viewerRef.current && typeof viewerRef.current.destroy === 'function') {
        try { viewerRef.current.destroy(); } catch (error) {}
      }
      viewerRef.current = null;
    };
  }, [activeSceneId, scenes, onHotspotClick]);

  useEffect(() => {
    updateScene(activeSceneId);
  }, [activeSceneId]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    try {
      const psv = viewer;
      const activeScene = scenes.find(s => s.id === activeSceneId);
      
      // Clear and re-render markers for current scene
      try { psv.clearMarkers?.(); } catch {}
      
      activeScene?.hotspots?.forEach(hotspot => {
        try {
          psv.addMarker?.({
            id: `${activeScene.id}-${hotspot.id}`,
            longitude: (hotspot.yaw || 0) * (Math.PI / 180),
            latitude: (hotspot.pitch || 0) * (Math.PI / 180),
            tooltip: hotspot.targetSceneId ? false : hotspot.label ?? hotspot.id,
            width: 120,
            height: 64,
            anchor: 'bottom',
            className: hotspot.targetSceneId ? 'psv-marker-arrow-3d' : undefined,
            content: hotspot.targetSceneId
              ? `<div class="psv-marker-arrow-inner"><span class="psv-marker-arrow-label">ENTRADA</span><strong class="psv-marker-arrow-symbol">→</strong></div>`
              : undefined,
            data: { targetStationId: hotspot.targetStationId, targetSceneId: hotspot.targetSceneId }
          });
        } catch (error) {
          console.debug('Marker error:', error);
        }
      });
    } catch (error) {
      console.debug('Scene marker update error:', error);
    }
  }, [activeSceneId, scenes]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full bg-black" />
      
      {/* Hotspot overlay buttons positioned over the panorama */}
      {activeScene?.hotspots?.map(hotspot => (
        hotspot.targetSceneId && (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => {
              if (hotspot.targetSceneId) {
                setActiveSceneId(hotspot.targetSceneId);
              }
            }}
            className="psv-hotspot-overlay"
            style={{
              left: `calc(50% + ${(hotspot.yaw || 0) * 5.7}%)`,
              top: `calc(50% + ${(hotspot.pitch || 0) * -5.7}%)`,
            }}
            title="Haz clic para entrar"
          >
            <div className="psv-marker-arrow-inner">
              <span className="psv-marker-arrow-label">ENTRADA</span>
              <strong className="psv-marker-arrow-symbol">→</strong>
            </div>
          </button>
        )
      ))}

      <div className="absolute top-4 right-4 z-20 grid gap-2 p-3 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl text-white text-[11px]">
        <span className="font-mono uppercase text-[10px] text-emerald-300 tracking-[0.25em]">Controles 360</span>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => moveCamera(-0.25, 0)} className="rounded-xl bg-white/10 px-3 py-2 text-left hover:bg-white/20">← Izquierda</button>
          <button type="button" onClick={() => moveCamera(0.25, 0)} className="rounded-xl bg-white/10 px-3 py-2 text-left hover:bg-white/20">Derecha →</button>
          <button type="button" onClick={() => moveCamera(0, -0.15)} className="rounded-xl bg-white/10 px-3 py-2 text-left hover:bg-white/20">Arriba</button>
          <button type="button" onClick={() => moveCamera(0, 0.15)} className="rounded-xl bg-white/10 px-3 py-2 text-left hover:bg-white/20">Abajo</button>
        </div>
        <div className="grid gap-2 pt-2 border-t border-slate-800">
          {activeScene?.zones?.map(zone => (
            <button
              key={zone.id}
              type="button"
              onClick={() => goToZone(zone)}
              className="rounded-2xl bg-[#9BFF00]/10 px-3 py-2 text-left font-semibold text-[#9BFF00] hover:bg-[#9BFF00]/20"
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute left-4 bottom-4 z-20 p-3 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl text-white text-[11px] max-w-[240px]">
        <p className="font-mono uppercase text-[10px] text-emerald-300 tracking-[0.25em]">Zonas activas</p>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">Haz clic en las zonas para mover la vista y conectar con los contenidos de la inducción.</p>
      </div>
      <style>{`
        .psv-hotspot-overlay {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 15;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .psv-hotspot-overlay:hover {
          transform: translate(-50%, -50%) scale(1.08);
        }
        .psv-hotspot-overlay:active {
          transform: translate(-50%, -50%) scale(0.96);
        }
        .psv-marker-arrow-3d {
          transform-style: preserve-3d;
          perspective: 900px;
        }
        .psv-marker-arrow-inner {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1.05rem;
          min-width: 12rem;
          border-radius: 999px;
          border: 1px solid rgba(155, 255, 0, 0.28);
          background: rgba(15, 23, 42, 0.88);
          box-shadow: 0 28px 60px rgba(0, 0, 0, 0.32), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          color: #f8fafc;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transform: translateZ(0);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: psv-hotspot-pulse 2.4s ease-in-out infinite;
          overflow: hidden;
        }
        .psv-marker-arrow-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(circle at 50% 50%, rgba(155, 255, 0, 0.32), transparent 60%);
          opacity: 0.65;
          pointer-events: none;
        }
        .psv-marker-arrow-inner:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 34px 76px rgba(0, 0, 0, 0.38), inset 0 0 0 1px rgba(255, 255, 255, 0.09);
        }
        .psv-marker-arrow-label {
          z-index: 1;
          letter-spacing: 0.24em;
          font-size: 0.75rem;
        }
        .psv-marker-arrow-symbol {
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #9bff00 0%, #80c400 100%);
          color: #0f172a;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12);
        }
        @keyframes psv-hotspot-pulse {
          0%, 100% { transform: scale(1) translateZ(0); }
          50% { transform: scale(1.06) translateZ(10px); }
        }
      `}</style>
    </div>
  );
};

export default VirtualTour360;
