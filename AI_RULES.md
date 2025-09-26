# AI Rules for FinanceTracker Project

This document outlines the core technologies used in the FinanceTracker project and provides clear guidelines on which libraries to use for specific functionalities.

## Tech Stack Description

*   **Vite**: A fast build tool that provides an instant development server and optimized builds for production.
*   **TypeScript**: A superset of JavaScript that adds static typing, enhancing code quality and maintainability.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **React Router**: A standard library for routing in React applications, enabling navigation between different views.
*   **@tanstack/react-query**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **Lucide React**: A library providing a collection of customizable and tree-shakable SVG icons.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and real-time subscriptions (used for backend integration).

## Library Usage Rules

To maintain consistency, efficiency, and best practices, please adhere to the following guidelines when developing:

*   **UI Components (shadcn/ui)**:
    *   Always prioritize using components from `shadcn/ui` for standard UI elements (buttons, cards, forms, dialogs, etc.).
    *   If a `shadcn/ui` component needs significant modification, create a new component that wraps or extends it, rather than directly editing the `shadcn/ui` source files.
*   **Styling (Tailwind CSS)**:
    *   All styling should be done using Tailwind CSS utility classes. Avoid writing custom CSS unless it's for global styles defined in `src/index.css`.
    *   Ensure designs are responsive by utilizing Tailwind's responsive utility classes.
*   **State Management & Data Fetching (@tanstack/react-query)**:
    *   For all asynchronous data operations (fetching, mutations, caching), use `@tanstack/react-query`.
    *   Local component state should be managed with React's `useState` and `useReducer` hooks.
*   **Routing (React Router)**:
    *   Use `react-router-dom` for all client-side navigation.
    *   Define main application routes within `src/App.tsx`.
*   **Icons (lucide-react)**:
    *   All icons used throughout the application should come from the `lucide-react` library.
*   **Backend Integration (Supabase)**:
    *   For any features requiring authentication, database interaction, or server-side logic, integrate with Supabase. The client is available at `src/integrations/supabase/client.ts`.
*   **File Structure**:
    *   Place main application pages in `src/pages/`.
    *   Store reusable UI components in `src/components/`.
    *   Custom React hooks should reside in `src/hooks/`.
    *   Data services (e.g., API calls, local storage interactions) belong in `src/services/`.
    *   General utility functions should be placed in `src/utils/`.
*   **TypeScript**:
    *   Always use TypeScript for new files and when modifying existing ones. Ensure proper typing for props, state, and function arguments/return values.
*   **Error Handling**:
    *   Do not use `try/catch` blocks for errors unless specifically requested. Allow errors to bubble up for centralized handling and debugging.
*   **Simplicity**:
    *   Prioritize simple and elegant solutions. Avoid over-engineering with complex patterns unless the requirements explicitly demand them.