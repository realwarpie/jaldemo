import { InteractiveMap } from '../InteractiveMap';

export default function InteractiveMapExample() {
  return (
    <div className="p-4">
      <InteractiveMap onPHCClick={(phc) => console.log('PHC selected:', phc)} />
    </div>
  );
}