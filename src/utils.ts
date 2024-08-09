export function removeMinecraftColors(text: string) {
  return text.replace(/§./g, "");
}
