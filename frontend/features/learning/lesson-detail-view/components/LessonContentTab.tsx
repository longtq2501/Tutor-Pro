import DOMPurify from 'dompurify';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LessonContentTabProps {
  content: string;
  className?: string;
}

export function LessonContentTab({ content, className }: LessonContentTabProps) {
  const [useIframe, setUseIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const hasComplexStyles = content.includes('<style>') ||
      content.includes('style="') ||
      content.includes('class="');
    setUseIframe(hasComplexStyles);
  }, [content]);

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
            // Use offsetHeight if it's larger, but scrollHeight is usually more accurate for content size
            const height = Math.max(
              body.scrollHeight,
              body.offsetHeight,
              html.offsetHeight
            );

            // Prevent jitter: ignore changes < 2px
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

          // Backup for images
          const interval = setInterval(adjustHeight, 300);
          setTimeout(() => clearInterval(interval), 2000);
        } catch (e) {
          console.warn('Iframe resize failed:', e);
        }
      }
    };

    // Handle window resize to recalculate iframe height
    const handleWindowResize = () => {
      clearTimeout(windowResizeTimeout);
      windowResizeTimeout = setTimeout(() => {
        adjustHeight();
      }, 100); // Faster response
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

  const iframeContent = `
    <!DOCTYPE html>
    <html>
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
            line-height: 1.6;
            color: #334155;
            padding: 0;
            background: transparent;
          }
          .content-container {
            max-width: 100%;
            margin: 0;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
          }
          p { 
            margin-bottom: 1rem; 
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          @media (max-width: 768px) {
            body {
              padding: 16px;
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

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'img', 'blockquote', 'code', 'pre', 'a', 'br', 'hr'],
    ALLOWED_ATTR: ['style', 'class', 'src', 'href', 'target', 'alt', 'width', 'height'],
  });

  if (useIframe) {
    return (
      <div className={cn("w-full bg-card rounded-xl border border-input shadow-sm", className)}>
        <iframe
          ref={iframeRef}
          srcDoc={iframeContent}
          className="w-full border-0 block overflow-hidden"
          style={{ minHeight: '200px' }}
          title="Lesson Content"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-card rounded-xl border border-input shadow-sm", className)}>
      <div className="p-6 md:p-8">
        <article
          className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl
          prose-p:leading-7 prose-img:rounded-xl prose-img:shadow-md
          prose-a:text-blue-600 hover:prose-a:text-blue-500"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </div>
  );
}