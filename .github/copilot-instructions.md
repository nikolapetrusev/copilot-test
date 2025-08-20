# Pharaoh's Fortune - Egyptian Slot Machine Game

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Repository Setup and Running
- This is a pure HTML5/CSS3/JavaScript web application with NO build process, dependencies, or backend required.
- Start the HTTP server: `cd /home/runner/work/copilot-test/copilot-test && python3 -m http.server 8000`
  - NEVER CANCEL: Server starts immediately (< 1 second). Set timeout to 30+ seconds for safety.
  - Alternative: `php -S localhost:8000 -t .` (also works, immediate startup)
- Access the application at: `http://localhost:8000`
- The application loads immediately (< 1 second) with no build step required.

### File Structure
```
copilot-test/
├── index.html          # Main HTML file with game UI
├── script.js           # Game logic (418 lines)
├── style.css           # Styling with night/day themes (401 lines)
├── README.md           # Minimal project description
└── .github/
    └── copilot-instructions.md
```

### Validation and Testing
- Validate JavaScript syntax: `node -c script.js` (immediate, < 1 second)
- ALWAYS test the complete user workflow after making changes:
  1. Start HTTP server
  2. Navigate to http://localhost:8000
  3. Verify initial state: 1000 gold coins displayed
  4. Click SPIN button (-10 coins cost)
  5. Wait for spin animation completion (~2-3 seconds, NEVER CANCEL)
  6. Verify coin count updates correctly
  7. Test theme toggle button (🌙/☀️)
  8. Test responsive design by resizing browser to mobile view (375x667)

### Manual Validation Requirements
- ALWAYS run through complete user scenarios after making changes.
- Test both desktop and mobile viewports.
- Verify all interactive elements: SPIN button, theme toggle, visual animations.
- Check that win/loss calculations work correctly.
- Ensure no JavaScript console errors occur.

## Application Architecture

### Core Components
- **EgyptianSlotMachine class** (script.js): Main game engine
- **Canvas-based slot reels**: 3 reels with Egyptian symbols
- **Symbol values**: 🔱(500), 👁️(300), 🐍(200), 🏺(150), ⚱️(100), 💎(80), 🪙(50)
- **Paylines**: 3 horizontal lines for win detection
- **Theme system**: Night/day mode toggle

### Key Functions to Understand
- `spin()`: Initiates slot machine spin animation
- `checkWin()`: Calculates payouts and updates coin count  
- `updateCoinDisplay()`: Updates the UI coin counter
- `setupEventListeners()`: Handles button clicks and interactions
- `draw()`: Canvas rendering for slot reels

### Game Mechanics
- Starting coins: 1000
- Bet per spin: 10 coins
- Three of a kind: Symbol value payout
- Two of a kind: 20 coins
- Spin duration: ~2-3 seconds with staggered reel stops

## Common Development Tasks

### Making UI Changes
- Edit `index.html` for structure changes
- Edit `style.css` for styling (includes night mode in body.night-mode selector)
- Test both light and dark themes after changes
- Verify responsive behavior on mobile

### Modifying Game Logic
- Edit `script.js` for game mechanics
- Always test win/loss scenarios after logic changes
- Verify coin calculations are accurate
- Test edge cases: running out of coins, maximum wins

### Adding New Features
- Follow existing code patterns in the EgyptianSlotMachine class
- Maintain canvas-based rendering approach
- Preserve responsive design principles
- Test new features in both themes

## Timing and Performance
- NEVER CANCEL: HTTP server startup is immediate but allow 30+ second timeout
- Application load: immediate (< 1 second)
- Spin animation: 2-3 seconds (NEVER CANCEL, this is normal game timing)
- Syntax validation: immediate with `node -c script.js`
- NO build processes exist - changes take effect immediately on page refresh

## Troubleshooting

### Common Issues
- **Blank screen**: Usually missing HTTP server - files cannot be opened directly in browser due to CORS
- **Symbols not appearing**: Canvas context issues - check browser console for errors
- **Theme not switching**: CSS class toggle not working - verify JavaScript execution
- **Coins not updating**: Game logic error - check console for JavaScript errors

### Browser Compatibility
- Requires modern browser with Canvas and ES6 support
- Tested working in Chrome/Firefox/Safari
- Mobile responsive design included
- No external dependencies or CDN requirements

## File Contents Reference

### index.html Structure
- Game container with header (title, coin display, theme toggle)
- Slot machine canvas (600x400px)
- Paytable showing all symbol values
- Control buttons (SPIN)
- Win message display area

### script.js Key Classes
- `EgyptianSlotMachine`: Main game class with all functionality
- Canvas rendering methods for slot reels
- Game logic for wins, losses, animations
- Event handling for user interactions

### style.css Features
- Egyptian theme with gold/brown color scheme
- Night mode styles (body.night-mode)
- Responsive design with mobile breakpoints
- Canvas styling and overlay elements
- Animation keyframes for spins and wins

## Development Workflow
1. Start HTTP server: `python3 -m http.server 8000`
2. Make changes to HTML/CSS/JS files
3. Refresh browser to see changes (no build needed)
4. Test complete user workflow
5. Validate JavaScript syntax: `node -c script.js`
6. Test responsive design in mobile viewport
7. Verify both light and dark themes work

Always validate that every change works correctly through manual testing before considering the work complete.