/**
 * The full screen loader is switched off.
 *
 * It previously carried a `return null` above its markup, so the JSX, the state
 * and the timer below it never ran but still shipped on every page. The intent
 * is preserved here as a deliberate no-op rather than dead code.
 *
 * To bring it back, restore this file from git and remove the early return —
 * the markup and `style.css` are still in history.
 */
function FullScreenAnimatedLoader() {
    return null;
}

export default FullScreenAnimatedLoader;
