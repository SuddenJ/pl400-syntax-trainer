export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-scroll rounded-xl bg-slate-950 px-3 py-3 text-[13px] leading-relaxed text-teal-100 sm:text-sm">
      <code className="font-mono whitespace-pre-wrap break-words">{code}</code>
    </pre>
  )
}
