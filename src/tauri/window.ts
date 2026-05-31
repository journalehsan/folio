import { getCurrentWindow } from '@tauri-apps/api/window';

// ResizeDirection is internal to @tauri-apps/api and not exported; re-declare it here.
export type ResizeDirection =
  | 'East' | 'North' | 'NorthEast' | 'NorthWest'
  | 'South' | 'SouthEast' | 'SouthWest' | 'West';

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

export async function startResizeDragging(direction: ResizeDirection): Promise<void> {
  if (!isTauri()) return;
  // Cast needed because the package's internal ResizeDirection type is not exported.
  await getCurrentWindow().startResizeDragging(direction as Parameters<ReturnType<typeof getCurrentWindow>['startResizeDragging']>[0]);
}
