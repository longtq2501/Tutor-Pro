// 📁 lesson-detail-view/components/LessonContentTab.tsx
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';

interface LessonContentTabProps {
  content: string;
}

export function LessonContentTab({ content }: LessonContentTabProps) {
  const [useIframe, setUseIframe] = useState(false);
  
  // Kiểm tra xem content có complex HTML/CSS không
  useEffect(() => {
    const hasComplexStyles = content.includes('<style>') || 
      content.includes('style="') || 
      content.includes('class="');
    setUseIframe(hasComplexStyles);
  }, [content]);

  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1e293b;
            padding: 24px;
            margin: 0;
            background: #f8fafc;
          }
          .content-container {
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            max-width: 1000px;
            margin: 0 auto;
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
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'],
    ALLOWED_ATTR: ['style', 'class'],
  });

  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {useIframe ? (
            <iframe
              srcDoc={iframeContent}
              className="w-full h-[600px] border-0"
              title="Lesson Content"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="p-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}