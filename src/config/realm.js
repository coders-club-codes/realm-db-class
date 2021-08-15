import Realm from 'realm';
import TaskSchema from '../schemas/task';

export async function getRealm() {
  const app = new Realm.App({id: 'application-0-frwek'});

  const credentials = Realm.Credentials.anonymous();

  await app.logIn(credentials);

  return Realm.open({
    path: 'myrealm',
    schema: [TaskSchema],
    schemaVersion: 2,
    sync: {
      user: app.currentUser,
      partitionValue: 'teste@teste.com',
    },
  });
}
