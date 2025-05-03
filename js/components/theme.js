const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  sessionStorage.setItem("theme", theme);
};
//Get the system theme
let theme =
  sessionStorage.getItem("theme") == "light"
    ? "light"
    : sessionStorage.getItem("theme") == "dark"
    ? "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
setTheme(theme);
//Radio buttons
const darkThemeRadio = document.getElementById("dark-theme");
const lightThemeRadio = document.getElementById("light-theme");
//HTML theme
let currentTheme = document.documentElement.getAttribute("data-theme");

if (currentTheme === "dark") {
  darkThemeRadio.checked = true;
} else {
  lightThemeRadio.checked = true;
}

darkThemeRadio.addEventListener("change", () => setTheme("dark"));
lightThemeRadio.addEventListener("change", () => setTheme("light"));
