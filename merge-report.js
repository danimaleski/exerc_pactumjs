const marge = require('mochawesome-report-generator');
const merge = require('mochawesome-merge').default;
const fs = require('fs');

(async () => {
  try {
    const json = await merge({ files: ['mochawesome-report/*.json'] });
    fs.writeFileSync('mochawesome-report/report.json', JSON.stringify(json, null, 2));
    await marge.create(json, {
      reportDir: 'mochawesome-report',
      reportFilename: 'index',
    });
    console.log('✅ Relatório gerado com sucesso!');
  } catch (err) {
    console.error('Erro ao gerar o relatório:', err);
  }
})();
