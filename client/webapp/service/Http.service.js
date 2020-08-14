sap.ui.define([
  'client/constant/Routes'
], function(ROUTES) {
  'use strict';

  return {
    getProjects() {
      return $.ajax(ROUTES.SERVER.PROJECTS);
    },
    getProject(sProjectId) {
      return $.ajax(ROUTES.SERVER.PROJECTS + `(${sProjectId})?$expand=cards($expand=items)`);
    },
    createProject(oProject) {
      return $.ajax(ROUTES.SERVER.PROJECTS, {
        method: 'POST',
        data: JSON.stringify(oProject),
        contentType: 'application/json',
      });
    },
    updateProject(sProjectId, oProject) {
      return $.ajax(ROUTES.SERVER.PROJECTS + `/${sProjectId}`, {
        method: 'PUT',
        data: JSON.stringify(oProject),
        contentType: 'application/json'
      });
    },
    deleteProject(sProjectId) {
      return $.ajax(ROUTES.SERVER.PROJECTS + `/${sProjectId}`, {
        method: 'DELETE'
      });
    },

    createCard(oCard) {
      return $.ajax(ROUTES.SERVER.CARDS, {
        method: 'POST',
        data: JSON.stringify(oCard),
        contentType: 'application/json',
      });
    },
    deleteCard(sCardId) {
      return $.ajax(ROUTES.SERVER.CARDS + `(${sCardId})`, {
        method: 'DELETE'
      });
    },

    createCardItem(oCardItem) {
      return $.ajax(ROUTES.SERVER.CARD_ITEMS, {
        method: 'POST',
        data: JSON.stringify(oCardItem),
        contentType: 'application/json'
      });
    },
    updateCardItem(sCardItemId, oCardItem) {
      return $.ajax(ROUTES.SERVER.CARD_ITEMS + `(${sCardItemId})`, {
        method: 'PUT',
        data: JSON.stringify(oCardItem),
        contentType: 'application/json',
      });
    },
    deleteCardItem(sCardItemId) {
      return $.ajax(ROUTES.SERVER.CARD_ITEMS + `(${sCardItemId})`, {
        method: 'DELETE'
      });
    }
  }
})
