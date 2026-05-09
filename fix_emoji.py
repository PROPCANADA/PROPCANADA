#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix remaining emoji mojibake using direct byte replacement.
These are 4-byte UTF-8 sequences where one byte (0x81) is undefined in cp1252.
"""
import os

base = r"c:\Users\LINUX ONIX\Documents\Projet\site internet html\PROP CANADA\V5"
files = [
    os.path.join(base, "pages", "reviews.html"),
    os.path.join(base, "pages", "product-info.html"),
    os.path.join(base, "pages", "delivery-info.html"),
]

# Map mojibake byte sequences (as stored in the file as UTF-8) to correct UTF-8 bytes
# These are 4-byte UTF-8 emojis that couldn't be fixed by cp1252 round-trip
# because byte 0x81 is undefined in cp1252
#
# Format: (mojibake_utf8_bytes, correct_utf8_bytes)
# To find: take the emoji, encode as UTF-8, then "mojibake" each byte through cp1252->unicode->utf8
# For bytes that can't go through cp1252 (like 0x81), they appear as replacement or get dropped
#
# Direct replacements for common emojis:
REPLACEMENTS = [
    # 🎁 (U+1F381) = F0 9F 8E 81
    # cp1252: F0=ð(C3B0) 9F=Ÿ(C5B8) 8E=Ž(C5BD) 81=undefined
    # In file as UTF-8: "ðŸŽ" + some char for 0x81
    # 0x81 in cp1252 is undefined, often stored as U+0081 (C2 81) or dropped
    (b'\xc3\xb0\xc5\xb8\xc5\xbd\xc2\x81', b'\xf0\x9f\x8e\x81'),  # 🎁
    (b'\xc3\xb0\xc5\xb8\xc5\xbd\xc2\x89', b'\xf0\x9f\x8e\x89'),  # 🎉 (U+1F389)
    (b'\xc3\xb0\xc5\xb8\xc5\xbd\xc2\x8e', b'\xf0\x9f\x8e\x8e'),  # 🎎
    # 🚀 (U+1F680) = F0 9F 9A 80
    (b'\xc3\xb0\xc5\xb8\xe2\x84\xa2\xc2\x80', b'\xf0\x9f\x9a\x80'),
    # Generic pattern for 4-byte emojis with 0x81 byte
    (b'\xc3\xb0\xc5\xb8', b'\xf0\x9f'),  # prefix ðŸ -> F09F
]

# Also fix remaining 3-char mojibake for common symbols not caught by cp1252
SYMBOL_REPLACEMENTS = [
    # ✦ (U+2726) = E2 9C A6 -> should be fixed by cp1252 already
    # ★ (U+2605) = E2 98 85 -> should be fixed by cp1252 already  
    # — (U+2014) = E2 80 94 -> should be fixed
    # → (U+2192) = E2 86 92 -> should be fixed
]

def process_file(filepath):
    print(f"\nProcessing: {os.path.basename(filepath)}")
    with open(filepath, 'rb') as f:
        raw = f.read()

    original_size = len(raw)
    fixed = raw
    total_replacements = 0

    for mojibake_bytes, correct_bytes in REPLACEMENTS:
        count = fixed.count(mojibake_bytes)
        if count > 0:
            fixed = fixed.replace(mojibake_bytes, correct_bytes)
            total_replacements += count
            print(f"  Replaced {count}x: {mojibake_bytes!r} -> {correct_bytes!r}")

    if total_replacements > 0:
        with open(filepath, 'wb') as f:
            f.write(fixed)
        print(f"  Total replacements: {total_replacements}")
    else:
        print(f"  No additional binary replacements needed.")

for f in files:
    if os.path.exists(f):
        process_file(f)
    else:
        print(f"NOT FOUND: {f}")

print("\nDone!")
