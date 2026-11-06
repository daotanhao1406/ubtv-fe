# Repository instructions

<!-- CODEGRAPH_START -->

## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.

<!-- CODEGRAPH_END -->

## Frontend: no abort signals

- Never use `AbortSignal` or `AbortController` in project-owned frontend code anywhere in this repository.
- Do not add, accept, or forward cancellation signals in HTTP clients, API functions, hooks, components, or event listeners.
- When an async result is outdated, let the request finish and ignore its result using a simple state or version check instead of aborting it.

## Frontend: UI testing

- Do not add or update automated tests for UI `.tsx` files, including pages, layouts, forms, and components, unless the user explicitly requests those tests.
- Verify UI changes with typecheck, lint, build, or browser checks as appropriate. Keep automated tests focused on non-UI logic when needed.

## Frontend: minimize refs

- Avoid `ref` and `useRef` wherever possible when writing frontend code. Do not introduce them by default.
- Prefer simple state, props, event handlers, and declarative React APIs when they can express the same behavior.
- Use refs only when necessary and no straightforward declarative alternative exists. Keep their usage minimal and explain the specific need.

## Frontend: prefer arrow functions

- Prefer `const Component = () => {}` and `const helper = () => {}` over ordinary function declarations for frontend components, hooks, and helpers.
- Use async arrow functions and arrow-function properties in plain objects where applicable. Keep other function syntax only when required by its behavior or the language, such as class constructors.

## Frontend: reusable components receive props

- Read and normalize URL query parameters and route parameters in the page or parent container, then pass the required values to reusable components through explicit, typed props.
- Do not duplicate the parent's URL parsing inside child components. Keep reusable forms and components independent of a particular page's URL structure.

## Frontend: HeroUI and UI/UX first

- Think through the UI/UX before adding or changing an interface: user intent, clear actions, accessibility, and loading, error, and success feedback. Preserve the existing visual style unless a redesign is requested.
- Prefer components from `@heroui/react` for interface elements. Minimize direct use of native HTML elements such as `button`, `form`, `p`, and `div` when a suitable HeroUI component exists.
- Use native HTML where needed for semantics or simple layout without a suitable HeroUI equivalent; do not add unnecessary components or wrappers just to replace an HTML tag.
