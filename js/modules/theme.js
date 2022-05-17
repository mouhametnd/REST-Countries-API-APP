export const theme = () => {
  const $html = document.documentElement;
  const $spanText = document.querySelector('.header__theme-text');
  const $toggleBtn = document.getElementById('themeToggle');

  const themes = {
    light: {
      primaryBg: '#fff',
      bodyBg: '#fafafa',
      primaryTextClr: ' #111517',
      secondaryTextClr: '#fff',
      loaderBg: '#ebebeb',
      shadowClr: 'rgb(0 0 0 / 3%)',
    },
    dark: {
      primaryBg: '#2b3945',
      bodyBg: '#202c37',
      secondaryTextClr: ' #111517',
      primaryTextClr: '#fff',
      textClr: '#fff',
      loaderBg: '#d8d8d8',
      shadowClr: 'rgb(0 0 0 / 5%)',
    },
  };

  const renderTheme = theme => {
    $html.style.setProperty('--primaryBg', themes[theme].primaryBg);
    $html.style.setProperty('--bodyBg', themes[theme].bodyBg);
    $html.style.setProperty('--primaryTextClr', themes[theme].primaryTextClr);
    $html.style.setProperty('--SecondaryTextClr', themes[theme].secondaryTextClr);
    $html.style.setProperty('--loaderBg', themes[theme].loaderBg);
    $html.style.setProperty('--shadowClr', themes[theme].shadowClr);
    theme === 'light' ? ($spanText.textContent = 'Dark Mode') : ($spanText.textContent = 'Light Mode');
    localStorage.setItem('theme', theme);
  };
  renderTheme(localStorage.getItem('theme') ?? 'light');

  $toggleBtn.addEventListener('click', () => (localStorage.getItem('theme') === 'light' ? renderTheme('dark') : renderTheme('light')));
};
