import { useState, useCallback, useMemo, useEffect } from 'react';

export function isRestrictionActive(restriction) {
  if (!restriction?.schedules) return false;
  const plates = (restriction.plates || '').trim().toLowerCase();
  if (plates === 'ninguna' || plates === 'ninguno') return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return restriction.schedules.some(({ start, end }) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const s = sh * 60 + sm, e = eh * 60 + em;
    return currentMinutes >= s && currentMinutes < e;
  });
}

export function useUserRestriction(restrictions, selectedCity) {
  const [timeInfo, setTimeInfo] = useState({ elapsedTime: '', remainingTime: '' });

  const currentRestriction = useMemo(() => {
    if (!selectedCity || !restrictions?.[selectedCity]) return null;
    const today = new Date();
    const idx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    return restrictions[selectedCity][idx];
  }, [selectedCity, restrictions]);

  const restrictionActive = isRestrictionActive(currentRestriction);

  const calculateTimes = useCallback(() => {
    if (!currentRestriction?.schedules) return setTimeInfo({ elapsedTime: '', remainingTime: '' });
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const active = currentRestriction.schedules.find(({ start, end }) => {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const s = sh * 60 + sm, e = eh * 60 + em;
      return currentMinutes >= s && currentMinutes < e;
    });
    if (active) {
      const [sh, sm] = active.start.split(':').map(Number);
      const [eh, em] = active.end.split(':').map(Number);
      const s = sh * 60 + sm, e = eh * 60 + em;
      const elapsed = currentMinutes - s, remaining = e - currentMinutes;
      setTimeInfo({
        elapsedTime: `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`,
        remainingTime: `${Math.floor(remaining / 60)}h ${remaining % 60}m`
      });
    } else {
      setTimeInfo({ elapsedTime: '', remainingTime: '' });
    }
  }, [currentRestriction]);

  useEffect(() => {
    calculateTimes();
    const timer = setInterval(calculateTimes, 60000);
    return () => clearInterval(timer);
  }, [calculateTimes]);

  return { currentRestriction, restrictionActive, timeInfo };
}