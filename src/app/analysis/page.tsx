import { getCosplayData } from "@/lib/data";
import AnalysisClient from "./AnalysisClient";

export default async function AnalysisPage() {
  const data = getCosplayData();

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI Color Analysis</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          お使いのブラウザ上でCanvas APIを使用して、画像を解析しテーマカラー（メインカラー）を抽出します。サーバーに画像を送信しないためセキュアで無料です。
        </p>
      </section>

      <AnalysisClient data={data} />
    </main>
  );
}
