import { Resource } from '../types/library';

/**
 * Returns a URL that can be directly rendered in an <iframe> or opened in a new browser tab.
 */
export function getPdfUrl(resource: Resource | null | undefined): string {
  if (!resource) return '';

  // 1. Direct base64 or blob URL (e.g. from user file picker or ZIP extraction)
  if (resource.fileDataUrl) {
    return resource.fileDataUrl;
  }

  // 2. Direct web / public path (e.g. /interactive/... or http://...)
  const targetUrl = resource.url || resource.sourceUrl;
  if (targetUrl) {
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('/')) {
      return targetUrl;
    }
  }

  // 3. Local filesystem path (e.g. C:\Users\... or /path/...)
  const targetPath = resource.fileName || resource.sourceUrl;
  if (targetPath) {
    if (targetPath.startsWith('http://') || targetPath.startsWith('https://') || targetPath.startsWith('/')) {
      return targetPath;
    }
    // Stream local PDF via our Vite local server endpoint
    return `/api/pdf?path=${encodeURIComponent(targetPath)}`;
  }

  // 3. Fallback to generic url if available
  if (resource.url) {
    return resource.url;
  }

  return '';
}

/**
 * Opens the actual PDF in a fresh browser tab with native browser PDF reader controls.
 */
export function openPdfInNewTab(resource: Resource | null | undefined): boolean {
  const url = getPdfUrl(resource);
  if (!url) {
    console.warn('No valid PDF path or URL found for resource:', resource);
    return false;
  }

  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (win) {
    win.focus();
    return true;
  }
  return false;
}
