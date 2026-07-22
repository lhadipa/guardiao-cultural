"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// formatDistanceToNow depende do instante em que é chamado ("agora"). Calculá-lo
// durante o render de servidor produz um valor diferente do calculado na
// hidratação do cliente, causando mismatch de hidratação — por isso só
// calculamos o texto após o componente montar no cliente.
export function RelativeTime({ date }: { date: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valor só pode ser calculado no cliente (ver comentário acima)
    setText(formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR }));
  }, [date]);

  return <>{text ?? " "}</>;
}
