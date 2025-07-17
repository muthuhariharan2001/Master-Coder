import "./globals.css";

export const metadata = {
  title: "Hariharan's Code Editor",
  description: "Created for the Next.js 14 Hariharan",
  keywords: "code editor, online compiler, code execution, programming, coding, nextjs",
  authors: [
    {
      name: "Hariharan",
      url: "https://muthu-hariharan.netlify.app/",
    },
  ],
  creator: "Hariharan",
  openGraph: {
    title: "Hariharan's Code Editor",
    description: "Created for the Next.js 14 Hariharan",
    url: "https://master-coder.vercel.app",
    siteName: "Hariharan's Code Editor",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
