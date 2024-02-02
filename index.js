import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Websocket from './Websocket';

AppRegistry.registerComponent(appName, () => Websocket);
