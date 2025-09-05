const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

class ReportAnalyzer {
    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);
    }

    async analyzeReport(reportUrl) {
        try {
            // Faz o fetch do conteúdo do relatório
            const reportContent = await this.fetchReportContent(reportUrl);

            // Analisa o relatório usando GPT-4
            const analysis = await this.openai.createCompletion({
                model: "gpt-4-turbo-preview",
                messages: [{
                    role: "system",
                    content: "Você é um analista especializado em marketing digital e análise de dados."
                }, {
                    role: "user",
                    content: `Analise este relatório e extraia os principais insights: ${reportContent}`
                }],
                temperature: 0.7,
                max_tokens: 1500
            });

            return this.formatAnalysis(analysis.data.choices[0].message.content);
        } catch (error) {
            console.error('Erro ao analisar relatório:', error);
            throw error;
        }
    }

    async fetchReportContent(reportUrl) {
        try {
            const response = await fetch(reportUrl);
            if (!response.ok) {
                throw new Error('Falha ao buscar o relatório');
            }
            return await response.text();
        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
            throw error;
        }
    }

    formatAnalysis(analysisText) {
        // Estrutura os insights em um formato adequado para o dashboard
        return {
            insights: analysisText.split('\n').filter(line => line.trim()),
            timestamp: new Date().toISOString(),
            source: 'GPT-4'
        };
    }
}

module.exports = ReportAnalyzer;
