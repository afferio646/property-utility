import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Test Desktop View
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # Navigate to home page
        await page.goto('http://localhost:3000/')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='home_page_desktop.png')

        # Navigate to trade page
        await page.goto('http://localhost:3000/properties/1')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='trades_page_desktop.png')

        # Test Mobile View (e.g. iPhone 13 dimensions)
        mobile_page = await browser.new_page(viewport={'width': 390, 'height': 844})

        # Navigate to home page
        await mobile_page.goto('http://localhost:3000/')
        await mobile_page.wait_for_timeout(2000)
        await mobile_page.screenshot(path='home_page_mobile.png')

        # Navigate to trade page
        await mobile_page.goto('http://localhost:3000/properties/1')
        await mobile_page.wait_for_timeout(2000)
        await mobile_page.screenshot(path='trades_page_mobile.png')

        await browser.close()

asyncio.run(main())
