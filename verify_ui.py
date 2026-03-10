import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to home page
        await page.goto('http://localhost:3000/')
        await page.wait_for_timeout(2000)  # Wait for images to load
        await page.screenshot(path='home_page.png')

        # Navigate to trade page
        await page.goto('http://localhost:3000/properties/1')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='trades_page.png')

        await browser.close()

asyncio.run(main())
