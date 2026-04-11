with open("src/app/(public)/privacy-policy/page.tsx", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Fix data chips
text = text.replace('<div >\n          <span >Names</span>', '<div className="flex flex-wrap gap-3 mb-8">\n          <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Names</span>')
text = text.replace('<span >Email addresses</span>', '<span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Email addresses</span>')
text = text.replace('<span >Phone numbers</span>', '<span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Phone numbers</span>')
text = text.replace('<span >Job titles</span>', '<span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Job titles</span>')
text = text.replace('<span >Usernames</span>', '<span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Usernames</span>')
text = text.replace('<span >Passwords</span>', '<span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">Passwords</span>')

# Fix provider grid
text = text.replace('<div >\n          <div >\n            <p >Google Cloud Platform</p>', '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">\n          <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">\n            <p className="font-semibold text-neutral-900">Google Cloud Platform</p>')
text = re.sub(r'<div >\s*<p >(.*?)</p>\s*<p >(.*?)</p>\s*</div>', r'<div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">\n            <p className="font-semibold text-neutral-900">\1</p>\n            <p className="text-sm text-neutral-500 mt-1">\2</p>\n          </div>', text)

# Fix <em> sections to use tailwind text-neutral-600
text = text.replace('<p ><em>', '<p className="text-lg text-neutral-600 mb-6 italic"><em>')

with open("src/app/(public)/privacy-policy/page.tsx", "w", encoding="utf-8") as f:
    f.write(text)
