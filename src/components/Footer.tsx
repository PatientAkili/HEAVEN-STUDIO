function Footer() {
  return (
    <>
      <style>{`
        @media (max-width: 720px) {
          .site-footer {
            padding-bottom: 7rem !important;
          }
        }
      `}</style>
    <footer className="site-footer" style={styles.footer}>
      <div style={styles.socials}>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer" style={{ ...styles.iconLink, borderColor: 'rgba(66,133,244,0.4)' }} aria-label="Google">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/share/1DHaiJJKJk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ ...styles.iconLink, borderColor: 'rgba(24,119,242,0.4)' }} aria-label="Facebook">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M13.5 9H15V6.5h-1.5C11.57 6.5 10 8.07 10 10v2H8v3h2v6.5h3V15h2.1l.4-3H13v-1.5c0-.55.45-1.5 1-1.5Z"/>
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ ...styles.iconLink, borderColor: 'rgba(221,42,123,0.4)' }} aria-label="Instagram">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEE411" />
                <stop offset="25%" stopColor="#FD5949" />
                <stop offset="50%" stopColor="#D6249F" />
                <stop offset="100%" stopColor="#285AEB" />
              </linearGradient>
            </defs>
            <path fill="url(#igGradient)" d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.94.01 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1 0-2.34 1.17 1.17 0 0 1 0 2.34Z"/>
          </svg>
        </a>
        <a href="https://wa.me/243971862571" target="_blank" rel="noopener noreferrer" style={{ ...styles.iconLink, borderColor: 'rgba(37,211,102,0.4)' }} aria-label="WhatsApp">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.15L2 22l5.09-1.53a9.9 9.9 0 0 0 4.95 1.31h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.68 2 12.04 2Zm5.79 14.12c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.13.07-1.83-.11-.42-.11-.96-.3-1.66-.6-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.2-1.6-1.2-3.05 0-1.46.76-2.17 1.03-2.47.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.07.92 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.28 1.67 2.08 1.15 1.02 2.11 1.34 2.41 1.5.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.72-.17 1.4Z"/>
          </svg>
        </a>
      </div>

      <p style={styles.copy}>© {new Date().getFullYear()} HEAVEN ROYAL STUDIO PROD</p>
      <p style={styles.legalLinks}>
        <a href="/mentions-legales" style={styles.legalLink}>Mentions légales</a>
        {' · '}
        <a href="/confidentialite" style={styles.legalLink}>Confidentialité</a>
      </p>
    </footer>
    </>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    borderTop: '1px solid rgba(148, 163, 184, 0.15)',
    padding: '1.1rem 1rem 0.9rem',
    textAlign: 'center',
    marginTop: 'auto',
  },
  socials: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.9rem',
    marginBottom: '0.5rem',
  },
  iconLink: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  legalLinks: {
    margin: '0.4rem 0 0 0',
    fontSize: '0.7rem',
  },
  legalLink: {
    color: '#64748B',
    textDecoration: 'underline',
  },
  copy: {
    color: '#64748B',
    fontSize: '0.7rem',
    margin: 0,
  },
}

export default Footer
