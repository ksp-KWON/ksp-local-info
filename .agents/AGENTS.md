# Rules for UI Design

## Link Styling Rule
All HTML `<a>` tags and Markdown links (`[text](url)`) inside body/content MUST be styled as simple inline blue text with underlines, mimicking standard web links (exactly as in the reference screenshot). Do NOT use blocky buttons or box styles for inline text links.

When rendering or generating links, ALWAYS use the following classes (or similar variations):
```tsx
className="text-[#1A73E8] dark:text-[#8ab4f8] hover:text-[#1557b0] dark:hover:text-[#aecbfa] font-bold underline underline-offset-4 decoration-[#1A73E8]/35 hover:decoration-[#1A73E8] transition-all duration-150 inline"
```
Never wrap inline links with `group` buttons or `bg-` utilities unless explicitly asked to create a call-to-action button.
