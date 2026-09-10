/**
 * Minimal ambient types for `page-flip` (StPageFlip), which ships no
 * declarations of its own. Only the surface DestinationsFlipbook uses is
 * described — extend it here if more of the API is needed.
 */
declare module 'page-flip' {
  export interface PageFlipSettings {
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    /** Draw the first and last pages as hard covers. */
    showCover?: boolean
    /** Single-page (portrait) rather than two-page spreads. */
    usePortrait?: boolean
    drawShadow?: boolean
    maxShadowOpacity?: number
    flippingTime?: number
    startPage?: number
    autoSize?: boolean
    useMouseEvents?: boolean
    mobileScrollSupport?: boolean
    swipeDistance?: number
    showPageCorners?: boolean
    disableFlipByClick?: boolean
    clickEventForward?: boolean
  }

  export interface FlipEvent {
    /** Page index for "flip"; the new state string for "changeState". */
    data: number | string
    object: PageFlip
  }

  export type FlipEventName = 'flip' | 'changeState' | 'changeOrientation' | 'init' | 'update'

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings)
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void
    updateFromHtml(items: NodeListOf<Element> | HTMLElement[]): void
    on(event: FlipEventName, callback: (e: FlipEvent) => void): void
    flip(page: number, corner?: 'top' | 'bottom'): void
    flipNext(corner?: 'top' | 'bottom'): void
    flipPrev(corner?: 'top' | 'bottom'): void
    turnToPage(page: number): void
    getCurrentPageIndex(): number
    getPageCount(): number
    getOrientation(): 'portrait' | 'landscape'
    destroy(): void
  }
}
