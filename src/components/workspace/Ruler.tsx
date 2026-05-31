import React from 'react';

interface RulerProps {
  zoom: number;
  orientation: 'horizontal' | 'vertical';
}

const Ruler: React.FC<RulerProps> = ({ zoom, orientation }) => {
  const scale = zoom / 100;
  // A4 width = 210mm ≈ 794px at 96dpi, height = 297mm ≈ 1123px
  const totalMM = orientation === 'horizontal' ? 210 : 297;
  const totalPx = orientation === 'horizontal' ? 794 : 1123;
  const scaledTotal = totalPx * scale;

  const ticks: React.ReactNode[] = [];
  for (let mm = 0; mm <= totalMM; mm += 5) {
    const pos = (mm / totalMM) * scaledTotal;
    const isMajor = mm % 10 === 0;
    const isMidpoint = mm % 5 === 0 && !isMajor;

    if (orientation === 'horizontal') {
      ticks.push(
        <div
          key={mm}
          className="absolute top-0 flex flex-col items-center"
          style={{ left: pos }}
        >
          <div
            className={`bg-neutral-400 w-px`}
            style={{ height: isMajor ? 8 : isMidpoint ? 5 : 3 }}
          />
          {isMajor && mm > 0 && (
            <span className="text-[7px] text-neutral-400 mt-0.5 leading-none" style={{ fontSize: '7px' }}>
              {mm}
            </span>
          )}
        </div>
      );
    } else {
      ticks.push(
        <div
          key={mm}
          className="absolute left-0 flex flex-row items-center"
          style={{ top: pos }}
        >
          <div
            className="bg-neutral-400 h-px"
            style={{ width: isMajor ? 8 : isMidpoint ? 5 : 3 }}
          />
          {isMajor && mm > 0 && (
            <span
              className="text-neutral-400 ml-0.5 leading-none"
              style={{ fontSize: '7px', writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
            >
              {mm}
            </span>
          )}
        </div>
      );
    }
  }

  if (orientation === 'horizontal') {
    return (
      <div
        className="relative bg-[#f0f0f0] border-b border-neutral-300 overflow-hidden flex-shrink-0"
        style={{ height: 20, width: '100%' }}
      >
        <div className="absolute" style={{ left: '50%', transform: `translateX(-50%)`, width: scaledTotal, height: '100%' }}>
          {ticks}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-[#f0f0f0] border-r border-neutral-300 overflow-hidden flex-shrink-0"
      style={{ width: 20, minHeight: '100%' }}
    >
      <div className="absolute" style={{ top: 48, left: 0, width: '100%', height: scaledTotal }}>
        {ticks}
      </div>
    </div>
  );
};

export default Ruler;
