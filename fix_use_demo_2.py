import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

search = "const { properties, addProperty, userRole, setUserRole, photos } = useDemo();"
replace = "const { properties, addProperty, userRole, setUserRole, photos, updatePropertyName } = useDemo();"

content = content.replace(search, replace)

with open(filepath, "w") as f:
    f.write(content)
