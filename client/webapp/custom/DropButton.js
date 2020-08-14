sap.ui.define([
  'sap/m/Button'
], function(Button) {
  'use strict';

  return Button.extend('cliend.custom.DropButton', {
    metadata: {
      dnd: {
        droppable: true
      }
    },

    renderer: {}
  });
});
