import { getCurrentWindow } from '@tauri-apps/api/window';

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function minimize(): Promise<void> {
  if (!isTauri()) return;
  await getCurrentWindow().minimize();
}

export async function toggleMaximize(): Promise<void> {
  if (!isTauri()) return;
  await getCurrentWindow().toggleMaximize();
}

export async function closeWindow(): Promise<void> {
  if (!isTauri()) return;
  await getCurrentWindow().close();
}

export async function checkIsMaximized(): Promise<boolean> {
  if (!isTauri()) return false;
  return getCurrentWindow().isMaximized();
}
