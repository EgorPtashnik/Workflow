sap.ui.define([
  'sap/ui/core/Control'
], function(Control) {
  'use strict';

  return Control.extend('client.custom.FlexBox', {
    metadata: {
      properties: {
        wrap: { type: 'String' },
        justifyContent: { type: 'String' },
        alignItems: { type: 'String'},
        direction: { type: 'String', defaultValue: 'row' }
      },
      defaultAggregation: 'items',
      aggregations: {
        firstItem: { type: 'sap.ui.core.Control', multiple: false },
        items: { type: 'sap.ui.core.Control', multiple: true }
      }
    },

    renderer: {
      render(oRm, oFlexBox) {
        const wrap = oFlexBox.getWrap();
        const justifyContent = oFlexBox.getJustifyContent();
        const alignItems = oFlexBox.getAlignItems();
        const direction = oFlexBox.getDirection();
        const firstItem = oFlexBox.getFirstItem();
        const items = oFlexBox.getItems();
        oRm.openStart('div', oFlexBox);
        oRm.style('display', 'flex');
        oRm.style('justify-content', justifyContent);
        oRm.style('align-items', alignItems);
        oRm.style('flex-wrap', wrap);
        oRm.style('flex-direction', direction);
        oRm.openEnd();
        oRm.renderControl(firstItem);
        items.forEach(item => oRm.renderControl(item));
        oRm.close('div');
      }
    }
  })
})
