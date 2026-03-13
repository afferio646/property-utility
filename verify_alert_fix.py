from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    # Go to app and set role to manager
    page.goto("http://localhost:3000/")

    # Wait for the select element to load
    page.wait_for_selector('select.bg-transparent')

    # Change role to contractor first! We need to make the alert AS A CONTRACTOR so it registers properly
    # If the manager does it, it might not set the contractorId properly on the alert photo in DemoContext
    page.select_option('select.bg-transparent', value='contractor')
    print("Changed role to Contractor")

    # Go to a trade page directly to create an alert (Property 1, tile)
    page.goto("http://localhost:3000/properties/1/trades/tile")

    # Wait for page to load
    page.wait_for_selector('h1:has-text("TILE TRADE")')
    print("Navigated to TILE TRADE")

    # Add new task card (This opens the file input)
    page.wait_for_selector('button:has-text("ADD NEW TASK CARD")')
    page.click('button:has-text("ADD NEW TASK CARD")')

    # Create a tiny 1x1 png in memory (base64) to upload, or just wait for the input and set files
    with open("test_image.png", "wb") as f:
        # Minimum valid PNG
        f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')

    # Upload the file
    page.set_input_files('input[type="file"]', 'test_image.png')

    # Click Upload
    page.click('button:has-text("Upload")')
    print("Uploaded photo to create a task card")

    # Wait a bit then check what the page looks like
    page.wait_for_timeout(1000)

    # Find the alert input (Using exact placeholder)
    page.wait_for_selector('input[placeholder="Type alert reason here..."]')
    alert_inputs = page.locator('input[placeholder="Type alert reason here..."]')
    new_alert_input = alert_inputs.nth(alert_inputs.count() - 1)
    new_alert_input.fill("Grout color is wrong, please advise")

    # Click the Alert button next to it
    alert_buttons = page.locator('button:has-text("ALERT")')
    alert_buttons.nth(alert_buttons.count() - 1).click()
    print("Created an alert!")

    # Wait a sec for state to update
    page.wait_for_timeout(1000)

    # Switch back to manager!
    page.select_option('select.bg-transparent', value='manager')
    print("Changed role to Manager")

    # Now navigate back to dashboard
    page.goto("http://localhost:3000/dashboard")
    page.wait_for_selector('text=Active Field Alerts')
    print("Dashboard loaded, Active Field Alerts box is visible")

    # Take a screenshot before clicking
    page.wait_for_timeout(2000) # give it time to render
    page.screenshot(path="dashboard_before_click.png")
    print("Saved screenshot dashboard_before_click.png")

    # Find the red pulsing tile button
    tile_btns = page.locator('button.bg-red-600')
    if tile_btns.count() > 0:
        print("Found red pulsing button, clicking it.")
        tile_btns.first.click()

        # Take screenshot after clicking
        page.wait_for_timeout(1000) # brief wait for accordion animation/render
        page.screenshot(path="dashboard_after_click.png")
        print("Done! Screenshots saved.")
    else:
        print("Could not find red pulsing button")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
