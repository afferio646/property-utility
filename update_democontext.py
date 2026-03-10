import sys

filepath = "src/contexts/DemoContext.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Make User interface
user_interface = """
export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
}
"""

content = content.replace("export type UserRole = \"manager\" | \"lead\" | \"technician\";", "export type UserRole = \"manager\" | \"lead\" | \"technician\" | \"none\";\n" + user_interface)

# Update TradeType with an "Other" option or just change it to be a string type for any new trade type.
# For simplicity, we can keep TradeType as it is but allow string. Actually let's just make it string.
content = content.replace("export type TradeType =\n  | \"plumbing\"\n  | \"electric\"\n  | \"tile\"\n  | \"cabinets\"\n  | \"paint\"\n  | \"windows\"\n  | \"doors\"\n  | \"floors\"\n  | \"misc\";", "export type TradeType = string;")

# Update DemoContextType
demo_context_type_search = """interface DemoContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;"""

demo_context_type_replace = """interface DemoContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  addUser: (name: string, email: string, company: string, role: UserRole) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  updatePropertyName: (propertyId: string, name: string) => void;"""

content = content.replace(demo_context_type_search, demo_context_type_replace)

# Update Provider
provider_search = """export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("manager");
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);"""

provider_replace = """export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<UserRole>("none"); // derived or fallback
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const addUser = (name: string, email: string, company: string, role: UserRole) => {
    const newUser: User = { id: Date.now().toString(), name, email, company, role };
    setUsers([...users, newUser]);
    if (!currentUser) {
        setCurrentUser(newUser);
        setUserRole(role);
    }
  };

  const updatePropertyName = (propertyId: string, name: string) => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, name } : p));
  };
"""

content = content.replace(provider_search, provider_replace)

# Update return values
return_search = """    <DemoContext.Provider
      value={{
        userRole,
        setUserRole,
        properties,"""

return_replace = """    <DemoContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        userRole,
        setUserRole,
        updatePropertyName,
        properties,"""

content = content.replace(return_search, return_replace)

with open(filepath, "w") as f:
    f.write(content)
