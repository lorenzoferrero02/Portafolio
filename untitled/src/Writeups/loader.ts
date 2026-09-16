const modules = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface WriteupMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  platform?: string;
  difficulty?: string;
  tags: string[];
  content: string;
}

function parseFrontmatter(raw: string): {
  data: Record<string, any>;
  content: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };

  const [, yaml, content] = match;
  const data: Record<string, any> = {};

  yaml.split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value: any = line.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }

    data[key] = value;
  });

  return { data, content };
}

export const writeups: WriteupMeta[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.replace('./posts/', '').replace('.md', '');
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      description: data.description,
      platform: data.platform,
      difficulty: data.difficulty,
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));