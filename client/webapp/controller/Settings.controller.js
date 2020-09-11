sap.ui.define([
  'client/controller/BaseController',

  'client/constant/Routes'
], function(BaseController,
            ROUTES) {
  "use strict";

  return BaseController.extend('client.controller.Settings', {
    onInit() {
      BaseController.prototype.onInit.apply(this, arguments);

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.SETTINGS) return;
      this.toggleBusy(false);
    },

    onChangeTheme(oEvent) {
      const sTheme = oEvent.getParameter('selectedItem').getKey();
      const bIsDark = this.getStore().getProperty('/darkMode');
      localStorage.setItem('theme', sTheme);
      localStorage.setItem('darkMode', bIsDark);
      sap.ui.getCore().applyTheme(this.getThemeName(sTheme, bIsDark));
    },
    onToggleDarkMode(oEvent) {
      const bIsDark = oEvent.getParameter('state');
      const sTheme = this.getStore().getProperty('/theme');
      localStorage.setItem('darkMode', bIsDark);
      sap.ui.getCore().applyTheme(this.getThemeName(sTheme, bIsDark));
    },
    onChangeLocale(oEvent) {
      const sLocale = oEvent.getParameter('selectedItem').getKey();
      localStorage.setItem('locale', sLocale);
      sap.ui.getCore().getConfiguration().setLanguage(sLocale);
    }

  });
});
