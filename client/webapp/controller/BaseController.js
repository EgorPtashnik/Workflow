sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/ui/core/UIComponent',
  'sap/base/Log',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'client/constant/Routes'
], function(Controller, History, UIComponent, Log, MessageBox, MessageToast,
            ROUTES) {
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
    getLogger() {
      return Log;
    },
    onNavBack() {
      const sPreviousHash = History.getInstance().getPreviousHash();
      if (sPreviousHash !== undefined) window.history.back();
      else this.getRouter().navTo(ROUTES.HOME, {}, true );
    },
    showSuccessMessage(sMessage) {
      this.getLogger().info(sMessage);
      MessageToast.show(sMessage, {
        my: 'right top',
        at: 'right top',
        offset: '-10 10'
      });
    },
    showErrorMessage(sMessage) {
      MessageBox.error(sMessage);
      this.getLogger().error(sMessage);
    },
    toggleBusy(bBusy) {
      this.dispatch(A.toggleBusy(bBusy));
    }

  });

});
