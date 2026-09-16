import { useState, useRef, isValidElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import type { WriteupMeta } from './loader';

interface WriteupDetailProps {
  writeup: WriteupMeta;
  onBack: () => void;
}

const CodeBlock = ({ children }: { children?: ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // Estrai la lingua dal <code className="language-xxx">
  let language = '';
  const first = Array.isArray(children) ? children[0] : children;
  if (isValidElement(first)) {
    const className = (first.props as { className?: string })?.className ?? '';
    const match = /language-(\w+)/.exec(className);
    if (match) language = match[1];
  }

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback per browser vecchi
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'text'}</span>
        <button
          type="button"
          className={`code-block-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
};

export function WriteupDetail({ writeup, onBack }: WriteupDetailProps) {
  return (
    <div className="writeup-detail">
      <button className="back-btn" onClick={onBack}>
        ← Writeups
      </button>

      <article className="writeup-article">
        <header className="writeup-header">
          <h1>{writeup.title}</h1>
          <div className="writeup-meta">
            {writeup.date && <span>{writeup.date}</span>}
            {writeup.platform && <span>{writeup.platform}</span>}
            {writeup.difficulty && <span>{writeup.difficulty}</span>}
          </div>
          {writeup.tags.length > 0 && (
            <div className="writeup-tags">
              {writeup.tags.map((tag) => (
                <span key={tag} className="writeup-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="writeup-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: CodeBlock,
            }}
          >
            {writeup.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}