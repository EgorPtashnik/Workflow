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
        newCardName: '',
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
    onUpdateProject() {
      HttpService.updateProject(this.sProjectId,
        { name: this.getStore().getData().selectedProject.name,
          desc: this.getStore().getData().selectedProject.desc })
        .done(() => {
          this.showSuccessMessage(this.getResourceBundle().getText('updateProjectSuccess'));
          this.editProjectDialog.close();
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
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
      this.state.setProperty('/newCardName', '');
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
    onGoProjects() {
      this.getRouter().navTo(ROUTES.HOME);
    }
  });
});
