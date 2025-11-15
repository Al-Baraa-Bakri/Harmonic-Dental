# Project Overview

This is a web project built with [Astro](https://astro.build/), a web framework for building fast, content-focused websites. It uses [React](https://react.dev/) for building user interfaces and [Tailwind CSS](https://tailwindcss.com/) for styling. The project also includes a 3D model viewer using [@google/model-viewer](https://modelviewer.dev/).

The project structure follows the standard Astro project layout:

- `src/pages`: Contains the pages of the website.
- `src/components`: Contains reusable React components.
- `src/layouts`: Contains layout components for pages.
- `src/styles`: Contains global styles.
- `public`: Contains static assets like images and fonts.

## Building and Running

To get started with this project, you need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start a development server at `http://localhost:4321`.

3.  **Build the project for production:**

    ```bash
    npm run build
    ```

    This will create a `dist` directory with the production-ready files.

4.  **Preview the production build:**

    ```bash
    npm run preview
    ```

## Development Conventions

- **Components:** React components are used for building the user interface. These components are located in the `src/components` directory.
- **Styling:** Tailwind CSS is used for styling. The configuration is in the `tailwind.config.mjs` file.
- **Type Checking:** The project uses TypeScript for type checking. You can run the type checker with the following command:

  ```bash
  npm run build
  ```
