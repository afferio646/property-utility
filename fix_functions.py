import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# I need to insert handleEditSubmit before the return statement of Home
insert_search = """  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">"""

insert_replace = """  const startEditing = (e: React.MouseEvent, propId: string, currentName: string) => {
    e.preventDefault();
    if (userRole === "manager") {
      setEditingPropertyId(propId);
      setEditingName(currentName);
    }
  };

  const handleEditSubmit = (e: React.FormEvent | React.FocusEvent, propId: string) => {
    e.preventDefault();
    if (editingName.trim()) {
      updatePropertyName(propId, editingName.trim());
    }
    setEditingPropertyId(null);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">"""

content = content.replace(insert_search, insert_replace)

with open(filepath, "w") as f:
    f.write(content)
