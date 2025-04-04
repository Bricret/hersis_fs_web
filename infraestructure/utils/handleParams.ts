import { HandleParamsProps } from "../interface/definations";

export default function HandleParams({
  term,
  searchParams,
  paramsName,
  pathname,
  replace,
}: HandleParamsProps) {
  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set(paramsName, term);
  } else {
    params.delete(paramsName);
  }

  params.set("page", "1");

  replace(`${pathname}?${params.toString()}`);
}
