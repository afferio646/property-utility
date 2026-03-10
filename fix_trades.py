import sys

filepath = "src/app/properties/[id]/page.tsx"

with open(filepath, "r") as f:
    content = f.read()

# 1. Update imports
import_search = """import { useDemo, TradeType } from "@/contexts/DemoContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaWrench,
  FaBolt,
  FaBorderAll,
  FaColumns,
  FaPaintRoller,
  FaBorderNone,
  FaDoorOpen,
  FaLayerGroup,
  FaTools,
  FaArrowLeft,"""

import_replace = """import React, { useState } from "react";
import { useDemo, TradeType } from "@/contexts/DemoContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaWrench,
  FaBolt,
  FaBorderAll,
  FaColumns,
  FaPaintRoller,
  FaBorderNone,
  FaDoorOpen,
  FaLayerGroup,
  FaTools,
  FaArrowLeft,
  FaPlus,"""

content = content.replace(import_search, import_replace)

# 2. Extract tradeConfig so it can be dynamic per property if needed, but for now we'll store it locally. Wait, the user said "they can add any new trade they want and a new button will appear on the trades page with an icon and the name of the new trade".
# Since tradeConfig is currently a const array, we should move it into state or context.
# Let's move it to context so it persists per property, OR just persist it globally for now.
# Easiest way is to add it to the DemoContext. Let's update DemoContext first.
