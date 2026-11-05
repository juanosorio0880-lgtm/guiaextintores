import os

DIR = r"c:\Users\USER\Downloads\sucur"

for root, dirs, files in os.walk(DIR):
    for fn in files:
        if fn.endswith('.html') or fn.endswith('.css'):
            filepath = os.path.join(root, fn)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace('"/img/', '"img/')
            new_content = new_content.replace("'/img/", "'img/")
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Images fixed")
