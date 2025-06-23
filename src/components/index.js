// ✅ ATOMS UNIFICADOS
export { default as Alert } from './atoms/Alert';
export { default as AnimatedText } from './atoms/AnimatedText';
export { default as Badge } from './atoms/Badge';
export { default as Box } from './atoms/Box';
export { default as Button } from './atoms/Button';
export { default as Card } from './atoms/Card';
export { default as Checkbox } from './atoms/Checkbox';
export { default as Container } from './atoms/Container';
export { default as Dropdown } from './atoms/Dropdown';
export { default as EscapeButton } from './atoms/EscapeButton';
export { default as FileInput } from './atoms/FileInput';
export { default as Footer } from './atoms/Footer';
export { default as FullScreenLoader } from './atoms/FullScreenLoader';
export { default as Icon } from './atoms/Icon';
export { default as IconButton } from './atoms/IconButton';
export { default as Image } from './atoms/Image';
export { default as Input } from './atoms/Input';
export { default as Label } from './atoms/Label';
export { default as Logo } from './atoms/Logo';
export { default as MotivationalMessage } from './atoms/MotivationalMessage';
export { default as NavLink } from './atoms/NavLink';
export { default as Overlay } from './atoms/Overlay';
export { default as SearchInput } from './atoms/SearchInput';
export { default as Tab } from './atoms/Tab';
export { default as TextArea } from './atoms/TextArea';
export { default as Title } from './atoms/Title';
export { default as ToggleButton } from './atoms/ToggleButton';

// ✅ MOLECULES
export { default as ActionButtons } from './molecules/ActionButtons';
export { default as CategorySelector } from './molecules/CategorySelector';
export { default as ContentBox } from './molecules/ContentBox';
export { default as FileField } from './molecules/FileField';
export { default as FlashcardFlip } from './molecules/FlashcardFlip';
export { default as FlashcardSlider } from './molecules/FlashcardSlider';
export { default as FormField } from './molecules/FormField';
export { default as FormGroup } from './molecules/FormGroup';
export { default as GameCard } from './molecules/GameCard';
export { default as GameProgressBar } from './molecules/GameProgressBar';
export { default as ImageUploadField } from './molecules/ImageUploadField';
export { default as NavigationMenu } from './molecules/NavigationMenu';
export { default as PageHeader } from './molecules/PageHeader';
export { default as PercentageCard } from './molecules/PercentageCard';
export { default as ResultCard } from './molecules/ResultCard';
export { default as SearchBar } from './molecules/SearchBar';
export { default as SelectFlashCard } from './molecules/SelectFlashCard';
export { default as TabBar } from './molecules/TabBar';
export { default as TeamDropdown } from './molecules/TeamDropdown';
export { default as TextAreaField } from './molecules/TextAreaField';
export { default as UserDropdown } from './molecules/UserDropdown';

// ✅ ORGANISMS
export { default as CategoryForm } from './organisms/CategoryForm';
export { default as FlashcardForm } from './organisms/FlashcardForm';
export { default as FlashcardList } from './organisms/FlashcardList';
export { default as GameContainer } from './organisms/GameContainer';
export { default as MainContent } from './organisms/MainContent';
export { default as Navigation } from './organisms/Navigation';

// ✅ TEMPLATES
export { default as AppLayout } from './templates/AppLayout';

// ✅ BACKWARD COMPATIBILITY (Aliases para componentes unificados)
export { default as GameButton } from './atoms/Button'; // Alias
export { default as GameActionButton } from './atoms/Button'; // Alias
export { default as GameIcon } from './atoms/Icon'; // Alias
export { default as GameImage } from './atoms/Image'; // Alias
export { default as ImagePreview } from './atoms/Image'; // Alias

// // Atoms
// export { default as Alert } from './atoms/Alert';
// export { default as AnimatedText } from './atoms/AnimatedText';
// export { default as Badge } from './atoms/Badge';
// export { default as Box } from './atoms/Box';
// export { default as Button } from './atoms/Button';
// export { default as Card } from './atoms/Card';
// export { default as Checkbox } from './atoms/Checkbox';
// export { default as Container } from './atoms/Container';
// export { default as Dropdown } from './atoms/Dropdown';
// export { default as EscapeButton } from './atoms/EscapeButton';
// export { default as FileInput } from './atoms/FileInput';
// export { default as Footer } from './atoms/Footer';
// export { default as FullScreenLoader } from './atoms/FullScreenLoader';
// export { default as GameActionButton } from './atoms/GameActionButton';
// export { default as GameButton } from './atoms/GameButton';
// export { default as GameIcon } from './atoms/GameIcon';
// export { default as GameImage } from './atoms/GameImage';
// export { default as Icon } from './atoms/Icon';
// export { default as IconButton } from './atoms/IconButton';
// export { default as ImagePreview } from './atoms/ImagePreview';
// export { default as Input } from './atoms/Input';
// export { default as Label } from './atoms/Label';
// export { default as Logo } from './atoms/Logo';
// export { default as MotivationalMessage } from './atoms/MotivationalMessage';
// export { default as NavLink } from './atoms/NavLink';
// export { default as Overlay } from './atoms/Overlay';
// export { default as SearchInput } from './atoms/SearchInput';
// export { default as Tab } from './atoms/Tab';
// export { default as TextArea } from './atoms/TextArea';
// export { default as Title } from './atoms/Title';
// export { default as ToggleButton } from './atoms/ToggleButton';
// // Molecules
// export { default as ActionButtons } from './Molecules/ActionButtons';
// export { default as CategorySelector } from './molecules/CategorySelector';
// export { default as ContentBox } from './molecules/ContentBox';
// export { default as FileField } from './molecules/FileField';
// export { default as FlashcardFlip } from './molecules/FlashcardFlip';
// export { default as FlashcardSlider } from './molecules/FlashcardSlider';
// export { default as FormField } from './molecules/FormField';
// export { default as FormGroup } from './molecules/FormGroup';
// export { default as GameCard } from './molecules/GameCard';
// export { default as GameProgressBar } from './molecules/GameProgressBar';
// export { default as ImageUploadField } from './molecules/ImageUploadField';
// export { default as NavigationMenu } from './molecules/NavigationMenu';
// export { default as PageHeader } from './molecules/PageHeader';
// export { default as PercentageCard } from './molecules/PercentageCard';
// export { default as ResultCard } from './molecules/ResultCard';
// export { default as SearchBar } from './molecules/SearchBar';
// export { default as SelectFlashcard } from './molecules/SelectFlashcard';
// export { default as TabBar } from './molecules/TabBar';
// export { default as TeamDropdown } from './molecules/TeamDropdown';
// export { default as TextAreaField } from './molecules/TextAreaField';
// export {default as UserDropdown} from './molecules/UserDropdown';
// // Organisms
// export { default as CategoryForm } from './organisms/CategoryForm';
// export { default as FlashcardForm } from './organisms/FlashcardForm';
// export { default as FlashcardList } from './organisms/FlashcardList';
// export { default as GameContainer } from './organisms/GameContainer';
// export { default as MainContent } from './organisms/MainContent';
// export { default as Navigation } from './organisms/Navigation';
// // Templates
// export { default as AppLayout } from './templates/AppLayout';
//
//
// /* *
//     1. Identificar y unificar componentes duplicados
//     Duplicados identificados:
//     GameActionButton vs Button
//     GameButton vs Button
//     GameImage vs ImagePreview
//     GameIcon vs Icon
// * */


