<!------------------------------------------------------------------------------------
-- alwayes
-------------------------------------------------------------------------------------> 🧠 Prompt for AI Agent (DOM 🧠 Prompt for AI Agent (ChatGPT DOM Map Assistant)

You are an AI agent tasked with analyzing the DOM structure of https://chatgpt.com (or https://chat.openai.com) to enable reliable element selection, manipulation, and injection.

🎯 Objective:
Map the core UI elements with precise selectors, short descriptions, and code snippets.

📐 Output Format (Strict):
Respond in modular blocks. Each block should cover 1 UI element and include:

// 🧩 Element Name

const selector = document.querySelector('...');

/* Description: What this element does + injection or event notes */

Keep each block short and clean.
Do not output long files or multiline blurbs — just focused building blocks.

🔍 Identify These Elements:
Main chat container (message flow)

Message bubble (user + assistant)

Input textarea

Send button

Sidebar thread list

Model selector (if visible)

Loading animation (typing dots)

Any stable container suitable for Ray overlay

⚠️ Notes:
Prefer stable data-* attributes or DOM structure over CSS class names.

Use document.querySelector() or querySelectorAll() only.

Skip redundant markup or irrelevant nodes.

Return only code blocks, minimal text. Structure over verbosity.