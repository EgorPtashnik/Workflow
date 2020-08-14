using Workflow.db from './db/schema';

service ODataService {
  entity Projects as projection on db.Project;
  entity Cards as projection on db.Card;
  entity CardItems as projection on db.CardItem;
}
