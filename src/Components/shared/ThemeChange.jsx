import React, { useEffect, useState } from 'react';
import { Sun, Moon, MoonStarIcon, SunIcon } from 'lucide-react';

const ThemeChange = () => {

const [theme, setTheme] = useState('sickinferno');

useEffect(()=> {
    const savedTheme = localStorage.getItem('theme') || 'sickinferno';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
}, []);

const handleToggle = (e) => {
    const isChecked = e.target.checked;
    const newTheme = isChecked ? 'quickcheese' : 'sickinferno';
    setTheme(newTheme);
    localStorage.setItem('theme',newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
}

    return (
        <>
        <label className="toggle text-base-content">
        <input type="checkbox" className="theme-controller" value={theme} onChange={handleToggle} checked={theme === 'quickcheese'}  />

        <SunIcon></SunIcon>

        <MoonStarIcon></MoonStarIcon>

        </label>
        </>
    );
};

export default ThemeChange;