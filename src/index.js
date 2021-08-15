import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getRealm} from './config/realm';

export default function Application() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  async function loadTasks() {
    const realm = await getRealm();

    const realmTasks = realm.objects('Task');

    setTasks(realmTasks);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask() {
    const realm = await getRealm();

    realm.write(() => {
      realm.create('Task', {
        title,
        _id: String(Math.random()),
        status: 'TODO',
      });
    });

    loadTasks();
  }

  async function deleteTask(task) {
    const realm = await getRealm();

    setTasks(prevTasks =>
      prevTasks.filter(prevTask => prevTask._id !== task._id),
    );

    try {
      realm.write(() => {
        realm.delete(task);
      });
    } catch (err) {
      loadTasks();
    }
  }

  return (
    <>
      <SafeAreaView>
        <SwipeListView
          keyExtractor={item => item._id}
          data={tasks}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Text style={styles.task}>{item.title}</Text>
            </View>
          )}
          renderHiddenItem={({item}, rowMap) => (
            <View style={styles.hiddenItem}>
              <TouchableOpacity>
                <Text>Left</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item)}>
                <Text>Deletar</Text>
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </SafeAreaView>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Título da task"
          style={styles.input}
          value={title}
          onChangeText={value => setTitle(value)}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={createTask}>
            Criar
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 50,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '70%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#ff2748',
    padding: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  task: {
    fontSize: 26,
    color: '#fff',
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: '#ff2748',
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
    justifyContent: 'center',
    height: 50,
  },
  hiddenItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
});
