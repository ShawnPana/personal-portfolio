#!/usr/bin/env python3
"""
Test script to verify each navbar tab of the personal portfolio site.
Uses Playwright with headless Chromium to test each route.
"""

import asyncio
from playwright.async_api import async_playwright
import sys

TUNNEL_URL = "https://continually-bonus-considered-von.trycloudflare.com"

ROUTES = [
    ("/", "Serious/Main page - Should show Shawn Pana portfolio with About Me, Contact, Projects, Skills"),
    ("/Home", "Home page"),
    ("/tree", "Tree page"),
]


async def test_route(page, route: str, description: str):
    """Test a single route and report what's found."""
    url = f"{TUNNEL_URL}{route}"
    print(f"\n{'='*60}")
    print(f"Testing: {route}")
    print(f"URL: {url}")
    print(f"Expected: {description}")
    print(f"{'='*60}")
    
    try:
        response = await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        
        if response:
            print(f"✅ Status: {response.status}")
        else:
            print("⚠️ No response received")
            return False
        
        # Wait for page to settle
        await asyncio.sleep(2)
        
        # Get page title
        title = await page.title()
        print(f"📄 Page Title: {title}")
        
        # Get all visible text headings
        headings = await page.locator("h1, h2, h3").all_text_contents()
        if headings:
            print(f"📋 Headings found: {headings[:5]}")  # First 5 headings
        
        # Get navigation links if any
        nav_links = await page.locator("nav a, .nav a, [class*='nav'] a").all_text_contents()
        if nav_links:
            print(f"🔗 Nav Links: {nav_links[:10]}")
        
        # Check for key elements on each page
        if route == "/":
            # Check for Shawn Pana name
            name_visible = await page.locator("text=Shawn Pana").count() > 0
            print(f"👤 'Shawn Pana' found: {name_visible}")
            
            # Check for sections
            about_visible = await page.locator("text=About").count() > 0
            print(f"📝 'About' section found: {about_visible}")
            
            projects_visible = await page.locator("text=Projects").count() > 0
            print(f"💼 'Projects' section found: {projects_visible}")
            
            skills_visible = await page.locator("text=Skills").count() > 0
            print(f"🛠️ 'Skills' section found: {skills_visible}")
        
        # Take a screenshot
        screenshot_path = f"/workspace/personal-portfolio/screenshot{route.replace('/', '_') or '_root'}.png"
        await page.screenshot(path=screenshot_path, full_page=False)
        print(f"📸 Screenshot saved: {screenshot_path}")
        
        print(f"✅ Route {route} tested successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing {route}: {e}")
        return False


async def main():
    """Run tests for all routes."""
    print("🚀 Starting Portfolio Website Tests")
    print(f"🌐 Tunnel URL: {TUNNEL_URL}")
    
    async with async_playwright() as p:
        # Launch headless browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        results = []
        for route, description in ROUTES:
            success = await test_route(page, route, description)
            results.append((route, success))
        
        await browser.close()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    for route, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {route}: {status}")
    
    all_passed = all(success for _, success in results)
    print(f"\n{'🎉 All tests passed!' if all_passed else '⚠️ Some tests failed.'}")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
