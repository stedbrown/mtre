import ClienteForm from './ClienteForm';
import { AdminHeader } from '@/components/AdminUI';

export default async function ModificaClientePage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Modifica Cliente"
        description="Modifica i dati del cliente"
        locale={locale}
        backButton={{
          href: '/admin/clienti',
          label: 'Torna alla lista clienti'
        }}
      />
      
      <ClienteForm clienteId={id} locale={locale} />
    </div>
  );
} 