import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface LessonContentTabProps {
  content: string;
  className?: string;
  forceTheme?: 'light' | 'dark';
}

/**
 * Renders the lesson content using a robust hybrid approach.
 * Handles Tiptap's Markdown output (which may contain HTML tags) 
 * by using ReactMarkdown + rehype-raw.
 */
export function LessonContentTab({ content, className, forceTheme = 'light' }: LessonContentTabProps) {
  // If the content is purely HTML (starts with a tag), we can render it directly for better performance
  // but ReactMarkdown + rehypeRaw is generally safer for mixed content.
  const isPureHtml = content.trim().startsWith('<') && content.trim().endsWith('>');

  return (
    <div className={cn("w-full transition-colors duration-500", className)}>
      <div className="p-0">
        <article
          className={cn(
            "prose max-w-none transition-colors duration-500 tiptap",
            forceTheme === 'light'
              ? "prose-slate"
              : "prose-invert prose-zinc",
            // Enhanced dark mode text colors
            forceTheme === 'dark' && "prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-zinc-200",
            "prose-p:leading-8 prose-img:rounded-2xl prose-img:shadow-xl",
            "prose-a:text-primary hover:prose-a:text-primary/80",
            // Markdown specific adjustments
            "prose-pre:bg-muted prose-pre:text-foreground prose-pre:border",
            "prose-code:text-primary prose-code:bg-primary/10 prose-code:rounded prose-code:px-1 prose-code:before:content-none prose-code:after:content-none",
            // Table adjustments
            "prose-table:border-collapse prose-table:w-full prose-table:my-0",
            forceTheme === 'light'
              ? "prose-th:border prose-th:border-border prose-th:p-4 prose-th:bg-muted/50 prose-th:text-center"
              : "prose-th:border prose-th:border-white/15 prose-th:p-4 prose-th:bg-white/10 prose-th:text-center prose-th:text-zinc-100",
            forceTheme === 'light'
              ? "prose-td:border prose-td:border-border prose-td:p-4"
              : "prose-td:border prose-td:border-white/15 prose-td:p-4 prose-td:text-zinc-300"
          )}
        >
          {isPureHtml ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // Ensure centered headings/paragraphs from Tiptap/Markdown are respected
                h1: ({ node, ...props }) => <h1 {...props} style={{ textAlign: (props as any).style?.textAlign || 'inherit' }} />,
                h2: ({ node, ...props }) => <h2 {...props} style={{ textAlign: (props as any).style?.textAlign || 'inherit' }} />,
                h3: ({ node, ...props }) => <h3 {...props} style={{ textAlign: (props as any).style?.textAlign || 'inherit' }} />,
                p: ({ node, ...props }) => <p {...props} style={{ textAlign: (props as any).style?.textAlign || 'inherit' }} />,
                // Better table wrapper
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-8 border rounded-xl overflow-hidden shadow-sm">
                    <table {...props} className="min-w-full border-collapse m-0" />
                  </div>
                ),
                // Custom link handling
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />,
                // Custom image handling
                img: ({ node, ...props }) => <img {...props} className="rounded-xl mx-auto shadow-lg my-8" />
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </article>
      </div>

      {/* Helper styles to ensure Tiptap's data attributes work even without direct React components */}
      <style jsx global>{`
        .tiptap [data-text-align="center"] { text-align: center !important; }
        .tiptap [data-text-align="right"] { text-align: right !important; }
        .tiptap [data-text-align="left"] { text-align: left !important; }
      `}</style>
    </div>
  );
}