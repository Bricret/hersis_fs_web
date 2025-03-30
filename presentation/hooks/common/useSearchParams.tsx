"use client";
import HandleParams from "@/infraestructure/utils/handleParams";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const WAIT_INTERVAL = 150;

interface UseSearchParamsProps {
  paramsName?: string;
  waitInterval?: number;
}

export function useSearchParams({
  paramsName = "query",
  waitInterval = WAIT_INTERVAL,
}: UseSearchParamsProps = {}) {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleParams = useDebouncedCallback((term: string) => {
    HandleParams({ term, searchParams, paramsName, pathname, replace });
  }, waitInterval);

  return { handleParams };
}
