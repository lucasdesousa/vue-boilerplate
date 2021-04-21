module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-text": "var(--primary-text-color)",
        secondary: "var(--secondary-color)",
        "secondary-text": "var(--secondary-text-color)",
        neutral: "var(--neutral-color)",
        link: "var(--link-color)",
        content: "var(--content-background-color)",
        heading: "var(--heading-background-color)",
        navbar: "var(--navbar-background-color)",
        sidebar: "var(--sidebar-background-color)"
      }
    }
  },
  variants: {
    extend: {
      textColor: ["active"]
    }
  },
  plugins: []
};
