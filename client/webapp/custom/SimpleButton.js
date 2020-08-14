sap.ui.define([
  'sap/m/Button'
], function(Button) {
  'use strict';

  return Button.extend('cliend.custom.SimpleButton', {
    metadata: {
    },

    renderer: {
      render(oRm, oBtn) {
        oRm.openStart('button', oBtn);
        oRm.openEnd();
        oRm.text(oBtn.getText());
        oRm.close('button');
      }
    }
  });
});
