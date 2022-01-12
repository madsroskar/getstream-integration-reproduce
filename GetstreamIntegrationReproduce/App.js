import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
} from 'stream-chat-react-native';
import {StreamChat} from 'stream-chat';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoibGluZ2VyaW5nLWJvYXQtMSIsImV4cCI6MTY0MTkzMzEyMH0.gb8U1mMDj1iCgtKePaN3lj9-VZEWMd8GtzJZ4bWFKtI';

const user = {id: 'lingering-boat-1'};

const chatClient = StreamChat.getInstance('dz5f4d5kzrue');

const ChannelScreen = ({channel}) => {
  return (
    <SafeAreaView>
      <Chat client={chatClient}>
        {channel && (
          <Channel channel={channel} keyboardVerticalOffset={0}>
            <MessageList />
            <MessageInput />
          </Channel>
        )}
      </Chat>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});

export default function App() {
  const [ready, setReady] = useState();
  const [channel, setChannel] = useState();

  useEffect(() => {
    const initChat = async () => {
      try {
        await chatClient.connectUser(user, userToken);
        const messagingChannel = chatClient.channel('messaging', 'channel_id');
        await messagingChannel.watch();
        setChannel(messagingChannel);
        setReady(true);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    if (!chatClient.user) {
      initChat();
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.appContainer}>
        <ChatOverlayProvider topInset={60}>
          {channel && <ChannelScreen channel={channel} />}
        </ChatOverlayProvider>
      </View>
    </SafeAreaProvider>
  );
}
