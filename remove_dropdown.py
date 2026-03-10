import sys

filepath = "src/app/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# Remove the dropdown menu entirely
dropdown_search = """            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="bg-[#151b2b] border border-gray-600 text-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block px-3 py-2.5 outline-none transition-colors"
            >
              <option value="manager">Manager</option>
              <option value="lead">Lead</option>
              <option value="technician">Technical/Contractor</option>
            </select>"""

content = content.replace(dropdown_search, "")

with open(filepath, "w") as f:
    f.write(content)
