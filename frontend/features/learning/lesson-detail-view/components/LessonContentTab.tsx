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
 * Renders the lesson content strictly as Markdown.
 * All content is processed via ReactMarkdown + rehype-raw for consistent styling.
 */
export function LessonContentTab({ content, className, forceTheme = 'light' }: LessonContentTabProps) {
  return (
    <div className={cn("w-full transition-colors duration-500", className)}>
      <div className="p-0">
        <article
          className={cn(
            "lesson-content",
            forceTheme === 'dark' ? "dark prose-invert" : "prose-slate"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Better table wrapper - ensure consistent overflow handling
              table: ({ node, ...props }) => (
                <div className="tableWrapper">
                  <table {...props} />
                </div>
              ),

              // Custom link handling
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium transition-all" />
              ),

              // Image handling
              img: ({ node, ...props }) => (
                <img {...props} alt={props.alt || "Lesson Image"} />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
