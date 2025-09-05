const express = require('express');
const router = express.Router();
const ReportAnalyzer = require('../services/reportAnalyzer');

const analyzer = new ReportAnalyzer();

// Rota para listar relatórios do cliente
router.get('/clients/:clientId/reports', async (req, res) => {
    try {
        const response = await fetch(`${process.env.REPORTEI_API_URL}/clients/${req.params.clientId}/reports`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        res.status(500).json({ error: 'Erro ao buscar relatórios' });
    }
});

// Rota para analisar um relatório específico
router.get('/reports/:reportId/analyze', async (req, res) => {
    try {
        // Primeiro busca o relatório do Reportei
        const reportResponse = await fetch(`${process.env.REPORTEI_API_URL}/reports/${req.params.reportId}`);
        const reportData = await reportResponse.json();

        // Analisa o relatório usando GPT-4
        const analysis = await analyzer.analyzeReport(reportData.external_url);

        res.json({
            report: reportData,
            analysis: analysis
        });
    } catch (error) {
        console.error('Erro ao analisar relatório:', error);
        res.status(500).json({ error: 'Erro ao analisar relatório' });
    }
});

module.exports = router;
