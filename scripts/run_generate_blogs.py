# scripts/run_generate_blogs.py
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from generate_all_15_blogs import render_mdx, BLOG_DIR
from blog_data_part1 import blogs_part1
from blog_data_part2 import blogs_part2
from blog_data_part3 import blogs_part3

all_blogs = blogs_part1 + blogs_part2 + blogs_part3
print(f"Total blogs to generate: {len(all_blogs)}")

generated = []
for blog in all_blogs:
    filename = blog['filename']
    filepath = os.path.join(BLOG_DIR, filename)
    content = render_mdx(blog)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    size = os.path.getsize(filepath)
    print(f"Generated: {filename} ({size} bytes)")
    generated.append(filename)

print(f"\nSuccessfully generated all {len(generated)} blog files in {BLOG_DIR}!")
