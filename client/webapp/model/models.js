sap.ui.define([
  'sap/ui/model/json/JSONModel',
  'sap/ui/Device',
  'client/model/store'
], function(JSONModel, Device, Store) {
  'use strict';

  return {
    createDeviceModel() {
      const oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode('OneWay');
      return oModel;
    },

    createStore() {
      const oStore = new Store({
        projects: [],
        cards: [],
        busy: false,
        cardItems: [],
        selectedProject: {},
        theme: localStorage.getItem('theme') || 'sap_fiori_3',
        darkMode: localStorage.getItem('darkMode') === 'true'? true : false,
        locale: localStorage.getItem('locale') || 'en_EN'
      });

      return oStore;
    }
  };
});
