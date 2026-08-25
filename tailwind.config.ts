import type { Config } from "tailwindcss";

const config: Config = {
  // src 전체를 스캔한다. features/ 등 하위 폴더가 누락되면
  // 그 안에서만 쓰는 클래스가 CSS 로 생성되지 않는다.
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
