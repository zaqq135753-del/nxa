try {
  const items = JSON.parse(localStorage.getItem('caraiva:journey:plan:v1') || '[]');
  const root = document.getElementById('plan');
  if (Array.isArray(items)) for (const item of items) {
    if (!item || typeof item.name !== 'string' || typeof item.time !== 'string') continue;
    const paragraph = document.createElement('p');
    paragraph.textContent = [item.time, item.name, 'Planejado · sem reserva'].filter(Boolean).join(' · ');
    root.appendChild(paragraph);
  }
} catch { document.getElementById('plan').textContent = 'Não foi possível ler o roteiro neste navegador.'; }
