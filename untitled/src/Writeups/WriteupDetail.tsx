import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import type { WriteupMeta } from './loader';

interface WriteupDetailProps {
  writeup: WriteupMeta;
  onBack: () => void;
}

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
          >
            {writeup.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}