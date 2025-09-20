import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

type Language = "en" | "as" | "bn";

interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
}

const languages: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

interface LanguageSwitcherProps {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
}

export function LanguageSwitcher({ 
  currentLanguage = "en", 
  onLanguageChange = () => {} 
}: LanguageSwitcherProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);
  
  const currentLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    onLanguageChange(language);
    console.log(`Language changed to: ${language}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid="button-language-switcher">
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm">{currentLang.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-testid="dropdown-language-options">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            data-testid={`option-language-${language.code}`}
            className={selectedLanguage === language.code ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}