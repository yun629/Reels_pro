import type { Config } from "tailwindcss";

export default {
    content:[
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",     
    ],
    theme:{
        extend:{
            colors:{
                background:"var(--background)",
                foreground:"var(--foreground)",
            },
        },
    },
    plugins:[
        require("daisyui")
    ],
    daisyui: {
        themes: ["dark"],
        darkTheme: "dark",
    },
    darkMode:"class",
} satisfies Config;
