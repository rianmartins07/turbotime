import DashboardPage from './DashboardPage';

export const metadata = {
  title: 'Notes Dashboard - Organize Your Thoughts',
  description: 'Manage your personal notes with intuitive categorization, color-coded organization, and visual note cards. Access Random Thoughts, School notes, and Personal topics in one centralized dashboard.',
  keywords: 'notes dashboard, note management, personal notes, school notes, random thoughts, note organization, color-coded notes',
  
  openGraph: {
    title: 'Notes Dashboard - Organize Your Thoughts',
    description: 'Manage your personal notes with intuitive categorization, color-coded organization, and visual note cards. Access Random Thoughts, School notes, and Personal topics in one centralized dashboard.',
  }
}

export default function Page() {
  return <DashboardPage />
}