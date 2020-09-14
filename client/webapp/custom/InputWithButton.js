sap.ui.define([
  'sap/m/Input'
], function(oInput) {
  'use strict';

  return oInput.extend('client.custom.InputWithButton', {

    metadata: {
      properties: {
        buttonIcon: { type: 'string', defaultValue: 'sap-icon://add' },
        showValueHelp: { defaultValue: true }
      }
    },

    onAfterRendering: function() {
      if (sap.m.Input.prototype.onAfterRendering) {
        sap.m.Input.prototype.onAfterRendering.apply(this, arguments);
      }

      const icon = this._getValueHelpIcon();
      icon.setSrc(this.getButtonIcon());
    },

    renderer: {}
  })
})
