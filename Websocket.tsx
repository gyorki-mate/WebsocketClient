import React, {useEffect, useState} from 'react';
import 'fast-text-encoding';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';
import {NetworkInfo} from 'react-native-network-info';

// Get Local IP
NetworkInfo.getIPAddress().then(ipAddress => {
  console.log(ipAddress);
});

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const port = 1344;
  const isDarkMode = useColorScheme() === 'dark';
  const [serverIp, setServerIp] = useState('');
  const [connectIp, setConnectIp] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [hello, setHello] = useState('');
  const [client, setClient] = useState(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleRecievedMessages = data => {
    const string = new TextDecoder().decode(data);
    console.log('asdfg2', string);
    setHello(string);
    setReceivedMessages(setReceivedMessages => [
      ...setReceivedMessages,
      string,
    ]);
  };

  useEffect(() => {
    console.log('hello', hello);
  }, [hello]);

  useEffect(() => {
    if (client) {
      client.on('data', function (data) {
        console.log('message was received', data);
      });

      client.on('error', function (error) {
        console.log(error);
      });

      client.on('close', function () {
        console.log('Connection closed!');
      });
    }
  }, [client]);

  const startServer = ipAddress => {
    const server = TcpSocket.createServer(function (socket) {
      socket.on('data', function (data) {
        socket.write('Client Connected');
        handleRecievedMessages(data);
      });
      socket.on('error', error => {
        console.log('error: ', error);
      });

      socket.on('close', () => {
        console.log('connection closed ', socket.address());
      });
    }).listen({port, host: ipAddress});

    setServerIp(ipAddress);
    setConnectIp(ipAddress);

    server.on('error', error => {
      console.log('An error ocurred with the server', error);
    });

    server.on('listening', () => {
      console.log('Server opens connection');
    });
    server.on('close', () => {
      console.log('Server closed connection');
    });
  };

  const handleStartServer = () => {
    NetworkInfo.getIPAddress().then(ipAddress => {
      console.log('IP:', ipAddress);
      startServer(ipAddress);
    });
  };

  const handleConnect = () => {
    const options = {
      port: port,
      host: connectIp,
      // localAddress: connectIp,
      remoteAddress: connectIp,
      reuseAddress: true,
      // localPort: 20000,
      // interface: "wifi",
    };

    let tcpclient;
    tcpclient = TcpSocket.createConnection(options, () => {
      tcpclient.write('Hello server! (connect)');
    });

    setClient(tcpclient);
    // tcpclient.write('Hello server! (connect)');
  };

  const handleSend = () => {
    if (client) {
      const rnd = Math.floor(Math.random() * 100);
      client.write(`Hello server! ${rnd}`);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <View>
          <Text>IP: {serverIp}</Text>
        </View>
        <TouchableOpacity onPress={handleStartServer}>
          <Text>START</Text>
        </TouchableOpacity>
        <View>
          <TextInput
            style={{padding: 10, backgroundColor: 'gainsboro'}}
            onChange={setConnectIp}
            value={connectIp}
          />
          <View style={{display: 'flex'}}>
            <TouchableOpacity onPress={handleConnect}>
              <Text>CONNECT</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSend}>
              <Text>SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text>Received Messages:</Text>
          {receivedMessages.map((message, index) => (
            <Text key={index}>{message}</Text>
          ))}
        </View>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
