sap.ui.define([

], function() {
  'use strict';

  return {
    iconColor(iColor) {
      switch(iColor) {
        case 1: return 'Accent1'; break;
        case 2: return 'Accent2'; break;
        case 3: return 'Accent3'; break;
        case 4: return 'Accent4'; break;
        case 5: return 'Accent5'; break;
        case 6: return 'Accent6'; break;
        case 7: return 'Accent7'; break;
        case 8: return 'Accent8'; break;
        case 9: return 'Accent9'; break;
        case 10: return 'Accent10'; break;
        case 11: return 'Placeholder'; break;
        case 12: return 'Random'; break;
        case 13: return 'TileIcon'; break;
        case 14: return 'Transparent'; break;
        default: return 'TileIcon';
      };
    }
  }
})
