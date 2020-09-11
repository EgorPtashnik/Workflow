sap.ui.define([
  'client/controller/BaseController'
], function(BaseController) {
  "use strict";

  return BaseController.extend('client.controller.App', {
    onInit() {
      sap.ui.getCore().applyTheme(this.getThemeName(this.getStore().getProperty('/theme') || 'sap_fiori_3', this.getStore().getProperty('/darkMode') || false));
      sap.ui.getCore().getConfiguration().setLanguage(this.getStore().getProperty('/locale') || 'en_EN');
    }
  });
});
