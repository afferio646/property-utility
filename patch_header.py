import sys

filepath = "src/app/Header.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Replace the search params and role selection with currentUser check
header_search = """export default function Header() {
  const { userRole, currentUser } = useDemo();
"""

header_replace = """export default function Header() {
  const { userRole, currentUser } = useDemo();

  const handleOpenSignUp = () => {
    const event = new Event("open-signup");
    window.dispatchEvent(event);
  };
"""
content = content.replace(header_search, header_replace)

user_search = """        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser.role} • {currentUser.company}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 border-2 border-gray-800 flex items-center justify-center text-white font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700">
             <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Guest Mode ({userRole})</span>
          </div>
        )}"""

user_replace = """        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser.role} • {currentUser.company}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 border-2 border-gray-800 flex items-center justify-center text-white font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        ) : (
          <button
            onClick={handleOpenSignUp}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-colors"
          >
             Sign Up
          </button>
        )}"""
content = content.replace(user_search, user_replace)

with open(filepath, "w") as f:
    f.write(content)
