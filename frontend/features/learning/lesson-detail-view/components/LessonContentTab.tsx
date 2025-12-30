import DOMPurify from 'dompurify';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LessonContentTabProps {
  content: string;
  className?: string;
  forceTheme?: 'light' | 'dark';
}

export function LessonContentTab({ content, className, forceTheme = 'light' }: LessonContentTabProps) {
  const [useIframe, setUseIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // If iframe is needed for complex styles, but also consider if we want to force theme within iframe
    const hasComplexStyles = content.includes('<style>') ||
      content.includes('style="') ||
      content.includes('class="');
    setUseIframe(hasComplexStyles);
  }, [content]);

  // iframe content generation with themed styles
  const getIframeContent = (theme: 'light' | 'dark') => `
    <!DOCTYPE html>
    <html class="${theme}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            overflow: visible;
          }
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.7;
            padding: 0;
            background: transparent;
            color: ${theme === 'light' ? '#334155' : '#cbd5e1'};
            transition: color 0.3s ease;
          }
          .content-container {
            max-width: 100%;
            margin: 0;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            display: block;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
          p { 
            margin-bottom: 1.25rem; 
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
          }
          th, td {
            border: 1px solid ${theme === 'light' ? '#e2e8f0' : '#334155'};
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: ${theme === 'light' ? '#f8fafc' : '#1e293b'};
          }
          @media (max-width: 768px) {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="content-container">
          ${content}
        </div>
      </body>
    </html>
  `;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !useIframe) return;

    let resizeObserver: ResizeObserver | null = null;
    let windowResizeTimeout: NodeJS.Timeout;

    const adjustHeight = () => {
      if (iframe.contentWindow) {
        try {
          requestAnimationFrame(() => {
            if (!iframe.contentWindow) return;
            const body = iframe.contentWindow.document.body;
            const html = iframe.contentWindow.document.documentElement;
            
            if (!body || !html) return;

            const height = Math.max(
              body.scrollHeight,
              body.offsetHeight,
              html.offsetHeight
            );

            const currentHeight = parseFloat(iframe.style.height || '0');
            if (Math.abs(height - currentHeight) < 2) return;

            iframe.style.height = `${height}px`;
          });
        } catch (e) {
          // Ignore
        }
      }
    };

    const onLoad = () => {
      const frameWindow = iframe.contentWindow;
      if (frameWindow) {
        try {
          adjustHeight();
          if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => adjustHeight());
            resizeObserver.observe(frameWindow.document.body);
          }
          const interval = setInterval(adjustHeight, 300);
          setTimeout(() => clearInterval(interval), 2000);
        } catch (e) {
          console.warn('Iframe resize failed:', e);
        }
      }
    };

    const handleWindowResize = () => {
      clearTimeout(windowResizeTimeout);
      windowResizeTimeout = setTimeout(() => {
        adjustHeight();
      }, 100);
    };

    iframe.addEventListener('load', onLoad);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      iframe.removeEventListener('load', onLoad);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();
      clearTimeout(windowResizeTimeout);
    };
  }, [useIframe, content]);

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'img', 'blockquote', 'code', 'pre', 'a', 'br', 'hr'],
    ALLOWED_ATTR: ['style', 'class', 'src', 'href', 'target', 'alt', 'width', 'height'],
  });

  if (useIframe) {
    return (
      <div className={cn("w-full transition-colors duration-500", className)}>
        <iframe
          ref={iframeRef}
          srcDoc={getIframeContent(forceTheme)}
          className="w-full border-0 block overflow-hidden"
          style={{ minHeight: '200px' }}
          title="Lesson Content"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full transition-colors duration-500", className)}>
      <div className="p-0">
        <article
          className={cn(
            "prose max-w-none transition-colors duration-500",
            forceTheme === 'light'
              ? "prose-slate"
              : "prose-invert prose-slate",
            "prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl",
            "prose-p:leading-8 prose-img:rounded-2xl prose-img:shadow-xl",
            "prose-a:text-primary hover:prose-a:text-primary/80"
          )}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </div>
  );
}