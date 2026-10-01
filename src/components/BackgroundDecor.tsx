function CameraIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

interface Item {
  type: 'logo' | 'camera'
  top: string
  left?: string
  right?: string
  bottom?: string
  size: number
  opacity: number
  anim: 'bg-decor-a' | 'bg-decor-b' | 'bg-decor-c'
  color?: string
  duration: string
}

const items: Item[] = [
  { type: 'logo',   top: '6%',  left: '5%',   size: 70, opacity: 0.10, anim: 'bg-decor-a', duration: '7s' },
  { type: 'camera', top: '12%', right: '8%',  size: 44, opacity: 0.18, anim: 'bg-decor-b', duration: '9s', color: '#93C5FD' },
  { type: 'camera', top: '22%', left: '18%',  size: 30, opacity: 0.14, anim: 'bg-decor-c', duration: '8s', color: '#C4B5FD' },
  { type: 'logo',   top: '28%', right: '22%', size: 48, opacity: 0.08, anim: 'bg-decor-b', duration: '10s' },
  { type: 'camera', top: '38%', left: '6%',   size: 36, opacity: 0.16, anim: 'bg-decor-a', duration: '8.5s', color: '#93C5FD' },
  { type: 'logo',   top: '42%', right: '6%',  size: 60, opacity: 0.09, anim: 'bg-decor-c', duration: '9.5s' },
  { type: 'camera', top: '55%', left: '42%',  size: 26, opacity: 0.13, anim: 'bg-decor-a', duration: '7.5s', color: '#C4B5FD' },
  { type: 'camera', top: '60%', right: '16%', size: 40, opacity: 0.17, anim: 'bg-decor-b', duration: '8s', color: '#93C5FD' },
  { type: 'logo',   top: '68%', left: '10%',  size: 54, opacity: 0.09, anim: 'bg-decor-c', duration: '9s' },
  { type: 'camera', top: '74%', right: '34%', size: 30, opacity: 0.15, anim: 'bg-decor-a', duration: '8.2s', color: '#C4B5FD' },
  { type: 'logo',   bottom: '8%', right: '10%', size: 58, opacity: 0.10, anim: 'bg-decor-b', duration: '10.5s', top: 'auto' },
  { type: 'camera', bottom: '12%', left: '22%', size: 34, opacity: 0.16, anim: 'bg-decor-c', duration: '7.8s', color: '#93C5FD', top: 'auto' },
  { type: 'camera', bottom: '20%', left: '48%', size: 24, opacity: 0.12, anim: 'bg-decor-b', duration: '9.2s', color: '#C4B5FD', top: 'auto' },
  { type: 'logo',   bottom: '4%',  left: '4%',  size: 44, opacity: 0.08, anim: 'bg-decor-a', duration: '8.7s', top: 'auto' },
]

function BackgroundDecor() {
  return (
    <div style={styles.wrapper} aria-hidden="true">
      <style>{`
        @keyframes floatA { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-22px) rotate(6deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(-5deg); } }
        @keyframes floatC { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(4deg); } }
        .bg-decor-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .bg-decor-a { animation-name: floatA; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .bg-decor-b { animation-name: floatB; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .bg-decor-c { animation-name: floatC; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      `}</style>

      <div className="bg-decor-grid" />

      {items.map((item, i) =>
        item.type === 'logo' ? (
          <img
            key={i}
            src="/logo.png"
            alt=""
            className={item.anim}
            style={{
              ...styles.item,
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              width: `${item.size}px`,
              opacity: item.opacity,
              animationDuration: item.duration,
            }}
          />
        ) : (
          <CameraIcon
            key={i}
            className={item.anim}
            style={{
              ...styles.item,
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              width: `${item.size}px`,
              opacity: item.opacity,
              color: item.color,
              animationDuration: item.duration,
            }}
          />
        )
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  item: {
    position: 'absolute',
  },
}

export default BackgroundDecor
