sap.ui.define([
  'client/controller/BaseController',
  'sap/m/MessageBox',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/Fragment',
  'client/constant/Routes',
  'client/service/Http.service',
  'client/model/actions'
], function(BaseController, MessageBox, JSONModel, Fragment,
            ROUTES, HttpService, A) {
  "use strict";

  return BaseController.extend('client.controller.Detail', {
    onInit() {
      BaseController.prototype.onInit.apply(this, arguments);
      this.state = new JSONModel({
        newCardName: '',
        newCardIcon: 'sap-icon://workflow-tasks'
      });
      this.setModel(this.state, 'state');

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.DETAIL) return;
      this.sProjectId = oEvent.getParameter('arguments').id;

      HttpService.getProject(this.sProjectId)
        .done(oData => {
          this.dispatch(A.setSelectedProject(oData));
          this.toggleBusy(false);
        })
        .fail(res => MessageBox.error(res.responseJSON.error.message, { onClose: () => this.navTo(ROUTES.HOME)}));
    },
    openCreateCardPopover(oEvent) {
      const oButton = oEvent.getSource();
      if (!this._oCreateCardPopover) {
        Fragment.load({
          name: 'client.view.fragment.CreateCardPopover',
          controller: this
        }).then(oPopover => {
          this._oCreateCardPopover = oPopover;
          this.getView().addDependent(this._oCreateCardPopover);
          this._oCreateCardPopover.openBy(oButton);
        });
      } else {
        this._oCreateCardPopover.openBy(oButton);
      }
    },
    onCreateCard(oEvent) {
      this.toggleBusy(true);
      const sNewCardName = this.state.getProperty('/newCardName');
      const sNewCardIcon = this.state.getProperty('/newCardIcon');
      this.state.setProperty('/newCardName', '');
      this.state.setProperty('/newCardIcon', 'sap-icon://workflow-tasks');
      if (!sNewCardName) {
        this.showErrorMessage(this.getResourceBundle().getText('cardNameError'));
        this.toggleBusy(false);
        return;
      }
      HttpService.createCard({ name: sNewCardName, icon: sNewCardIcon, project_ID: this.sProjectId })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('createItemSuccess'));
          this.dispatch(A.addCard(oData, this.getStore().getData()));
          this._oCreateCardPopover.close();
          this.toggleBusy(false);
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message));
    },
    onChangeListMode(oEvent) {
      const bPressed = oEvent.getParameter('pressed');
      oEvent.getSource().getParent().getParent().setMode(bPressed? 'Delete' : 'SingleSelectMaster');
    },
    onCreateTask(oEvent, sCardID) {
      this.toggleBusy(true);
      const oInput = oEvent.getSource();
      const sNewTaskName = oInput.getValue();
      if (!sNewTaskName) {
        toggleBusy(false);
        return;
      };
      HttpService.createCardItem({ name: sNewTaskName, card_ID: sCardID, done: 0 })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('createItemSuccess'));
          this.dispatch(A.addCardTask(sCardID, oData, this.getStore().getData()));
          oInput.setValue('');
          this.toggleBusy(false);
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
    },
    onDeleteTask(oEvent) {
      this.toggleBusy(true);
      let oCardListItem = oEvent.getParameter('listItem');
      if (!oCardListItem) {
        const oList = oEvent.getSource().getParent();
        oCardListItem = oList.getSwipedItem();
      };
      const { ID, card_ID } = oCardListItem.getBindingContext('store').getObject();
      HttpService.deleteCardItem(ID)
        .done(() => {
          this.showSuccessMessage(this.getResourceBundle().getText('deleteItemSuccess'));
          this.dispatch(A.removeCardTask(ID, card_ID, this.getStore().getData()));
          this.toggleBusy(false);
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message));
    },
    onChangeListItemStatus(oEvent) {
      this.toggleBusy(true);
      let { ID, done } = oEvent.getParameter('listItem').getBindingContext('store').getObject();
      done = done === 0? 1 : 0;
      HttpService.updateCardItem(ID, { done: done })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('updateItemSuccess'));
          this.dispatch(A.updateCardTask(ID, oData ,this.getStore().getData()));
          this.toggleBusy(false);
          })
          .fail(res => this.showErrorMessage(res,responseJSON,error,message));
    },
    onEditProject() {
      this.toggleBusy(true);
      this.navTo(ROUTES.DETAIL_EDIT, { id: this.sProjectId});
    },
    onShowProjectDesc() {
      if (!this._oProjectDescDialog) {
        Fragment.load({
          name: 'client.view.fragment.ProjectDescDialog',
          controller: this
        }).then(oDialog => {
          this._oProjectDescDialog = oDialog;
          this.getView().addDependent(this._oProjectDescDialog);
          this._oProjectDescDialog.open();
        });
      } else {
        this._oProjectDescDialog.open();
      }
    },
    onCloseDialog() {
      this._oProjectDescDialog.close();
    }
  });
});
