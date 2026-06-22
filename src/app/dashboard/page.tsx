import { getCosplayData } from "@/lib/data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const data = getCosplayData();

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Data Dashboard</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          総計 {data.length.toLocaleString()} 件のコスプレデータを可視化。
        </p>
      </section>

      <DashboardClient data={data} />
    </main>
  );
}
