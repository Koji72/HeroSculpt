# 3D Character Customizer

This document provides a complete overview of the 3D Character Customizer application, detailing its current architecture, features, and conventions. This is the single source of truth for understanding the project.

## 1. Project Overview

The application is a web-based 3D character customizer that allows users to build a superhero character by selecting different body parts. It is built with React, TypeScript, and Three.js.

The project has been simplified to focus on a single "STRONG" archetype, with a streamlined set of customizable parts.

## 2. Core Features

- **3D Character Viewer**: An interactive 3D viewer renders the character using Three.js.
- **Part Selection**: A side panel allows users to select and apply different parts to the character.
- **Dynamic Model Loading**: The application dynamically loads and renders `.glb` 3D models for each selected part.
- **Adaptive Hand Selection**: When changing torso, the system intelligently maintains hand selections when compatible.

## 3. Technical Architecture

| Layer           | Stack                             | Notes                                   |
| --------------- | --------------------------------- | --------------------------------------- |
| **Frontend UI** | React 18, TypeScript, TailwindCSS | For building the user interface.        |
| **3D Engine**   | Three.js, @react-three/fiber      | For rendering the 3D character.         |
| **State Mgmt**  | React Hooks (`useState`)          | For managing application state locally. |
| **Build Tool**  | Vite                              | For fast development and bundling.      |

### Key Components

-   `App.tsx`: The main application component, managing global state.
-   `src/components/CharacterViewer.tsx`: The core 3D viewer component.
-   `src/components/PartSelectorPanel.tsx`: The UI for selecting parts.
-   `src/components/CurrentConfigPanel.tsx`: The UI for showing the current configuration.

## 4. Project Structure

The project follows a standard React application structure:

```
/
├── public/
│   ├── assets/
│   │   └── strong/      # Model files for the STRONG archetype
│   └── draco/           # Draco decoder for GLB compression
├── src/
│   ├── components/      # React components
│   ├── types/           # TypeScript type definitions
│   └── constants/       # Application constants
├── docs/
│   ├── README.md        # This documentation file
│   └── archive/         # Old, archived documentation
└── package.json
```

## 5. Model Naming Convention

All 3D models are in `.glb` format and follow a strict naming convention to ensure they are loaded correctly.

**Pattern:** `[archetype]_[category]_[variant].glb`

-   **`archetype`**: The character archetype. Currently, only `strong` is used.
-   **`category`**: The body part category (e.g., `torso`, `legs`, `boots`).
-   **`variant`**: A two-digit identifier for the specific model (e.g., `01`, `02`).

**Examples:**
-   `strong_torso_01.glb`
-   `strong_legs_01.glb`
-   `strong_boots_01.glb`

The models are located in the `public/assets/[archetype]/` directory.

## 6. How to Contribute

1.  **Set up the environment**:
    ```bash
    git clone <repository-url>
    cd 3dcustomicerdefinitivo
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Making Changes**:
    -   Create a new branch for your feature or bug fix.
    -   Follow the existing code style and conventions.
    -   Ensure any new models adhere to the naming convention.
    -   Update `src/constants/constants.ts` when adding new parts.

4.  **Submit a Pull Request**:
    -   Push your changes to your forked repository.
    -   Create a Pull Request against the `main` branch.
    -   Provide a clear description of the changes.

## 7. Troubleshooting

### Common Issues

**Limited Hand Selection**: If you encounter issues where only a few hands are displayed, see [Hands Complete Fix Documentation](solutions/hands-complete-fix.md) for details on the comprehensive solution that restored all 124 hand definitions.

**Hand Selection Not Working**: If you encounter issues where only a limited number of hands are displayed for certain torso types, see [Hands Filtering Issue Documentation](solutions/hands-filtering-issue.md) for a detailed explanation of the problem and solution.

**Hands Reset When Changing Torso**: If hands reset to default when changing torso selection, see [Hands-Torso Adaptive Selection](hands-torso-adaptive-selection.md) for details on the intelligent hand preservation system.

**Suit Torso Compatibility**: For information about the suit torso system and how suits relate to base torsos, see [Suit Torso Implementation](suit-torso-implementation.md).

**Key Points**:
- All GLB files with `t[XX]` in their names must have corresponding entries in `constants.ts`
- Each part definition must include correct `torsoType` and `compatible` arrays
- All variants should be included unless explicitly documented otherwise
- The hands system now includes 124 complete definitions covering all 5 torsos

---
*This document replaces all previous documentation. For historical context, see the files in the `docs/archive` directory.* 