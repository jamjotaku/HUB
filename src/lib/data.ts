import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export interface CosplayData {
  id: number;
  member: string;
  cosplayer: string;
  image: string;
  link: string;
  mainColor: string;
  tags: string[];
}

export function getCosplayData(): CosplayData[] {
  const filePath = path.join(process.cwd(), 'public', 'data.csv');
  let fileContent = '';
  
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }

  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  // Map and sanitize the data
  const data: CosplayData[] = parsed.data
    .map((row: any, index: number) => ({
      id: index + 1,
      member: row.member || '',
      cosplayer: row.cosplayer || '',
      image: row.image || '',
      link: row.link || '',
      mainColor: row['MainColor'] || '#2a2a35',
      tags: row.Tags ? row.Tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    }))
    .filter((item: CosplayData) => item.image && item.member);

  return data;
}
