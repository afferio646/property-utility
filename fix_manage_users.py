import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Add import
import_search = """import { useDemo } from "@/contexts/DemoContext";
import SignUpModal from "./SignUpModal";
import Header from "./Header";"""

import_replace = """import { useDemo } from "@/contexts/DemoContext";
import SignUpModal from "./SignUpModal";
import Header from "./Header";
import ManageUsersModal from "./ManageUsersModal";"""

content = content.replace(import_search, import_replace)

# Add the button
btn_search = """        <div className="flex justify-between items-center px-4 md:px-0">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Properties</h1>
            <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-1 rounded-full border border-[#374151]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-xs font-semibold text-gray-300 tracking-wide">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-1 rounded-full border border-[#374151]">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span className="text-xs font-semibold text-gray-300 tracking-wide">DONE</span>
            </div>
          </div>
          {userRole === "manager" && ("""

btn_replace = """        <div className="flex justify-between items-center px-4 md:px-0">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Properties</h1>
            <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-1 rounded-full border border-[#374151]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-xs font-semibold text-gray-300 tracking-wide">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1f2937] px-3 py-1 rounded-full border border-[#374151]">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span className="text-xs font-semibold text-gray-300 tracking-wide">DONE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <ManageUsersModal />
             {userRole === "manager" && ("""

content = content.replace(btn_search, btn_replace)

# Close the div
close_search = """              >
                + Add Property
              </button>
            </div>
          )}
        </div>"""

close_replace = """              >
                + Add Property
              </button>
            </div>
          )}
          </div>
        </div>"""

content = content.replace(close_search, close_replace)

with open(filepath, "w") as f:
    f.write(content)
