import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The garbled text is UTF-8 misinterpreted as CP1252.
    # So we want to find all strings that look garbled and fix them.
    # It's safer to just encode as cp1252 and decode as utf-8.
    # But doing this on the whole file will crash if there are real unicode chars.
    
    # We can try reading the raw bytes, but the file was already SAVED as UTF-8 containing garbled chars.
    # Let's read the file line by line, find garbled strings
    
    new_lines = []
    changed = False
    for line in content.splitlines(True):
        try:
            # If the line contains these strange characters, try to un-garble it
            if 'Ø' in line or 'Ù' in line:
                fixed_line = line.encode('cp1252').decode('utf-8')
                new_lines.append(fixed_line)
                changed = True
            else:
                new_lines.append(line)
        except Exception as e:
            # If it fails, just append original line
            new_lines.append(line)

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed {filepath}")

def main():
    root_dir = r"c:\Users\Public\.gemini\antigravity\scratch\kafi_online\lib"
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".dart"):
                filepath = os.path.join(subdir, file)
                fix_file(filepath)

if __name__ == '__main__':
    main()
