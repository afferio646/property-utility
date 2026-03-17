# Property Management Utility

A powerful, mobile-first Progressive Web Application (PWA) designed to streamline communication and workflow tracking between Property Managers and Field Contractors.

## Table of Contents
1. [System Overview](#system-overview)
2. [Installation & Setup](#installation--setup)
3. [Manager Workflow](#manager-workflow)
4. [Contractor Workflow](#contractor-workflow)
5. [Alert System](#alert-system)
6. [Data Persistence & Archiving](#data-persistence--archiving)

---

## System Overview

The Property Management Utility uses a highly responsive, dense UI built specifically to track property renovations across multiple specific trades:
* **Trades Tracked:** Plumbing, Electric, Tile, Cabinets, Paint, Windows, Doors, Floors, and Misc.

The application allows Contractors to document their work via "Task Cards" (Photos with Checklists) and allows Managers to track progress across their entire portfolio in real time.

---

## Installation & Setup

### Local Development
To run this application on your local machine:
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone the repository and navigate into the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

### Mobile Preview via QR Code
If you are deploying this application using a service like Vercel, you can share the app easily with your client or contractors.
1. Open the file `public/mobile-preview-qr.png`.
2. Scan it using your smartphone's camera to instantly launch the live PWA (e.g., `https://afferio646-property-utility.vercel.app`) on your mobile device.

---

## Manager Workflow

The Manager has full administrative oversight over the system.

### 1. The Manager Dashboard
As a Manager, your primary hub is the **Property Admin Dashboard**, accessed via the "Dashboard" button in the app header.
The Dashboard contains three main tabs:
* **Property Contractors & Alerts:** An accordion-style view of all active properties. Managers can expand any property, see which trades are active, and manage contractor assignments. Red flashing trades indicate an active field alert that requires attention.
* **Contractor Database:** A directory of all registered contractors. Managers can assign specific trades on specific properties to contractors here.
* **System Users:** A complete list of everyone registered. Managers can change user roles (e.g., from Contractor to Manager) from this tab.
* **Archived Properties:** A historical record of completed properties.

### 2. Creating and Managing Properties
From the Dashboard or main screen, Managers can add new properties.
* **To Assign Work:** Go to the Contractor Database, select a contractor, and check the boxes for the properties and specific trades you want them to be responsible for.

### 3. Reviewing Work
Managers can click on any active trade button (e.g., a green "PLUMBING" button) for a property to view the detailed Trade Page. Here, you can review uploaded photos, read checklist notes, and verify timestamps of when work was started and completed. Managers have exclusive rights to delete task cards or individual notes if errors occur.

### 4. Archiving Completed Projects
Once all trades for a property are finished:
1. Go to the **Property Contractors & Alerts** tab on the Dashboard.
2. Click the **"Archive Property"** button next to the completed property's name.
3. The property will instantly be hidden from all active views (cleaning up the dashboard and contractors' pages).
4. The property is moved to the **Archived Properties** tab. It becomes strictly **read-only** (no new photos, tasks, or alerts can be added).
5. If future work arises, a Manager can click "Unarchive" from the Archived Properties tab to make it active again.

---

## Contractor Workflow

Contractors use a streamlined, field-friendly interface designed for mobile use.

### 1. Finding Assigned Work
When a Contractor logs in, they will only see the Properties and specific Trades that the Manager has assigned to them.
1. Click on a Property from the main landing page.
2. Click on your assigned Trade (e.g., "ELECTRIC") to open your Work Page.

### 2. Creating Task Cards
A "Task Card" represents a specific job or area (e.g., "Main Breaker Box" or "Master Bathroom Sink").
1. Click **"Add New Task Card"** (the camera icon).
2. Upload a photo of the area directly from your phone's camera or photo library.

### 3. Managing the Checklist
Under each Task Card, you can add step-by-step checklist items.
* Type a task (e.g., "Run new 220v line") and hit the `+` button.
* As you finish a task, click the circle icon next to it to check it off. The system automatically logs the exact Date and Time the task was completed.
* **Auto-Completion:** When the final task on a card is checked off, the overall status of the Task Card automatically changes to "WORK COMPLETED", and the Trade button on the main screens will turn Green.

---

## Alert System

The app features a robust two-way Alert System to handle roadblocks or issues in the field.

1. **Triggering an Alert (Contractor):** If an issue arises (e.g., "Found mold behind drywall"), the Contractor can type the issue into the Alert box on the Task Card and click the **Alert** button.
   * *Result:* The task card immediately glows red and begins pulsing. On the Manager's Dashboard, the Trade button for that property flashes red, and an alert notification is added to the "Active Field Alerts" board.
2. **Answering an Alert (Manager):** The Manager sees the red alert on their dashboard, clicks it, and can read the Contractor's note. The Manager can then type a response directly into the Task Card and click **Answer**.
   * *Result:* The alert changes from Red to Green ("ANSWERED"). The Contractor sees the manager's instructions, and the dashboard stops flashing red.

---

## Data Persistence & Archiving

* **Demo Data Saving:** Currently, the application uses local browser storage (`localStorage`) to save all properties, users, task cards, photos, and alerts. This means if you refresh the page or close the app and return later on the same device, your data will be exactly as you left it. *(Note: This is a temporary feature for testing and demonstration prior to full Firebase cloud database integration).*
* **Archiving Logic:** As detailed in the Manager Workflow, entire properties are archived at once to preserve a read-only historical record of the work performed, ensuring active dashboards remain clean and focused on current tasks.
