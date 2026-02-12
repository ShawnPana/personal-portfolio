#!/usr/bin/env python3
"""
Run 3 browser-use agents in parallel to test each navbar tab.
Uses browser-use with local chromium browser in headless mode.
"""

import asyncio
import os
from browser_use import Agent
from browser_use.browser.browser import Browser, BrowserConfig

TUNNEL_URL = "https://continually-bonus-considered-von.trycloudflare.com"

# Tasks for each agent - testing each navbar route
AGENT_TASKS = [
    {
        "name": "Agent 1 - Main Page",
        "start_url": f"{TUNNEL_URL}/",
        "task": """Navigate to the main page and verify it's working correctly. 
        Look for: Shawn Pana heading, About Me section, Contact Me section, Projects section, and Skills section.
        Report what you find on the page."""
    },
    {
        "name": "Agent 2 - Home Page", 
        "start_url": f"{TUNNEL_URL}/Home",
        "task": """Navigate to the /Home page and verify it's working correctly.
        Describe what you see on this page and report any interactive elements."""
    },
    {
        "name": "Agent 3 - Tree Page",
        "start_url": f"{TUNNEL_URL}/tree",
        "task": """Navigate to the /tree page and verify it's working correctly.
        Describe what you see on this page and report any visual or interactive elements."""
    }
]


async def run_agent(task_config: dict, agent_id: int):
    """Run a single browser-use agent."""
    print(f"\n{'='*60}")
    print(f"🚀 Starting {task_config['name']}")
    print(f"🌐 URL: {task_config['start_url']}")
    print(f"{'='*60}")
    
    try:
        # Configure browser for headless mode
        browser_config = BrowserConfig(
            headless=True,
            disable_security=True,
        )
        
        browser = Browser(config=browser_config)
        
        # Create the agent
        agent = Agent(
            task=task_config['task'],
            browser=browser,
            max_actions_per_step=5,
        )
        
        # Run the agent (with limited steps for testing)
        result = await agent.run(max_steps=10)
        
        print(f"\n✅ {task_config['name']} completed!")
        print(f"📋 Result: {result}")
        
        await browser.close()
        
        return {
            "name": task_config['name'],
            "success": True,
            "result": str(result)
        }
        
    except Exception as e:
        print(f"\n❌ {task_config['name']} failed: {e}")
        return {
            "name": task_config['name'],
            "success": False,
            "error": str(e)
        }


async def main():
    """Run all 3 agents in parallel."""
    print("🚀 Starting 3 Browser-Use Agents to test navbar tabs")
    print(f"🌐 Tunnel URL: {TUNNEL_URL}")
    print(f"📊 Running {len(AGENT_TASKS)} agents in parallel")
    
    # Create tasks for all agents
    tasks = [
        run_agent(task_config, idx)
        for idx, task_config in enumerate(AGENT_TASKS)
    ]
    
    # Run all agents in parallel
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Summary
    print("\n" + "="*60)
    print("📊 AGENT SUMMARY")
    print("="*60)
    
    for result in results:
        if isinstance(result, Exception):
            print(f"  ❌ Agent failed with exception: {result}")
        elif result.get("success"):
            print(f"  ✅ {result['name']}: PASS")
        else:
            print(f"  ❌ {result['name']}: FAIL - {result.get('error', 'Unknown error')}")
    
    successes = sum(1 for r in results if isinstance(r, dict) and r.get("success"))
    print(f"\n🎯 {successes}/{len(AGENT_TASKS)} agents completed successfully")
    
    return 0 if successes == len(AGENT_TASKS) else 1


if __name__ == "__main__":
    import sys
    sys.exit(asyncio.run(main()))
