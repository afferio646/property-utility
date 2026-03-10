import sys

filepath = "src/contexts/DemoContext.tsx"

with open(filepath, "r") as f:
    content = f.read()

interface_search = """export interface Property {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  imageUrl?: string;
}"""

interface_replace = """export interface CustomTrade {
  id: string;
  type: string;
  label: string;
  iconName: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  imageUrl?: string;
  customTrades?: CustomTrade[];
}"""

content = content.replace(interface_search, interface_replace)

demo_context_type_search = """  addProperty: (name: string, address?: string, imageUrl?: string) => void;
  photos: Photo[];"""

demo_context_type_replace = """  addProperty: (name: string, address?: string, imageUrl?: string) => void;
  addCustomTrade: (propertyId: string, label: string) => void;
  photos: Photo[];"""

content = content.replace(demo_context_type_search, demo_context_type_replace)

provider_search = """  const updatePropertyName = (propertyId: string, name: string) => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, name } : p));
  };"""

provider_replace = """  const updatePropertyName = (propertyId: string, name: string) => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, name } : p));
  };

  const addCustomTrade = (propertyId: string, label: string) => {
    const type = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTrade: CustomTrade = { id: Date.now().toString(), type, label, iconName: "FaTools" };
    setProperties(properties.map(p => {
      if (p.id === propertyId) {
        return { ...p, customTrades: [...(p.customTrades || []), newTrade] };
      }
      return p;
    }));
  };"""

content = content.replace(provider_search, provider_replace)

return_search = """        properties,
        addProperty,"""

return_replace = """        properties,
        addProperty,
        addCustomTrade,"""

content = content.replace(return_search, return_replace)

with open(filepath, "w") as f:
    f.write(content)
