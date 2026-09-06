export default {
  content: ['./index.html', './client/src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        cs: {
          primary: '#DE9B35',
          secondary: '#1B2838',
          danger: '#FF4444',
          health: '#4CAF50',
          armor: '#2196F3',
          ct: '#5D7AA0',
          t: '#C8A85C',
          money: '#4CAF50',
        },
      },
      fontFamily: {
        game: ['"Rajdhani"', 'sans-serif'],
        hud: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};