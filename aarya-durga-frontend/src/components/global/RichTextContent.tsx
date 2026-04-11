import { cn } from "@/lib/utils";

interface RichTextContentProps {
  content?: string;
  className?: string;
}

export const RichTextContent = ({
  content = "",
  className,
}: RichTextContentProps) => {
  if (!content) {
    return null;
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none prose-p:my-0 prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-strong:text-inherit prose-em:text-inherit",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
