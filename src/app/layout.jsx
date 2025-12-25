import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"], // можно добавить "latin-ext", "cyrillic-ext" и т.д.
  weight: ["400", "500", "600", "700"], // нужные начертания
  display: "swap", // чтобы текст сразу показывался системным шрифтом
});

export const metadata = {
  title: "",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
