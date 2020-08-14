sap.ui.define([
  'sap/ui/model/json/JSONModel'
], function(JSONModel) {
  'use strict';

  return JSONModel.extend('client.model.Store', {
    dispatch(oNewData) {
      this.setData({
        ...this.getData(),
        ...oNewData
      });
    }
  });
})
