import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

const LG_BREAKPOINT = 1280

export function useIsLg() {
  const [isLg, setIsLg] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsLg(window.innerWidth < LG_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsLg(window.innerWidth < LG_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isLg
}

const XL_BREAKPOINT = 1620

export function useIsXl() {
  const [isXl, setXl] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${XL_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setXl(window.innerWidth < XL_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setXl(window.innerWidth < XL_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isXl
}

export const isMobileDevice = () => {
  // Check must be done this way to prevent SSR errors where `navigator` is not defined.
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}


/**
 * A robust function to copy text to the clipboard.
 * It first tries the modern, asynchronous Clipboard API in a secure context.
 * If that fails, it falls back to the legacy `document.execCommand('copy')` method.
 * @param {string} text The text to copy.
 * @returns {Promise<boolean>} A promise that resolves to `true` if successful, `false` otherwise.
 */
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  // Modern Clipboard API (Secure Context)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy with modern API, falling back.", err);
    }
  }

  // Legacy Method
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Failed to copy with legacy method.", err);
    document.body.removeChild(textArea);
    return false;
  }
};