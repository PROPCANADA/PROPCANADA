#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix mojibake in HTML files using cp1252 (Windows-1252) round-trip.
The files contain UTF-8 bytes that were misread as cp1252 and re-saved as UTF-8.
Fix: encode back to cp1252, then decode as UTF-8 to get original characters.
"""
import os

base = r"c:\Users\LINUX ONIX\Documents\Projet\site internet html\PROP CANADA\V5"
files = [
    os.path.join(base, "pages", "reviews.html"),
    os.path.join(base, "pages", "product-info.html"),
    os.path.join(base, "pages", "delivery-info.html"),
]

def fix_line(line):
    try:
        return line.encode('cp1252').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return line

def process_file(filepath):
    print(f"\nProcessing: {os.path.basename(filepath)}")
    with open(filepath, 'rb') as f:
        raw = f.read()

    # Remove BOM if present
    if raw.startswith(b'\xef\xbb\xbf'):
        raw = raw[3:]
        print("  Removed UTF-8 BOM")

    content = raw.decode('utf-8', errors='replace')
    lines = content.splitlines(keepends=True)

    fixed_lines = []
    changes = 0
    for line in lines:
        # Strip \r\n endings, fix, re-add
        ending = ''
        stripped = line
        if line.endswith('\r\n'):
            ending = '\r\n'
            stripped = line[:-2]
        elif line.endswith('\n'):
            ending = '\n'
            stripped = line[:-1]
        elif line.endswith('\r'):
            ending = '\r'
            stripped = line[:-1]

        fixed = fix_line(stripped)
        if fixed != stripped:
            changes += 1
        fixed_lines.append(fixed + ending)

    result = ''.join(fixed_lines)
    with open(filepath, 'wb') as f:
        f.write(result.encode('utf-8'))

    print(f"  Lines fixed: {changes}")
    print(f"  Done.")

for f in files:
    if os.path.exists(f):
        process_file(f)
    else:
        print(f"NOT FOUND: {f}")

print("\nAll done!")
