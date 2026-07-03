import React from 'react';

/** Capa decorativa HUD — posicionamiento y visibilidad por variante vía CSS. */
export function RoadmapDecor() {
  return (
    <div className="roadmap__decor-layer" aria-hidden="true">
      <div className="roadmap-decor roadmap-decor--ring roadmap-decor--one" />
      <div className="roadmap-decor roadmap-decor--ring roadmap-decor--two" />
      <div className="roadmap-decor roadmap-decor--spark roadmap-decor--three" />
      <div className="roadmap-decor roadmap-decor--spark roadmap-decor--four" />
      <div className="roadmap-decor roadmap-decor--spark roadmap-decor--five" />
      <div className="roadmap-decor roadmap-decor--panel roadmap-decor--six" />
      <div className="roadmap-decor roadmap-decor--circuit roadmap-decor--seven" />
      <div className="roadmap-decor roadmap-decor--arc roadmap-decor--eight" />
      <div className="roadmap-decor roadmap-decor--energy roadmap-decor--nine" />
      <div className="roadmap-decor roadmap-decor--energy roadmap-decor--ten" />
    </div>
  );
}

export default RoadmapDecor;
