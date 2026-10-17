import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('output-screenshots');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('1. Acessando tela de Apresentação (Form-First direto)...');
  await page.goto('http://127.0.0.1:5173/apresentacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '2-onboarding-passo-1-identidade.png') });
  console.log('Screenshot 1 salvo: 2-onboarding-passo-1-identidade.png');

  console.log('2. Preenchendo Nome e Categoria...');
  await page.fill('input[placeholder*="Boteco do Pará"]', 'Ouriço Forró & Gastronomia');
  await page.click('button:has-text("Gastronomia")');
  await page.click('button:has-text("Próximo Passo")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '3-onboarding-passo-2-prato-estrela.png') });
  console.log('Screenshot 2 salvo: 3-onboarding-passo-2-prato-estrela.png');

  console.log('3. Preenchendo Prato Estrela...');
  await page.fill('input[placeholder*="Polvo Grelhado"]', 'Moqueca de Camarão Rosa na Areia');
  await page.click('button:has-text("Próximo Passo")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '4-onboarding-passo-3-conexao-taptable.png') });
  console.log('Screenshot 3 salvo: 4-onboarding-passo-3-conexao-taptable.png');

  console.log('4. Clicando em "Construir Meu Espaço em 3D"...');
  await page.fill('input[type="tel"]', '(73) 99888-7777');
  await page.click('button:has-text("Construir Meu Espaço em 3D")');
  
  // Captura do início: Pedestal de Obsidiana & Ilha de Areia
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '5-diorama-fase-pedestal-areia.png') });
  console.log('Screenshot 4 salvo: 5-diorama-fase-pedestal-areia.png');

  // Captura da Fase 2/3: Varanda Jacarandá, Telhado e Lampiões
  await page.waitForTimeout(6000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '5-diorama-fase-estrutura-telhado.png') });
  console.log('Screenshot 5 salvo: 5-diorama-fase-estrutura-telhado.png');

  // Captura da Fase 4/5: Placa Ouro, Holofotes de Galeria e Luz Interior Quente
  await page.waitForTimeout(6000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '5-diorama-fase-galeria-holofotes.png') });
  console.log('Screenshot 6 salvo: 5-diorama-fase-galeria-holofotes.png');

  // Conclusão e revelação triunfante
  console.log('Aguardando conclusão do Cine-Tour e transição para o Live Reveal...');
  await page.waitForSelector('button:has-text("Mesa 01 TapTable NFC")', { timeout: 35000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '6-revelacao-prato-3d-flutuante.png') });
  console.log('Screenshot 7 salvo: 6-revelacao-prato-3d-flutuante.png');

  console.log('5. Clicando na aba Mesa 01 TapTable NFC...');
  await page.click('button:has-text("Mesa 01 TapTable NFC")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '7-revelacao-mesa-taptable-nfc.png') });
  console.log('Screenshot 8 salvo: 7-revelacao-mesa-taptable-nfc.png');

  await browser.close();
  console.log('Todas as capturas foram concluídas com sucesso!');
}

run().catch(console.error);
