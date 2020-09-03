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
        showNewCardInput: false,
        newCardName: '',
        editMode: false
      });
      this.setModel(this.state, 'state');

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.DETAIL) return;
      this.sProjectId = oEvent.getParameter('arguments').id;

      HttpService.getProject(this.sProjectId)
        .done(oData => this.dispatch(A.setSelectedProject(oData)))
        .fail(res => MessageBox.error(res.responseJSON.error.message, { onClose: () => this.navTo(ROUTES.HOME)}));
    },
    closeDialog(oEvent) {
      oEvent.getSource().getParent().close();
    },
    openCreateCardDialog() {
      if (!this.createCardDialog) this.createCardDialog = this.byId('idCreateCardDialog');
      this.createCardDialog.open();
    },
    openEditProjectDialog() {
      if (!this.editProjectDialog) this.editProjectDialog = this.byId('idEditProjectDialog');
      this.editProjectDialog.open();
    },
    onCreateCard(oEvent) {
      const sNewCardName = this.state.getProperty('/newCardName');
      this.state.setProperty('/newCardName');
      if (!sNewCardName) {
        this.showErrorMessage(this.getResourceBundle().getText('cardNameError'));
        return;
      }
      HttpService.createCard({ name: sNewCardName, project_ID: this.sProjectId })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('createItemSuccess'));
          this.dispatch(A.addCard(oData, this.getStore().getData()));
          this.createCardDialog.close();
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message));
    },
    onChangeListMode(oEvent) {
      const bPressed = oEvent.getParameter('pressed');
      oEvent.getSource().getParent().getParent().setMode(bPressed? 'Delete' : 'SingleSelectMaster');
    },
    onCreateTask(oEvent, sCardID) {
      const oInput = oEvent.getSource();
      const sNewTaskName = oInput.getValue();
      if (!sNewTaskName) return;
      HttpService.createCardItem({ name: sNewTaskName, card_ID: sCardID, done: 0 })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('createItemSuccess'));
          this.dispatch(A.addCardTask(sCardID, oData, this.getStore().getData()));
          oInput.setValue('');
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
    },
    onDeleteTask(oEvent) {
      const { ID, card_ID } = oEvent.getParameter('listItem').getBindingContext('store').getObject();
      HttpService.deleteCardItem(ID)
        .done(() => {
          this.showSuccessMessage(this.getResourceBundle().getText('deleteItemSuccess'));
          this.dispatch(A.removeCardTask(ID, card_ID, this.getStore().getData()));
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message));
    },
    onChangeListItemStatus(oEvent) {
      let { ID, done } = oEvent.getParameter('listItem').getBindingContext('store').getObject();
      done = done === 0? 1 : 0;
      HttpService.updateCardItem(ID, { done: done })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('updateItemSuccess'));
          this.dispatch(A.updateCardTask(ID, oData ,this.getStore().getData()));
          })
          .fail(res => this.showErrorMessage(res,responseJSON,error,message));
    },
    onDeleteCard(oEvent) {
      const { ID } = oEvent.getParameter('listItem').getBindingContext('store').getObject();
      HttpService.deleteCard(ID)
        .done(() => {
          this.showSuccessMessage(this.getResourceBundle().getText('deleteItemSuccess'));
          this.dispatch(A.deleteCard(ID, this.getStore().getData()))
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
    },

    // onDropTask(oEvent) {
    //   let sCardId;
    //   const oDraggedCardItemData = oEvent.getParameter('draggedControl').getBindingContext('store').getObject();
    //   const oDroppedCardData = oEvent.getParameter('droppedControl').getBindingContext('store').getObject();
    //   const curCardId = oDraggedCardItemData.card_ID;
    //   if (oDroppedCardData.ID === curCardId) return;
    //   sCardId = oDroppedCardData.ID;
    //   const sCardItemId = oDraggedCardItemData.ID;
    //   HttpService.updateCardItem(sCardItemId, { card_ID: sCardId })
    //   .done(oData => {
    //       this.dispatch(A.addCardTask(sCardId, oData, this.getStore().getData()));
    //       this.dispatch(A.removeCardTask(sCardItemId, curCardId, this.getStore().getData()));
    //   })
    //   .fail(res => MessageBox.error(res.responseJSON.error.message));
    // },

    // onGoHome() {
    //   this.state.setProperty('/createCard', false);
    //   this.state.setProperty('/newCardName', '');
    //   this.onNavBack();
    // },
    // onEdit(oEvent) {
    //   const bIsPressed = oEvent.getParameter('pressed');
    //   if (!bIsPressed) {
    //     const sNewProjectName = this.getStore().getProperty('/selectedProject/name');
    //     const sNewProjectDesc = this.getStore().getProperty('/selectedProject/desc');
    //     HttpService.updateProject(this.sProjectId, {
    //       name: sNewProjectName,
    //       desc: sNewProjectDesc
    //     })
    //     .fail(res => MessageBox.error(res.responseJSON.error.message))
      // }
    // }
  });
});
