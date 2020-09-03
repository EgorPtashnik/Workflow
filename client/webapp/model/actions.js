sap.ui.define([

], function() {
  'use strict';

  return {
    setProjects(aProjects, store) {
      return { projects: aProjects }
    },
    addProject(oProject, store) {
      store.projects.push(oProject);
      return { projects: store.projects.map(oProject => oProject)};
    },
    removeProject(sProjectId, store) {
      return { projects: store.projects.filter(oProject => oProject.ID !== sProjectId) }
    },

    setSelectedProject(oProject, store) {
      return { selectedProject: { ...oProject } };
    },
    addCard(oCard, store) {
      store.selectedProject.cards.push({...oCard, items: []});
      return { selectedProject: { ...store.selectedProject, cards: store.selectedProject.cards.map(oCard => oCard)}};
    },
    deleteCard(sCardId, store) {
      return { selectedProject: {...store.selectedProject, cards: store.selectedProject.cards.filter(oCard => oCard.ID !== sCardId)}};
    },
    removeCardTask(sCardItemId, sCardId, store) {
      return { selectedProject: {
        ...store.selectedProject,
        cards: store.selectedProject.cards.reduce((arr, item) => {
          if (item.ID === sCardId) item.items = item.items.filter(oItem => oItem.ID !== sCardItemId);
          arr.push(item);
          return arr;
        }, [])
      }};
    },
    addCardTask(sCardId, oCard, store) {
      return { selectedProject: {
        ...store.selectedProject,
        cards: store.selectedProject.cards.reduce((arr, item) => {
          if (item.ID === sCardId) item.items.push(oCard);
          arr.push(item);
          return arr;
        }, [])
      }};
    },
    updateCardTask(sCardItemId, oNewCardItem, store) {
      return { selectedProject: {
        ...store.selectedProject,
        cards: store.selectedProject.cards.reduce((arr, item) => {
          if (item.ID === oNewCardItem.card_ID)
            item.items = item.items.map(cardItem => cardItem.ID === sCardItemId? oNewCardItem : cardItem);
          arr.push(item);
          return arr;
        }, [])
      }}
    }
  }
})
