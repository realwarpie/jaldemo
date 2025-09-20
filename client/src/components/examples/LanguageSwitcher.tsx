import { LanguageSwitcher } from '../LanguageSwitcher';

export default function LanguageSwitcherExample() {
  return (
    <div className="p-4">
      <LanguageSwitcher 
        currentLanguage="en"
        onLanguageChange={(lang) => console.log('Language changed to:', lang)}
      />
    </div>
  );
}