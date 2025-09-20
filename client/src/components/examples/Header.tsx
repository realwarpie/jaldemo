import { Header } from '../Header';
import { ThemeProvider } from '../ThemeProvider';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <Header 
        unreadNotifications={3}
        currentUser={{
          name: "Dr. Demo",
          role: "PHC Administrator",
          phc: "Guwahati PHC"
        }}
        onNotificationsClick={() => console.log('Notifications clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        onProfileClick={() => console.log('Profile clicked')}
      />
    </ThemeProvider>
  );
}