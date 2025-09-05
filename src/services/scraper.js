const puppeteer = require('puppeteer');

async function scrapeReport(url) {
    // Lista de user agents comuns
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0'
    ];
    
    const browser = await puppeteer.launch({
        headless: false, // Mudando para modo visível para evitar detecção
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled', // Desativa flag de automação
            '--window-size=1920,1080' // Resolução de tela realista
        ],
        ignoreHTTPSErrors: true,
        timeout: 60000,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    try {
        const page = await browser.newPage();

        // Escolhe um user agent aleatório
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        await page.setUserAgent(userAgent);
        
        // Configura o WebDriver para parecer um navegador normal
        await page.evaluateOnNewDocument(() => {
            // Remover webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });

            // Remover outras flags de automação
            window.navigator.chrome = {
                runtime: {}
            };

            // Adicionar propriedades que existem em navegadores reais
            Object.defineProperty(navigator, 'languages', {
                get: () => ['pt-BR', 'pt', 'en-US', 'en']
            });
            
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    {
                        0: {type: "application/x-google-chrome-pdf"},
                        description: "Portable Document Format",
                        filename: "internal-pdf-viewer",
                        length: 1,
                        name: "Chrome PDF Plugin"
                    }
                ]
            });
        });

        // Configura autenticação
        await page.setExtraHTTPHeaders({
            'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys',
            'X-Requested-With': 'XMLHttpRequest',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        });

        // Configure cookies e localStorage para autenticação
        await page.setCookie({
            name: 'token',
            value: 'JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys',
            domain: 'app.reportei.com',
            path: '/'
        });

        // Aumentar o timeout da página
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(60000);

        // Configurar interceptação única para autenticação e otimização
        await page.setRequestInterception(true);
        page.on('request', request => {
            // Adicionar headers de autenticação
            const headers = {
                ...request.headers(),
                'Authorization': 'Bearer JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys',
                'Cookie': `token=JRqzu0bOWhfOWekpuieXiiX06dfZtyp3zyCW5Sys`,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            };

            // Bloquear recursos não essenciais
            if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue({ headers });
            }
        });

        console.log('Iniciando navegação para:', url);
        
        // Função para verificar se a página está realmente carregada
        const isPageLoaded = async () => {
            return await page.evaluate(() => {
                // Verifica se elementos críticos existem
                const hasContent = document.body.innerHTML.length > 100;
                const hasReportElements = document.querySelector('.report-container, .analytics-container, .dashboard-container, .metrics-container, .chart-container');
                const isLoading = document.querySelector('.loading, .spinner, .loader');
                
                console.log('Estado da página:', {
                    hasContent,
                    hasReportElements: !!hasReportElements,
                    isLoading: !!isLoading
                });

                return hasContent && hasReportElements && !isLoading;
            });
        };

        let retries = 5; // Aumentando número de tentativas
        let response;
        
        while (retries > 0) {
            try {
                console.log(`Tentativa ${6-retries} de carregar a página...`);
                
                // Primeira etapa: Carregar o DOM básico
                response = await page.goto(url, { 
                    waitUntil: 'domcontentloaded',
                    timeout: 30000 
                });

                console.log('DOM inicial carregado, aguardando conteúdo...');

                // Segunda etapa: Aguardar conteúdo dinâmico
                let contentLoaded = false;
                for (let i = 0; i < 10; i++) {
                    if (await isPageLoaded()) {
                        contentLoaded = true;
                        console.log('Conteúdo detectado com sucesso!');
                        break;
                    }
                    console.log(`Aguardando conteúdo (tentativa ${i + 1}/10)...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

                if (!contentLoaded) {
                    throw new Error('Timeout aguardando conteúdo dinâmico');
                }

                break;
            } catch (error) {
                console.log(`Tentativa ${6-retries} falhou:`, error.message);
                retries--;
                if (retries === 0) throw new Error(`Falha ao carregar página após 5 tentativas: ${error.message}`);
                console.log('Aguardando antes da próxima tentativa...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (!response.ok()) {
            throw new Error(`Falha ao carregar página: ${response.status()} ${response.statusText()}`);
        }

        console.log('Página carregada, aguardando elementos...');
        
        // Verificar estado final da página
        console.log('Verificando elementos específicos...');
        
        const selectors = [
            '.report-container',
            '.analytics-container', 
            '.dashboard-container',
            '.metrics-container',
            '.chart-container',
            '.report-content',
            '.data-container',
            '.content-wrapper'
        ];

        // Verificar quais elementos estão presentes
        const elements = await page.evaluate((selectors) => {
            return selectors.map(selector => {
                const el = document.querySelector(selector);
                return {
                    selector,
                    exists: !!el,
                    visible: el ? (el.offsetParent !== null) : false,
                    content: el ? el.textContent.slice(0, 50) : null
                };
            });
        }, selectors);

        console.log('Estado dos elementos:', JSON.stringify(elements, null, 2));

        // Verificar se pelo menos um elemento importante está presente
        const hasValidElement = elements.some(el => el.exists && el.visible);
        if (!hasValidElement) {
            throw new Error('Nenhum elemento válido encontrado na página');
        }

        console.log('Página carregada com sucesso!');

        // Aguardar um pouco mais para garantir que tudo carregou
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar se a página carregou completamente
        const content = await page.content();
        if (!content.includes('report') && !content.includes('analytics')) {
            throw new Error('Página não carregou corretamente');
        }

        console.log('Página carregada, iniciando extração de dados...');

        // Tirar screenshot para debug
        await page.screenshot({ path: 'report-debug.png' });

        // Extrai os dados do relatório
        const reportData = await page.evaluate(() => {
            console.log('Executando script de extração...');
            // Função auxiliar para extrair números de textos
            const extractNumber = (text) => {
                const number = text.match(/[\d,.]+/);
                return number ? parseFloat(number[0].replace(/[,.]/g, '')) : 0;
            };

            // Extrai métricas principais
            const metrics = {
                pageviews: 0,
                users: 0,
                conversion_rate: 0,
                avg_time: 0
            };

            // Tenta encontrar os valores das métricas em diferentes elementos
            document.querySelectorAll('.metric-card, .stats-card, .analytics-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes('visualizações') || text.includes('pageviews')) {
                    metrics.pageviews = extractNumber(text);
                } else if (text.includes('usuários') || text.includes('users')) {
                    metrics.users = extractNumber(text);
                } else if (text.includes('conversão') || text.includes('conversion')) {
                    metrics.conversion_rate = extractNumber(text);
                } else if (text.includes('tempo') || text.includes('duration')) {
                    metrics.avg_time = extractNumber(text);
                }
            });

            // Extrai dados de timeline (últimos 30 dias por padrão)
            const timeline = {
                dates: [],
                views: []
            };

            // Tenta encontrar o gráfico de timeline
            const chartElements = document.querySelectorAll('.chart-container, .graph-container');
            chartElements.forEach(chart => {
                if (chart.textContent.toLowerCase().includes('visualizações') || 
                    chart.textContent.toLowerCase().includes('pageviews')) {
                    // Tenta extrair dados do gráfico
                    // Isso pode variar dependendo de como o gráfico é implementado
                    const dataPoints = chart.querySelectorAll('.data-point, .chart-point');
                    dataPoints.forEach(point => {
                        if (point.dataset.date && point.dataset.value) {
                            timeline.dates.push(point.dataset.date);
                            timeline.views.push(parseInt(point.dataset.value));
                        }
                    });
                }
            });

            // Extrai fontes de tráfego
            const trafficSources = {};
            document.querySelectorAll('.traffic-source, .source-card').forEach(source => {
                const sourceText = source.textContent.toLowerCase();
                if (sourceText.includes('direto') || sourceText.includes('direct')) {
                    trafficSources.direct = extractNumber(sourceText);
                } else if (sourceText.includes('orgânico') || sourceText.includes('organic')) {
                    trafficSources.organic = extractNumber(sourceText);
                } else if (sourceText.includes('social')) {
                    trafficSources.social = extractNumber(sourceText);
                } else if (sourceText.includes('referência') || sourceText.includes('referral')) {
                    trafficSources.referral = extractNumber(sourceText);
                }
            });

            // Extrai top páginas
            const topPages = [];
            document.querySelectorAll('.page-item, .top-page').forEach(page => {
                const url = page.querySelector('.page-url, .url')?.textContent;
                const views = extractNumber(page.querySelector('.page-views, .views')?.textContent || '0');
                if (url) {
                    topPages.push({ url, pageviews: views });
                }
            });

            return {
                metrics,
                timeline,
                traffic_sources: trafficSources,
                top_pages: topPages
            };
        });

        console.log('Dados extraídos:', reportData);
        console.log('Extração concluída!');
        return reportData;

    } catch (error) {
        console.error('Erro ao fazer scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeReport };
