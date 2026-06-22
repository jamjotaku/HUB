import { getCosplayData } from "@/lib/data";
import Gallery from "@/components/Gallery";

export default async function Home() {
  const data = getCosplayData();

  return (
    <main className="container">
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover VSPO! Cosplays</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore an extensive collection of over {data.length.toLocaleString()} stunning cosplays featuring members of VSPO!.
        </p>
      </section>

      <Gallery initialData={data} />
    </main>
  );
}
