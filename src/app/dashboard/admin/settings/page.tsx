import { getSystemSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const initialData = await getSystemSettings();
  
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Pengaturan Sistem</h2>
        <p className="text-stone-500">Konfigurasi data institusi dan preferensi aplikasi.</p>
      </div>
      
      <SettingsForm initialData={initialData} />
    </div>
  );
}
