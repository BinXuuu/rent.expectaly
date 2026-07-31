export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
}

/** 基于原生 <details>/<summary> 的手风琴，无需 JS 即可展开/折叠，满足可访问性要求。 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="border-line divide-line divide-y border-t border-b">
      {items.map((item) => (
        <details key={item.question} className="group py-3">
          <summary className="focus-ring text-ink flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            {item.question}
            <span aria-hidden="true" className="text-ink-faint ml-4 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="text-ink-muted mt-2 text-sm leading-6">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
