import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Add imports
imports = """import Image from "next/image";
import Link from "next/link";
import { useDemo } from "@/contexts/DemoContext";
import SignUpModal from "./SignUpModal";
import Header from "./Header";
"""

content = content.replace('import Image from "next/image";\nimport Link from "next/link";\nimport { useDemo } from "@/contexts/DemoContext";\n', imports)

# Remove the old header and replace it with <Header />
header_search = """      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12 border-b border-[#1f2937] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-2xl text-black">
              N
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-white">
              PROP<span className="text-blue-500">UTIL</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-400">Role:</span>
             <select
               value={userRole}
               onChange={(e) => setUserRole(e.target.value as any)}
               className="bg-[#1f2937] border border-[#374151] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
             >
               <option value="manager">Manager</option>
               <option value="lead">Lead</option>
               <option value="technician">Technician</option>
             </select>
          </div>
        </div>"""

header_replace = """      <Header />
      <SignUpModal />
      <div className="max-w-7xl mx-auto space-y-8 mt-8">
        {/* Header Section Removed - Now using Header component */}
"""

content = content.replace(header_search, header_replace)

with open(filepath, "w") as f:
    f.write(content)
