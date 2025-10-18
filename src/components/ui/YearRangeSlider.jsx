import React, { useState, useRef, useEffect } from 'react';

const YearRangeSlider = ({ 
  minYear = 2007, 
  maxYear = 2024, 
  value = [2007, 2024], 
  onChange, 
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(null); // 'start' | 'end' | null
  const [localValue, setLocalValue] = useState(value);
  const sliderRef = useRef(null);
  const [sliderRect, setSliderRect] = useState(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderRect(sliderRef.current.getBoundingClientRect());
    }
  }, []);

  const getPositionFromValue = (val) => {
    if (!sliderRect) return 0;
    return ((val - minYear) / (maxYear - minYear)) * sliderRect.width;
  };

  const getValueFromPosition = (x) => {
    if (!sliderRect) return minYear;
    const percentage = Math.max(0, Math.min(1, (x - sliderRect.left) / sliderRect.width));
    return Math.round(minYear + percentage * (maxYear - minYear));
  };

  const handleMouseDown = (e, handle) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRect) return;

    const newValue = getValueFromPosition(e.clientX);
    const clampedValue = Math.max(minYear, Math.min(maxYear, newValue));

    if (isDragging === 'start') {
      const newStart = Math.min(clampedValue, localValue[1]);
      setLocalValue([newStart, localValue[1]]);
    } else if (isDragging === 'end') {
      const newEnd = Math.max(clampedValue, localValue[0]);
      setLocalValue([localValue[0], newEnd]);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(null);
      // onChange já foi chamado durante o movimento, então não precisa chamar novamente
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, localValue, sliderRect]);

  const startPosition = getPositionFromValue(localValue[0]);
  const endPosition = getPositionFromValue(localValue[1]);

  return (
    <div className="w-full">
      <div className="text-xs font-medium text-gray-700 mb-3">
        Selecione um período
      </div>
      
      <div className="relative">
        {/* Timeline bar */}
        <div 
          ref={sliderRef}
          className="relative h-3 bg-gray-300 rounded-full cursor-pointer"
          onMouseDown={(e) => {
            if (disabled) return;
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickValue = getValueFromPosition(e.clientX);
            
            // Determine which handle is closer
            const distanceToStart = Math.abs(clickValue - localValue[0]);
            const distanceToEnd = Math.abs(clickValue - localValue[1]);
            
            // If both handles are at the same position, determine which to move based on click position
            if (localValue[0] === localValue[1]) {
              if (clickValue < localValue[0]) {
                // Click is to the left, move start handle
                const newStart = Math.max(minYear, clickValue);
                setLocalValue([newStart, localValue[1]]);
                onChange && onChange([newStart, localValue[1]]);
                setIsDragging('start');
              } else {
                // Click is to the right, move end handle
                const newEnd = Math.min(maxYear, clickValue);
                setLocalValue([localValue[0], newEnd]);
                onChange && onChange([localValue[0], newEnd]);
                setIsDragging('end');
              }
            } else if (distanceToStart < distanceToEnd) {
              const newStart = Math.min(clickValue, localValue[1]);
              setLocalValue([newStart, localValue[1]]);
              onChange && onChange([newStart, localValue[1]]);
              setIsDragging('start');
            } else {
              const newEnd = Math.max(clickValue, localValue[0]);
              setLocalValue([localValue[0], newEnd]);
              onChange && onChange([localValue[0], newEnd]);
              setIsDragging('end');
            }
          }}
        >
          {/* Selected range */}
          <div 
            className="absolute h-3 bg-gray-600 rounded-full"
            style={{
              left: `${startPosition}px`,
              width: `${endPosition - startPosition}px`,
            }}
          />
          
          {/* Dots along the timeline */}
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
            const year = minYear + i;
            const position = getPositionFromValue(year);
            return (
              <div
                key={year}
                className="absolute w-1 h-1 bg-gray-400 rounded-full transform -translate-x-1/2 top-1/2 -translate-y-1/2"
                style={{ left: `${position}px` }}
              />
            );
          })}
          
          {/* Start handle */}
          <div
            className={`absolute w-1 h-7 bg-gray-700 rounded-full cursor-ew-resize transform -translate-x-1/2 -translate-y-2 ${
              isDragging === 'start' ? 'shadow-lg' : ''
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            style={{ left: `${startPosition}px` }}
            onMouseDown={(e) => handleMouseDown(e, 'start')}
          />
          
          {/* End handle */}
          <div
            className={`absolute w-1 h-7 bg-gray-700 rounded-full cursor-ew-resize transform -translate-x-1/2 -translate-y-2 ${
              isDragging === 'end' ? 'shadow-lg' : ''
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            style={{ left: `${endPosition}px` }}
            onMouseDown={(e) => handleMouseDown(e, 'end')}
          />
        </div>
        
        {/* Year labels */}
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-700 font-medium">{minYear}</span>
          <span className="text-sm text-gray-700 font-medium">{maxYear}</span>
        </div>
        
        {/* Selected years display */}
        <div className="flex justify-center mt-2">
          <span className="text-sm text-gray-600">
            {localValue[0]} - {localValue[1]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YearRangeSlider;
