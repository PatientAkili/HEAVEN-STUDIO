function WhatsAppButton() {
  const message = encodeURIComponent("Bonjour, je suis intéressé(e) par vos services de photographie.")
  return (
    <a
      href={`https://wa.me/243971862571?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      style={styles.button}
    >
      <style>{`
        .wa-float-btn {
          animation: waPulse 2.5s ease-in-out infinite;
        }
        .wa-float-btn:hover {
          transform: scale(1.08);
        }
        @keyframes waPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
          50% { box-shadow: 0 4px 28px rgba(37, 211, 102, 0.7); }
        }
      `}</style>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.15L2 22l5.09-1.53a9.9 9.9 0 0 0 4.95 1.31h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.68 2 12.04 2Zm5.79 14.12c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.13.07-1.83-.11-.42-.11-.96-.3-1.66-.6-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.2-1.6-1.2-3.05 0-1.46.76-2.17 1.03-2.47.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.07.92 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.28 1.67 2.08 1.15 1.02 2.11 1.34 2.41 1.5.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.72-.17 1.4Z"/>
      </svg>
    </a>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    backgroundColor: '#25D366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    transition: 'transform 0.2s ease',
  },
}

export default WhatsAppButton
