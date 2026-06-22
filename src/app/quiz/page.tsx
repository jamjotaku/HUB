import { getCosplayData } from "@/lib/data";
import QuizClient from "./QuizClient";

export default async function QuizPage() {
  const data = getCosplayData();

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Cosplay Quiz</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem' }}>
          ランダムに表示される画像から、どのVTuberのコスプレかを当ててみましょう！
        </p>
      </section>

      <QuizClient data={data} />
    </main>
  );
}
