sap.ui.define([
  'client/controller/BaseController',
  'sap/m/MessageBox',
  'sap/ui/model/json/JSONModel',
  'client/constant/Routes',
  'client/service/Http.service',
  'client/model/actions'
], function(BaseController, MessageBox, JSONModel,
            ROUTES, HttpService, A) {
  "use strict";

  return BaseController.extend('client.controller.Detail', {
    onInit() {
      this.state = new JSONModel({
        createCard: false,
        newCardName: '',
        editProject: false
      });
      this.setModel(this.state, 'state');

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.DETAIL) return;
      this.sProjectId = oEvent.getParameter('arguments').id;

      HttpService.getProject(this.sProjectId)
        .done(oData => this.dispatch(A.setSelectedProject(oData)))
        .fail(res => {
          MessageBox.error(res.responseJSON.error.message, {
            onClose: () => this.navTo(ROUTES.HOME)
          });
      })
    },
    onCreateTask(oEvent) {
      const oInput = oEvent.getSource();
      const sNewTaskName = oInput.getValue();
      if (!sNewTaskName) return;
      const sCardId = oInput.getParent().getBindingContext('store').getObject().ID;
      HttpService.createCardItem({ name: sNewTaskName, card_ID: sCardId })
        .done(oData => {
          this.dispatch(A.addCardTask(sCardId, oData, this.getStore().getData()));
          oInput.setValue('');
        })
        .fail(res => MessageBox.error(res.responseJSON.error.message))
    },
    onDeleteTask(oEvent) {
      const { ID } = oEvent.getParameter('draggedControl').getBindingContext('store').getObject();
      const sCardId = oEvent.getParameter('draggedControl').getParent().getParent().getBindingContext('store').getObject().ID;
      HttpService.deleteCardItem(ID)
        .done(() => this.dispatch(A.removeCardTask(ID, sCardId, this.getStore().getData())))
        .fail(res => MessageBox.error(res.responseJSON.error.message))
    },
    onShowCreateCardForm() {
      this.state.setProperty('/createCard', true);
      setTimeout(() => this.byId('idNewCardNameInput').focus(), 100);
    },
    onHideCreateCardForm() {
      this.state.setProperty('/newCardName', '');
      this.state.setProperty('/createCard', false);
    },
    onCreateCard() {
      const sNewCardName = this.state.getProperty('/newCardName');
      if (!sNewCardName) {
        MessageBox.error(this.getResourceBundle().getText('cardNameError'));
        return;
      }
      HttpService.createCard({ name: sNewCardName, project_ID: this.sProjectId })
        .done(oData => {
          this.dispatch(A.addCard(oData, this.getStore().getData()));
          this.onHideCreateCardForm();
        })
        .fail(res => MessageBox.error(res.responseJSON.error.message));
    },
    onDeleteCard(oEvent) {
      const { ID } = oEvent.getSource().getParent().getBindingContext('store').getObject();
      HttpService.deleteCard(ID)
        .done(() => this.dispatch(A.deleteCard(ID, this.getStore().getData())))
        .fail(res => MessageBox.error(res.responseJSON.error.message))
    },

    onDropTask(oEvent) {
      let sCardId;
      const oDraggedCardItemData = oEvent.getParameter('draggedControl').getBindingContext('store').getObject();
      const oDroppedCardData = oEvent.getParameter('droppedControl').getBindingContext('store').getObject();
      const curCardId = oDraggedCardItemData.card_ID;
      if (oDroppedCardData.ID === curCardId) return;
      sCardId = oDroppedCardData.ID;
      const sCardItemId = oDraggedCardItemData.ID;
      HttpService.updateCardItem(sCardItemId, { card_ID: sCardId })
      .done(oData => {
          this.dispatch(A.addCardTask(sCardId, oData, this.getStore().getData()));
          this.dispatch(A.removeCardTask(sCardItemId, curCardId, this.getStore().getData()));
      })
      .fail(res => MessageBox.error(res.responseJSON.error.message));
    },

    onGoHome() {
      this.state.setProperty('/createCard', false);
      this.state.setProperty('/newCardName', '');
      this.onNavBack();
    },
    onEdit(oEvent) {
      const bIsPressed = oEvent.getParameter('pressed');
      if (!bIsPressed) {
        const sNewProjectName = this.getStore().getProperty('/selectedProject/name');
        const sNewProjectDesc = this.getStore().getProperty('/selectedProject/desc');
        HttpService.updateProject(this.sProjectId, {
          name: sNewProjectName,
          desc: sNewProjectDesc
        })
        .fail(res => MessageBox.error(res.responseJSON.error.message))
      }
    }
  });
});
