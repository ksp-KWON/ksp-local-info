# Rules for UI Design

## Link Styling Rule
All HTML `<a>` tags and Markdown links (`[text](url)`) MUST be styled as Neo-brutalism boxes (buttons), not as inline blue text.
When rendering or generating links, ALWAYS use the following classes (or similar variations):
```tsx
className="group relative inline-flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 text-white font-bold text-sm sm:text-base border-2 border-black dark:border-white shadow-marker-yellow hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-marker-yellow transition-all mx-1 my-1 no-underline"
```
Do NOT use simple underlines or basic blue text for links.
