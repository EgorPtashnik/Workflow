sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/ui/core/UIComponent',
  'sap/base/Log',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'client/constant/Routes',
  'client/model/actions',
  'client/model/formatter'
], function(Controller, History, UIComponent, Log, MessageBox, MessageToast,
            ROUTES, A, Formatter) {
  "use strict";

  return Controller.extend("client.controller.BaseController", {
    formatter: Formatter,
    onInit() {
      this.oDeviceModel = this.getOwnerComponent().getModel('device');
      this.getView().addStyleClass(this._getDensityClass());
    },
    _getDensityClass() {
      this.oDeviceModel = this.getOwnerComponent().getModel('device');
      return this.oDeviceModel.getProperty('/support/touch')? 'sapUiSizeCozy' : 'sapUiSizeCompact';
    },
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
      MessageToast.show(sMessage, this.oDeviceModel.getProperty('/resize/width') > 1700? {
        my: 'right top',
        at: 'right top',
        offset: '-10 10'
      } : {});
    },
    showErrorMessage(sMessage) {
      MessageBox.error(sMessage, {
        styleClass: this._getDensityClass()
      });
      this.getLogger().error(sMessage);
    },
    toggleBusy(bBusy) {
      this.dispatch(A.toggleBusy(bBusy));
    },
    getThemeName(sTheme, bDarkMode) {
      return sTheme === 'sap_fiori_3'? bDarkMode? 'sap_fiori_3_dark' : 'sap_fiori_3' :
        sTheme === 'sap_belize'? bDarkMode? 'sap_belize_plus' : 'sap_belize' :
        sTheme === 'sap_fiori_3_hcw'? bDarkMode? 'sap_fiori_3_hcb' : 'sap_fiori_3_hcw' : '';
    },
    onGoToSettings() {
      this.toggleBusy(true);
      this.navTo(ROUTES.SETTINGS);
    },
    onGoToSapIcons() {
      window.open(ROUTES.SAP_ICONS, '_blank');
    }
  });

});
