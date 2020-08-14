sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/ui/core/UIComponent',
  'client/constant/Routes'
], function(Controller, History, UIComponent, ROUTES) {
  "use strict";

  return Controller.extend("client.controller.BaseController", {
    getStore() {
      return this.getOwnerComponent().getModel('store');
    },
    dispatch(oNewData) {
      this.getStore().dispatch(oNewData);
    },

    getModel(sName) {
      return this.getView().getModel(sName);
    },

    setModel(oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    getResourceBundle() {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    navTo(psTarget, pmParameters, pbReplace) {
      this.getRouter().navTo(psTarget, pmParameters, pbReplace);
    },

    getRouter() {
      return UIComponent.getRouterFor(this);
    },

    onNavBack() {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.back();
      } else {
        this.getRouter().navTo(ROUTES.HOME, {}, true );
      }
    }

  });

});
