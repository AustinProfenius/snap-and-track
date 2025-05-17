import React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native';
import { List, Switch, Divider, Text } from 'react-native-paper';
import { COLORS } from '../styles/colors';

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
          />
          <Divider />
          
          <List.Subheader style={styles.sectionHeader}>Notifications</List.Subheader>
          <List.Item
            title="Enable Notifications"
            description="Receive reminders and updates"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} />}
          />
          <Divider />
          
          <List.Subheader style={styles.sectionHeader}>Account</List.Subheader>
          <List.Item
            title="Profile"
            description="Manage your profile information"
            left={props => <List.Icon {...props} icon="account" />}
            onPress={() => {}}
          />
          <List.Item
            title="Sync Data"
            description="Sync your data to the cloud"
            left={props => <List.Icon {...props} icon="cloud-sync" />}
            onPress={() => {}}
          />
          <Divider />
          
          <List.Subheader style={styles.sectionHeader}>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 