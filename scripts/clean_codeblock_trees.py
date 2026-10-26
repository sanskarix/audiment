import os
import glob
import re

def clean_codeblock_ascii(text: str) -> str:
    lines = text.split('\n')
    cleaned_lines = []
    
    for l in lines:
        stripped = l.strip()
        # If line is only connector characters (| \ │ ▼ v)
        if not re.search(r'[A-Za-z0-9]', stripped):
            continue
        
        # Replace branch characters at start of line with standard bullet
        # e.g. ├─ Detail or └── Detail or │ • Detail
        sub = re.sub(r'^\s*(?:[│|]*\s*)?(?:[├└]──?|[•\-\*])\s*', '  - ', l)
        
        # Also clean any leftover leading pipes on indented continued lines
        sub = re.sub(r'^\s*[│|]\s*', '  ', sub)
        
        cleaned_lines.append(sub)

    return '\n'.join(cleaned_lines)

def main():
    files = glob.glob('content/blog/*.mdx')
    updated = 0

    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        def block_cleaner(m):
            block = m.group(1)
            if any(c in block for c in ['├', '└', '│', '▼', '─']):
                cleaned = clean_codeblock_ascii(block)
                return f"```\n{cleaned}\n```"
            return m.group(0)

        new_content = re.sub(r'```[a-zA-Z0-9_-]*\n([\s\S]*?)```', block_cleaner, content)

        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated += 1

    print(f"Cleaned tree and arrow ASCII chars in {updated} files.")

if __name__ == '__main__':
    main()
