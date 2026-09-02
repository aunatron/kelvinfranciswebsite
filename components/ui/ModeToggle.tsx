/**
 * Mode toggle — plain markup, wired by the tiny inline script in layout.
 * No hydration: the framework runtime is stripped at postbuild, so all
 * interactivity on this site is native JS within the 30KB budget.
 */
export default function ModeToggle() {
  return (
    <div className="mode-toggle" role="group" aria-label="Mode">
      <button type="button" className="on" data-mode="francis" aria-pressed="true">
        Francis
      </button>
      <button type="button" data-mode="hunter" aria-pressed="false">
        Hunter
      </button>
    </div>
  );
}
