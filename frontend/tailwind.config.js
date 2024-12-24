/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/*.{js,ts,jsx,tsx}",
        "./pages/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./page-section/**/*.{js,ts,jsx,tsx}",
      ],
    theme: {
        extend: {
            width: {
                "sidebar": "300px"
            },
            colors: {
                light: '#f9fafb', // text-gray-50
                medium: {
                    light: '#9ca3af', // text-gray-400
                    dark: '#4b5563', // text-gray-400
                },
                dark: '#111827', // text-gray-900

                primary: {
                    main: '#6366f1',
                    hover: '#818cf8',
                },
                red: {
                    light: '#f87171',
                    dark: '#991b1b',
                },
            },
        },
    },
    plugins: [],
}

