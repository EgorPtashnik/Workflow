sap.ui.define([

], function() {
  'use strict';

  return {
    iconColor(iColor) {
      switch(iColor.toString()) {
        case '1': return 'Accent1';
        case '2': return 'Accent2';
        case '3': return 'Accent3';
        case '4': return 'Accent4';
        case '5': return 'Accent5';
        case '6': return 'Accent6';
        case '7': return 'Accent7';
        case '8': return 'Accent8';
        case '9': return 'Accent9';
        case '10': return 'Accent10';
        case '11': return 'Placeholder';
        case '12': return 'Random';
        case '13': return 'TileIcon';
        case '14': return 'Transparent';
        default: return 'TileIcon';
      };
    },

    stringByDate(sDate) {
      const oDate = new Date(sDate);
      const sYear = oDate.getFullYear();
      const sMonth = oDate.getMonth() + 1;
      const sDay = oDate.getDate();
      return `${sDay}.${sMonth}.${sYear}`;
    }
  }
})
