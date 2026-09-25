function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.socials}>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink} aria-label="Google">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"/>
          </svg>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink} aria-label="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 9H15V6.5h-1.5C11.57 6.5 10 8.07 10 10v2H8v3h2v6.5h3V15h2.1l.4-3H13v-1.5c0-.55.45-1.5 1-1.5Z"/>
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink} aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.94.01 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1 0-2.34 1.17 1.17 0 0 1 0 2.34Z"/>
          </svg>
        </a>
        <a href="https://wa.me/0000000000" target="_blank" rel="+243 971 862 571" style={styles.iconLink} aria-label="WhatsApp">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.15L2 22l5.09-1.53a9.9 9.9 0 0 0 4.95 1.31h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.68 2 12.04 2Zm5.79 14.12c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.13.07-1.83-.11-.42-.11-.96-.3-1.66-.6-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.2-1.6-1.2-3.05 0-1.46.76-2.17 1.03-2.47.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.07.92 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.28 1.67 2.08 1.15 1.02 2.11 1.34 2.41 1.5.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.72-.17 1.4Z"/>
          </svg>
        </a>
      </div>

      <p style={styles.copy}>© {new Date().getFullYear()} HEAVEN ROYAL STUDIO PROD</p>
    </footer>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    borderTop: '1px solid rgba(148, 163, 184, 0.15)',
    padding: '0.9rem 1rem 0.75rem',
    textAlign: 'center',
    marginTop: 'auto',
  },
  socials: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem',
    marginBottom: '0.4rem',
  },
  iconLink: {
    color: '#94A3B8',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    transition: 'color 0.2s ease, border-color 0.2s ease',
  },
  copy: {
    color: '#64748B',
    fontSize: '0.7rem',
    margin: 0,
  },
}

export default Footer
