import os
import glob
import re

def convert_p1_block(block: str) -> str:
    lines = block.strip().split('\n')
    title = ''
    arrow_line_idx = -1
    for i, l in enumerate(lines):
        if '│' in l and not title:
            clean = l.replace('│', '').strip()
            if clean and len(clean) > 3:
                title = clean
        if len(re.findall(r'[▼v]', l)) >= 2:
            arrow_line_idx = i
            break

    if arrow_line_idx == -1:
        return block

    text_lines = [l for l in lines[arrow_line_idx + 1:] if l.strip() and re.search(r'[A-Za-z0-9]', l)]
    if not text_lines:
        return block

    header_line = text_lines[0]
    chunks = [c.strip() for c in re.split(r'\s{2,}', header_line.strip()) if c.strip()]
    if len(chunks) < 2:
        return block

    col_starts = []
    curr = 0
    for ch in chunks:
        idx = header_line.find(ch, curr)
        col_starts.append(idx)
        curr = idx + len(ch)

    bounds = []
    for i in range(len(col_starts)):
        s = col_starts[i]
        e = 9999 if i == len(col_starts) - 1 else col_starts[i+1]
        bounds.append((s, e))

    cols = [[] for _ in bounds]
    for tl in text_lines:
        for i, (s, e) in enumerate(bounds):
            part = tl[s:min(e, len(tl))].strip()
            if part:
                cols[i].append(part)

    result = [f"{title}:\n"]
    for c in cols:
        if not c:
            continue
        col_title = c[0].strip('•* ')
        col_body = ' '.join(c[1:]).strip()
        result.append(f"[{col_title}]\n{col_body}\n")

    return '\n'.join(result).strip()

def convert_p2_block(block: str) -> str:
    lines = block.strip().split('\n')
    title = ''
    items = []

    for l in lines:
        if '|' in l:
            clean = l.strip('| \t')
            if not clean:
                continue
            if '-->' in clean:
                parts = clean.split('-->')
                stage_name = parts[0].strip()
                stage_desc = parts[1].strip()
                items.append((stage_name, stage_desc))
            elif not title and len(clean) > 5 and not any(k in clean for k in ['+', '-']):
                title = clean.title()

    if not items:
        return block

    result = [f"{title}:\n"]
    for name, desc in items:
        result.append(f"[{name}]\n{desc}\n")

    return '\n'.join(result).strip()

def main():
    files = glob.glob('content/blog/*.mdx')
    p1_converted = 0
    p2_converted = 0

    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content

        # Check for Pattern 1: ```\n┌...```
        def p1_sub(m):
            nonlocal p1_converted
            converted = convert_p1_block(m.group(1))
            if converted != m.group(1):
                p1_converted += 1
                return f"```\n{converted}\n```"
            return m.group(0)

        new_content = re.sub(r'```[a-zA-Z0-9_-]*\n(┌[\s\S]*?)```', p1_sub, new_content)

        # Check for Pattern 2: ```\n+...```
        def p2_sub(m):
            nonlocal p2_converted
            converted = convert_p2_block(m.group(1))
            if converted != m.group(1):
                p2_converted += 1
                return f"```\n{converted}\n```"
            return m.group(0)

        new_content = re.sub(r'```[a-zA-Z0-9_-]*\n(\+[\s\S]*?)```', p2_sub, new_content)

        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)

    print(f"Successfully converted {p1_converted} Pattern 1 blocks and {p2_converted} Pattern 2 blocks!")

if __name__ == '__main__':
    main()
