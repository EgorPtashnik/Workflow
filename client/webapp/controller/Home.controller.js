sap.ui.define([
  'client/controller/BaseController',
  'sap/ui/model/json/JSONModel',
  'sap/ui/core/Fragment',
  'client/constant/Routes',
  'client/service/Http.service',
  'client/model/actions'
], function(BaseController, JSONModel, Fragment,
            ROUTES, HttpService, A) {
  "use strict";

  return BaseController.extend('client.controller.Home', {

    onInit() {
      BaseController.prototype.onInit.apply(this, arguments);
      this.state = new JSONModel({
        newProjectName: '',
        newProjectDesc: '',
        newProejctGit: '',
        projectNameFilter: '',
        deleteMode: false
      });
      this.setModel(this.state, 'state');

      this.oFooter = this.byId('idFooter');

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.HOME) return;
      this.toggleBusy(true);

      if (!this.getStore().getData().projects.length === 0) {
        const selectedProject = this.getStore().getData().selectedProject;
        const newProjectsState = this.getStore().getData().projects.map(project => {
          if (project.ID === this.getStore().getData().selectedProject.ID) return selectedProject;
          return project;
        });
        this.dispatch(A.setProjects(newProjectsState));
        this.toggleBusy(false);
      } else {
        HttpService.getProjects()
        .done(oData => {
          this.dispatch(A.setProjects(oData.value));
          this.toggleBusy(false);
        })
        .fail(err => this.showErrorMessage(err.message));
      }
    },
    onPressCreate(oEvent) {
      const oButton = oEvent.getSource();
      const bIsTouchDevice = this.oDeviceModel.getProperty('/support/touch');
      if (!this._oPopover) {
        Fragment.load({
          name: 'client.view.fragment.CreateProjectPopover',
          controller: this
        }).then(oPopover => {
          this._oPopover = oPopover;
          this.getView().addDependent(this._oPopover);
          this._oPopover.openBy(oButton);
        });
      } else {
        this._oPopover.openBy(oButton);
      }
    },
    onPressSubmit() {
      this.toggleBusy(true);
      const sNewProjectName = this.state.getProperty('/newProjectName');
      const sNewProjectDesc = this.state.getProperty('/newProjectDesc');
      const sNewProjectGit = this.state.getProperty('/newProjectGit');
      if (!sNewProjectName || !sNewProjectDesc) {
        this.showErrorMessage(this.getResourceBundle().getText('createProjectError'));
        this.toggleBusy(false);
        return;
      };
      HttpService.createProject({ name: sNewProjectName, desc: sNewProjectDesc, github: sNewProjectGit })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('createProjectSuccess'));
          this.dispatch(A.addProject({...oData}, this.getStore().getData()));
          this.state.setProperty('/newProjectName', '');
          this.state.setProperty('/newProjectDesc', '');
          this.toggleBusy(false);
          this._oPopover.close();
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
    },

    onDelete(oEvent) {
      this.toggleBusy(true);
      let oProjectListItem = oEvent.getParameter('listItem');
      if (!oProjectListItem) {
        const oList = oEvent.getSource().getParent();
        oProjectListItem = oList.getSwipedItem();
      };
      const { ID } = oProjectListItem.getBindingContext('store').getObject();
      HttpService.deleteProject(ID)
        .done(() => {
          this.dispatch(A.removeProject(ID, this.getStore().getData()));
          this.showSuccessMessage(this.getResourceBundle().getText('deleteProjectSuccess'));
          this.toggleBusy(false);
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message));
    },

    onGoToProject(oEvent) {
      this.toggleBusy(true);
      const { ID } = oEvent.getSource().getBindingContext('store').getObject();
      this.navTo(ROUTES.DETAIL, {id: ID});
    },
    onGoToSettings() {
      this.toggleBusy(true);
      this.navTo(ROUTES.SETTINGS);
    }
  });
});
