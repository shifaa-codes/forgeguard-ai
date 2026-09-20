import { useState, useCallback, useEffect } from 'react';
let toastId = 0;
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = 'info', duration = 3200) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);
  return { toasts, push };
}