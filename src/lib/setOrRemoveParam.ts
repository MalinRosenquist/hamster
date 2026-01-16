export function setOrRemoveParam(
  params: URLSearchParams,
  key: string,
  value: string
) {
  if (value.trim() !== "") params.set(key, value);
  else params.delete(key);
}
