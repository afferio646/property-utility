import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Add updatePropertyName to useDemo destructuring
search = "  const { userRole, setUserRole, properties, photos, addProperty } = useDemo();"
replace = "  const { userRole, setUserRole, properties, photos, addProperty, updatePropertyName } = useDemo();"

content = content.replace(search, replace)

with open(filepath, "w") as f:
    f.write(content)
