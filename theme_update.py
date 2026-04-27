import os
import re

directory = r"F:\ecommerce-mern\backend\frontend\src"

replacements = {
    # App.css variables
    "#8B5E3C": "#2563EB",
    "#6A3E26": "#1D4ED8",
    "#F5E9D6": "#F8FAFC",
    "#3A2B20": "#0F172A",
    
    # index.css gradient
    "linear-gradient(135deg, #F5E9D6 0%, #EADCC6 30%, #D7C2A6 60%, #C2A78E 100%)": "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
    "linear-gradient(135deg,#8B5E3C,#C2A78E)": "linear-gradient(135deg,#2563EB,#60A5FA)",
    
    # rgba strings
    "rgba(139, 94, 60": "rgba(37, 99, 235"
}

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".css") or file.endswith(".js"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                if old in new_content:
                    new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated theme in {file}")
