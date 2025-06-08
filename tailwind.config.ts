import type { Config } from "tailwindcss";

const config: Config = {
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
    darkMode:"class",
};

// daisyui 설정을 별도로 추가
(config as any).daisyui = {
    themes: ["dark"],
    darkTheme: "dark",
};

export default config;
