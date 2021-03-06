namespace Workflow.db;

using { cuid, managed } from '@sap/cds/common';

entity Project: cuid, managed {
  name: String;
  github: String;
  icon: String default 'sap-icon://legend';
  iconColor: Integer default 13;
  desc: String;

  cards: Composition of many Card on cards.project = $self;
}

entity Card: cuid, managed {
  name: String;
  icon: String default 'sap-icon://workflow-tasks';

  project: Association to Project;
  items: Composition of many CardItem on items.card = $self;
}

entity CardItem: cuid, managed {
  name: String;
  done: Integer;
  card: Association to Card;
}
