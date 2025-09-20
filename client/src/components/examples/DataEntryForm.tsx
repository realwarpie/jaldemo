import { DataEntryForm } from '../DataEntryForm';

export default function DataEntryFormExample() {
  return (
    <div className="p-4 max-w-4xl">
      <DataEntryForm 
        onSubmit={(data) => console.log('Form submitted:', data)}
      />
    </div>
  );
}