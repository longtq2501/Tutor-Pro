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

  // Check for complex HTML/CSS
  useEffect(() => {
    const hasComplexStyles = content.includes('<style>') ||
      content.includes('style="') ||
      content.includes('class="');
    setUseIframe(hasComplexStyles);
  }, [content]);

  // Expand iframe height dynamically
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !useIframe) return;

    let resizeObserver: ResizeObserver | null = null;
    let frameContentWindow: Window | null = null;

    const adjustHeight = () => {
      if (iframe.contentWindow) {
        try {
          const bodyHeight = iframe.contentWindow.document.body.scrollHeight;
          const docHeight = iframe.contentWindow.document.documentElement.scrollHeight;
          // Use the larger of the two to prevent clipping
          const height = Math.max(bodyHeight, docHeight);
          // Add a small buffer to prevent scrollbar flickering or fractional pixel clipping
          iframe.style.height = `${height + 4}px`;
        } catch (e) {
          // Cross-origin issues might prevent access, though srcDoc usually avoids this
        }
      }
    };

    const onLoad = () => {
      frameContentWindow = iframe.contentWindow;
      if (frameContentWindow) {
        try {
          // 1. Initial Adjustment
          adjustHeight();

          // 2. Setup ResizeObserver
          if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => adjustHeight());
            resizeObserver.observe(frameContentWindow.document.body);
            resizeObserver.observe(frameContentWindow.document.documentElement);
          }

          // 3. One-time poller for late-loading images (backup)
          const interval = setInterval(adjustHeight, 500);
          setTimeout(() => clearInterval(interval), 3000);

        } catch (e) {
          console.warn('Iframe resize setup failed:', e);
        }
      }
    };

    iframe.addEventListener('load', onLoad);

    return () => {
      iframe.removeEventListener('load', onLoad);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [useIframe, content]);

  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #334155;
            padding: 32px;
            margin: 0;
            background: #ffffff;
            overflow-y: hidden; /* Hide scrollbar inside iframe */
          }
          .content-container {
            max-width: 100%;
            margin: 0 auto;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
          }
          p { margin-bottom: 1rem; }
        </style>
        <script>
           // Optional: Report height changes if resizing happens (e.g. images loading)
           window.addEventListener('load', () => {
             const height = document.documentElement.scrollHeight;
             // We can't easily postMessage back without setup, but this script ensures 
             // document is fully loaded before parent tries to measure if using onLoad
           });
        </script>
      </head>
      <body>
        <div class="content-container">
          ${content}
        </div>
      </body>
    </html>
  `;

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'img', 'blockquote', 'code', 'pre', 'a'],
    ALLOWED_ATTR: ['style', 'class', 'src', 'href', 'target', 'alt'],
  });

  if (useIframe) {
    return (
      <div className={cn("w-full bg-card rounded-lg border shadow-sm overflow-hidden", className)}>
        <iframe
          ref={iframeRef}
          srcDoc={iframeContent}
          className="w-full border-0 block"
          style={{ minHeight: '200px' }}
          title="Lesson Content"
          sandbox="allow-same-origin allow-scripts" // allow-scripts needed for any resizing logic inside if we added it
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-card rounded-lg border shadow-sm", className)}>
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