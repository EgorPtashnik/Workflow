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

  return BaseController.extend('client.controller.DetailEdit', {
    onInit() {
      BaseController.prototype.onInit.apply(this, arguments);
      this.state = new JSONModel({
        desc: '',
        name: '',
        github: '',
        icon: '',
        iconColor: 0,
        cards: [],
        deletedCardsIds: [],
        changed: false
      });
      this.setModel(this.state, 'state');

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.DETAIL_EDIT) return;
      this.sProjectId = oEvent.getParameter('arguments').id;
      HttpService.getProject(this.sProjectId)
        .done(oData => {
          this.dispatch(A.setSelectedProject({
            ...oData,
            cards: oData.cards.map(card => ({...card}))
          }));
          this.state.setData({ ...oData, deletedCardsIds: this.state.getProperty('/deletedCardsIds'), changed: false});
          this.toggleBusy(false);
        })
        .fail(res => MessageBox.error(res.responseJSON.error.message, { onClose: () => this.navTo(ROUTES.HOME)}));
    },
    onDeleteCard(oEvent) {
      this.toggleBusy(true);
      const { ID } = oEvent.getParameter('listItem').getBindingContext('state').getObject();
      this.state.setProperty('/cards', this.state.getProperty('/cards').filter(oCard => oCard.ID !== ID));
      this.state.setProperty('/deletedCardsIds', this.state.getProperty('/deletedCardsIds').reduce((arr, item) => {
        arr.push(item);
        return arr;
      }, [ ID ]));
      this.onChangeProject();
      this.toggleBusy(false);
    },
    onSave() {
      this.toggleBusy(true);
      const {
        name, desc, github, deletedCardsIds, icon, iconColor
      } = this.state.getData();
      const aPromises = [];
      deletedCardsIds.forEach(sCardId => {
        const deffered = $.Deferred();
        aPromises.push(deffered);
        HttpService.deleteCard(sCardId)
        .done(() => {
          this.showSuccessMessage(this.getResourceBundle().getText('deleteItemSuccess'));
          deffered.resolve();
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
      });
      HttpService.updateProject(this.sProjectId, { name, desc, github, icon, iconColor: +iconColor })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('updateProjectSuccess'));
          Promise.all(aPromises).then(() => {
            this.state.setData({
              desc: '',
              name: '',
              github: '',
              icon: '',
              iconColor: 0,
              cards: [],
              deletedCardsIds: [],
              changed: false
            });
            this.navTo(ROUTES.DETAIL, { id: this.sProjectId })
          });
        })
        .fail(res => MessageBox.error(res.responseJSON.error.message, { onClose: () => this.navTo(ROUTES.HOME)}));
    },
    onReset() {
      const oProjectData = this.getStore().getProperty('/selectedProject');
      this.state.setData({
        ...oProjectData,
        cards: oProjectData.cards.map(card => ({...card})),
        changed: false,
        deletedCardsIds: [],
      });
      this.showSuccessMessage(this.getResourceBundle().getText('updateProjectSuccess'));
    },
    onChangeProject() {
      if (!this.state.getProperty('/changed')) this.state.setProperty('/changed', true);
    }
  });
});
