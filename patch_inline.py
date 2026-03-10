import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Add state
state_search = """  const [newPropImage, setNewPropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);"""

state_replace = """  const [newPropImage, setNewPropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
"""
content = content.replace(state_search, state_replace)

# Add edit logic
edit_logic_search = """  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(newPropName.trim(), newPropAddress.trim(), newPropImage || "");
      setShowAddForm(false);
      setNewPropName("");
      setNewPropAddress("");
      setNewPropImage(null);
    }
  };"""

edit_logic_replace = """  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(newPropName.trim(), newPropAddress.trim(), newPropImage || "");
      setShowAddForm(false);
      setNewPropName("");
      setNewPropAddress("");
      setNewPropImage(null);
    }
  };

  const startEditing = (e: React.MouseEvent, propId: string, currentName: string) => {
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
"""
content = content.replace(edit_logic_search, edit_logic_replace)

# Update JSX to include the input
jsx_search = """              {/* Property Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 mb-1" title={prop.name}>{prop.name}</h3>"""

jsx_replace = """              {/* Property Details */}
              <div className="p-4 flex-1 flex flex-col">
                {editingPropertyId === prop.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, prop.id)} className="mb-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={(e) => handleEditSubmit(e, prop.id)}
                      autoFocus
                      className="text-sm font-bold text-gray-900 w-full border-b border-blue-500 outline-none bg-transparent"
                    />
                  </form>
                ) : (
                  <h3
                    className={`text-sm font-bold text-gray-900 mb-1 ${userRole === 'manager' ? 'cursor-pointer hover:text-blue-600' : ''}`}
                    title={prop.name}
                    onClick={(e) => startEditing(e, prop.id, prop.name)}
                  >
                    {prop.name}
                  </h3>
                )}"""
content = content.replace(jsx_search, jsx_replace)

with open(filepath, "w") as f:
    f.write(content)
