sap.ui.define([
  'client/controller/BaseController',
  'sap/ui/model/json/JSONModel',
  'client/constant/Routes',
  'client/service/Http.service',
  'client/model/actions'
], function(BaseController, JSONModel,
            ROUTES, HttpService, A) {
  "use strict";

  return BaseController.extend('client.controller.Home', {

    onInit() {
      this.state = new JSONModel({
        showFooter: false,
        newProjectName: '',
        newProjectDesc: '',
        projectNameFilter: '',
        deleteMode: false
      });
      this.setModel(this.state, 'state');

      this.oFooter = this.byId('idFooter');

      this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched(oEvent) {
      if (oEvent.getParameter('name') !== ROUTES.HOME) return;

      if (!this.getStore().getData().projects.length === 0) {
        const selectedProject = this.getStore().getData().selectedProject;
        const newProjectsState = this.getStore().getData().projects.map(project => {
          if (project.ID === this.getStore().getData().selectedProject.ID) return selectedProject;
          return project;
        });
        window.localStorage.setItem('projects', JSON.stringify(newProjectsState));
      }
      if (window.localStorage.getItem('projects') && this.getStore().getData().projects.length === 0) {
        this.dispatch(A.setProjects(JSON.parse(window.localStorage.getItem('projects'))));
      }
      else
      HttpService.getProjects()
        .done(oData => {
          window.localStorage.setItem('projects', JSON.stringify(oData.value));
          this.dispatch(A.setProjects(oData.value));
        })
        .fail(err => this.showErrorMessage(err.message));
    },
    onPressCreate() {
      this.state.setProperty('/showFooter', true);
      setTimeout(() => {
        this.oFooter.addStyleClass('scale_in');
        this.oFooter.removeStyleClass('scale_out');
        this.byId('idProjectInput').focus();
      }, 100);
    },
    onPressSubmit() {
      const sNewProjectName = this.state.getProperty('/newProjectName');
      const sNewProjectDesc = this.state.getProperty('/newProjectDesc');
      if (!sNewProjectName || !sNewProjectDesc) {
        this.showErrorMessage(this.getResourceBundle().getText('createProjectError'));
        return;
      };
      HttpService.createProject({ name: sNewProjectName, desc: sNewProjectDesc })
        .done(oData => {
          this.showSuccessMessage(this.getResourceBundle().getText('createProjectSuccess'));
          this.dispatch(A.addProject({...oData}, this.getStore().getData()));
          this.state.setProperty('/newProjectName', '');
          this.state.setProperty('/newProjectDesc', '');
          this.onPressCancel();
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message))
    },
    onPressCancel() {
      this.oFooter.addStyleClass('scale_out');
      this.oFooter.removeStyleClass('scale_in');
      setTimeout(() => this.state.setProperty('/showFooter', false), 100);
    },

    onDelete(oEvent) {
      const oProjectListItem = oEvent.getParameter('listItem');
      const { ID } = oProjectListItem.getBindingContext('store').getObject();
      HttpService.deleteProject(ID)
        .done(() => {
          this.dispatch(A.removeProject(ID, this.getStore().getData()));
          this.showSuccessMessage(this.getResourceBundle().getText('deleteProjectSuccess'));
        })
        .fail(res => this.showErrorMessage(res.responseJSON.error.message));
    },

    onGoToProject(oEvent) {
      const { ID } = oEvent.getSource().getBindingContext('store').getObject();
      this.navTo(ROUTES.DETAIL, {id: ID});
    }
  });
});
