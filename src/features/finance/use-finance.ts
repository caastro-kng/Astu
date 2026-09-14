import { useEffect, useState } from "react";
import { financeRepository } from "./repository";
import type { FinanceData } from "./types";

export function useFinance() {
  // Read existing records before the first persistence effect can run.
  const [data, setData] = useState<FinanceData>(() => financeRepository.get());
  useEffect(() => {
    financeRepository.save(data);
  }, [data]);
  return [data, setData] as const;
}
