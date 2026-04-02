/**
 * Loader — replaces all spinner usages across the site.
 *
 * Variants:
 *   <PageLoader />           — full-height centred page loading state
 *   <PageLoader light />     — same but for dark backgrounds
 *   <ButtonLoader />         — 3 tiny dots for inside buttons (white)
 *   <ButtonLoader dark />    — same but dark dots
 *   <InlineLoader />         — small dots for inline contexts (maps, dropdowns)
 */

const KEYFRAMES = `
@keyframes ld {
  0%, 80%, 100% { transform: scale(0.55); opacity: 0.35; }
  40%            { transform: scale(1);    opacity: 1;    }
}
`

const Dot = ({ delay, size = 8, color = 'currentColor' }) => (
  <span
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      animation: 'ld 1.2s ease-in-out infinite',
      animationDelay: delay,
    }}
  />
)

// ── Page-level loader ────────────────────────────────────────────────────────
export const PageLoader = ({ light = false, label }) => (
  <>
    <style>{KEYFRAMES}</style>
    <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: '30vh' }}>
      <div className="flex items-center gap-2">
        <Dot delay="0ms"    size={10} color={light ? 'rgba(255,255,255,0.8)' : '#171717'} />
        <Dot delay="160ms"  size={10} color={light ? 'rgba(255,255,255,0.8)' : '#171717'} />
        <Dot delay="320ms"  size={10} color={light ? 'rgba(255,255,255,0.8)' : '#171717'} />
      </div>
      {label && (
        <p className={`text-xs font-medium tracking-[0.15em] uppercase ${light ? 'text-white/60' : 'text-neutral-400'}`}>
          {label}
        </p>
      )}
    </div>
  </>
)

// ── Button loader (3 tiny dots) ──────────────────────────────────────────────
export const ButtonLoader = ({ dark = false }) => (
  <>
    <style>{KEYFRAMES}</style>
    <span className="flex items-center gap-1">
      <Dot delay="0ms"   size={5} color={dark ? '#171717' : '#fff'} />
      <Dot delay="150ms" size={5} color={dark ? '#171717' : '#fff'} />
      <Dot delay="300ms" size={5} color={dark ? '#171717' : '#fff'} />
    </span>
  </>
)

// ── Inline / utility loader ──────────────────────────────────────────────────
export const InlineLoader = ({ color = '#171717' }) => (
  <>
    <style>{KEYFRAMES}</style>
    <span className="flex items-center gap-1">
      <Dot delay="0ms"   size={6} color={color} />
      <Dot delay="160ms" size={6} color={color} />
      <Dot delay="320ms" size={6} color={color} />
    </span>
  </>
)

export default PageLoader
