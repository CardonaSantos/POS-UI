import { useEffect, useMemo, useState } from "react";

interface TicketConformidadCountdownResult {
  remainingMs: number;
  expired: boolean;
  validDate: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

function getRemainingMs(expiraEn: string): {
  remainingMs: number;
  validDate: boolean;
} {
  const expiresAt = Date.parse(expiraEn);

  if (Number.isNaN(expiresAt)) {
    return {
      remainingMs: 0,
      validDate: false,
    };
  }

  return {
    remainingMs: Math.max(0, expiresAt - Date.now()),
    validDate: true,
  };
}

export function useTicketConformidadCountdown(
  expiraEn: string,
): TicketConformidadCountdownResult {
  const [state, setState] = useState(() => getRemainingMs(expiraEn));

  useEffect(() => {
    const update = () => {
      setState(getRemainingMs(expiraEn));
    };

    update();

    const intervalId = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [expiraEn]);

  return useMemo(() => {
    const totalSeconds = Math.floor(state.remainingMs / 1000);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    const formatted =
      hours > 0
        ? `${hours} h ${String(minutes).padStart(2, "0")} min`
        : `${minutes} min ${String(seconds).padStart(2, "0")} s`;

    return {
      remainingMs: state.remainingMs,

      expired: state.validDate && state.remainingMs <= 0,

      validDate: state.validDate,

      hours,
      minutes,
      seconds,
      formatted,
    };
  }, [state]);
}
