export function downloadChartPngWithBackground(chart, fileName, backgroundColor = '#ffffff') {
  if (!chart || typeof chart.toBase64Image !== 'function') return;
  const canvas = chart.canvas;
  if (!canvas) return;

  const width = canvas.width;
  const height = canvas.height;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = width;
  exportCanvas.height = height;

  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return;

  // Fill background first, then draw the chart on top.
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(canvas, 0, 0);

  const dataUrl = exportCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.png`;
  link.click();
}

