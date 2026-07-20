# Santeri Rantanen - Engineering Portfolio

A high-end, quantum-themed portfolio website showcasing mechanical engineering case studies, interactive 3D WebGL models, professional photography, and an interactive skills radar chart.

## 🚀 Features

*   **Interactive 3D WebGL Models:** 
    *   A conceptual dilution refrigerator mixing chamber flange built with Three.js.
    *   A 6-axis industrial robotic arm with hierarchical joint kinematics and touch-enabled drag controls.
*   **Dynamic Data Visualization:** An interactive Chart.js Radar Chart mapping out engineering proficiencies across CAD, FEM, Cryogenics, and Robotics.
*   **Quantum Aesthetics:** Custom CSS glitch animations (like the 404 page), animated quantum measurement ripples, and a custom geometric cursor.
*   **Chronological Case Studies:** A responsive vertical timeline tracking engineering projects across Bluefors, Metso, Oceanvolt, K. Hartwall, and more.
*   **Responsive Design:** Fully mobile-optimized with CSS media queries and native touch-action support for the 3D canvases.
*   **Photography Gallery:** A grid-based gallery featuring a custom-built JavaScript lightbox overlay.

## 🛠️ Technology Stack

*   **Frontend Structure:** HTML5
*   **Styling:** Vanilla CSS (CSS Variables, Flexbox, CSS Grid, Keyframe Animations)
*   **Interactivity:** Vanilla JavaScript (ES6+)
*   **3D Rendering:** [Three.js](https://threejs.org/) (r128)
*   **Data Visualization:** [Chart.js](https://www.chartjs.org/)

## 📂 Project Structure

```text
├── index.html          # Main landing page (Experience, Skills Chart, 3D Dilution Fridge)
├── projects.html       # Case studies timeline layout
├── robotics.html       # 3D Industrial Robotic Arm showcase
├── photography.html    # Photography gallery with lightbox
├── 404.html            # Custom glitch error page
├── style.css           # Global CSS variables, animations, and responsive media queries
├── script.js           # Core JS (Chart.js init, Custom Cursor, Lightbox, 3D Fridge)
├── robotics-3d.js      # Three.js logic specifically for the 6-Axis Robot Arm
└── images/             # All static assets, icons, and gallery photos
```

## 🌐 Running Locally

To run this project locally and ensure the 3D models load without CORS issues, you must serve the files via a local HTTP server.

**Option 1: Using Node.js / npx**
```bash
npx serve .
```

**Option 2: Using Python**
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

## 👤 About

Santeri Rantanen is a Finnish mechanical engineer with a versatile career spanning heavy industrial machinery, precision medical devices, and cutting-edge quantum technology. Currently working at Bluefors on cryogenic measurement infrastructure.
