/* Zero-dependency theme selector. Called in <head> before CSS to prevent a flash. */
(() => {
  'use strict';
  const themeConfig = window.CAMPAIGN_CONFIG?.theme || {};
  const validThemes = ['halloween', 'classic'];
  const getOverride = () => {
    const query = new URLSearchParams(window.location.search).get('theme');
    return validThemes.includes(query) ? query : '';
  };

  const getSeasonalDay = () => {
    // Hungary's calendar date, independent of the visitor's timezone.
    try {
      const timezone = themeConfig.timeZone || 'Europe/Budapest';
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, month: '2-digit', day: '2-digit'
      }).formatToParts(new Date());
      const month = parts.find(part => part.type === 'month')?.value;
      const day = parts.find(part => part.type === 'day')?.value;
      return `${month}-${day}`;
    } catch {
      const today = new Date();
      return `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
  };

  const isInSeason = (day, start, end) => {
    // Works for both within-year ranges and ranges crossing December/January.
    return start <= end ? day >= start && day <= end : day >= start || day <= end;
  };

  const setTheme = () => {
    const preview = getOverride();
    const mode = validThemes.includes(themeConfig.mode) ? themeConfig.mode : 'auto';
    const seasonStart = /^\d{2}-\d{2}$/.test(themeConfig.halloweenFrom || '') ? themeConfig.halloweenFrom : '10-20';
    const seasonEnd = /^\d{2}-\d{2}$/.test(themeConfig.halloweenThrough || '') ? themeConfig.halloweenThrough : '11-02';
    const seasonal = isInSeason(getSeasonalDay(), seasonStart, seasonEnd);
    const theme = preview || (mode !== 'auto' ? mode : (seasonal ? 'halloween' : 'classic'));
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'halloween' ? '#160d1b' : '#101010');
    window.CAMPAIGN_ACTIVE_THEME = theme;
    return theme;
  };

  setTheme();
  // Refresh when returning to a tab that stayed open across the seasonal boundary.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTheme();
  });
})();
