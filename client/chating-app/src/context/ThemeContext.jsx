import { createContext, useState } from "react";

// bikin context untuk theme
export const themeContext = createContext({ 
    currentTheme: '',
    setCurrentTheme: () => { },
    theme: {
        light: {
            bgColor: '',
            chatBg: '',
            asideBg: '',
            textColor: ''
        },
        dark: {
            bgColor: '',
            chatBg: '',
            asideBg: '',
            textColor: ''
        }
    }
});


export default function ThemeContext({ children }) {
    const [currentTheme, setCurrentTheme] = useState("light")

    return (
        <themeContext.Provider value={{
            currentTheme,
            setCurrentTheme,
            theme: {
                light: {
                    bgColor: 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100',
                    chatBg: 'from-white/90 to-purple-50/90',
                    asideBg: 'from-white/90 to-blue-50/90',
                    textColor: 'text-gray-800'
                },
                dark: {
                    bgColor: 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100',
                    chatBg: 'from-slate-800/90 to-purple-800/90',
                    asideBg: 'from-white/90 to-blue-50/90',
                    textColor: 'text-gray-200'
                }
            }
        }}>
            {children}
        </themeContext.Provider>
    );
}