import ClienteForm from './ClienteForm';
import { AdminHeader } from '@/components/AdminUI';

export default async function ModificaClientePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, id } = await params;
  await searchParams; // Attendiamo searchParams anche se non lo utilizziamo

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