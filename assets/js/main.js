// assets/js/main.js

// Option 1 : Retirez l'enregistrement manuel si le plugin s'enregistre automatiquement
// Chart.register(ChartAnnotation); // Commenté

document.addEventListener('DOMContentLoaded', () => {
    if (!validateDataProject()) {
        console.error('Validation de dataProject échouée. Abandon de l\'initialisation des graphiques.');
        return;
    }
    initOverallProgressChart();
    initKpiCharts();
    initTaskProgress();
    initScenarios();
    initTabs();
});

/**
 * Valide la structure de l'objet dataProject.
 * @returns {boolean} Retourne true si valide, sinon false.
 */
function validateDataProject() {
    if (!dataProject) {
        console.error('dataProject est undefined.');
        return false;
    }
    if (!dataProject.overallProjectAdvancement) {
        console.error('dataProject.overallProjectAdvancement est undefined.');
        return false;
    }
    if (!dataProject.overallProjectAdvancement.budget) {
        console.error('dataProject.overallProjectAdvancement.budget est undefined.');
        return false;
    }
    if (!dataProject.overallProjectAdvancement.manDays) {
        console.error('dataProject.overallProjectAdvancement.manDays est undefined.');
        return false;
    }
    if (!dataProject.roi) {
        console.error('dataProject.roi est undefined.');
        return false;
    }
    if (!dataProject.scenarios || !Array.isArray(dataProject.scenarios)) {
        console.error('dataProject.scenarios est undefined ou n\'est pas un tableau.');
        return false;
    }
    // Ajoutez d'autres validations si nécessaire
    return true;
}

/**
 * Crée un graphique Chart.js.
 * @param {string} ctxId - L'ID du contexte canvas.
 * @param {string} type - Le type de graphique.
 * @param {object} data - Les données du graphique.
 * @param {object} options - Les options du graphique.
 * @returns {Chart|null} Retourne l'instance du graphique ou null si échec.
 */
function createChart(ctxId, type, data, options) {
    const ctx = document.getElementById(ctxId);
    if (!ctx) {
        console.warn(`Canvas avec l'ID '${ctxId}' non trouvé.`);
        // Afficher un message d'erreur si nécessaire
        const errorElement = document.getElementById(`${ctxId}Error`);
        if (errorElement) {
            errorElement.style.display = 'block';
        }
        return null;
    }
    return new Chart(ctx, {
        type,
        data,
        options
    });
}

/**
 * Initialize the Overall Progress Chart.
 */
function initOverallProgressChart() {
    const overallProgress = (dataProject.overallProjectAdvancement.manDays.realConsumption / 
                            dataProject.overallProjectAdvancement.manDays.newTotal) * 100;

    const data = {
        datasets: [{
            data: [overallProgress, 100 - overallProgress],
            backgroundColor: ['#28a745', '#ddd'],
            borderWidth: 0
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        rotation: -90 * Math.PI / 180,
        circumference: 180 * Math.PI / 180,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        animation: {
            duration: 1000, // Animation pour le remplissage
            easing: 'easeOutBounce'
        }
    };

    createChart('overallProgressChart', 'doughnut', data, options);

    // Update the label
    const label = document.getElementById('overallProgressLabel');
    if (label) {
        label.textContent = `${overallProgress.toFixed(2)}%`;
    }
}

/**
 * Initialize the KPI Charts (Budget, Man-Days, ROI Comparison).
 */
function initKpiCharts() {
    // Budget Variation Chart
    const budgetData = {
        labels: ['Consumed', 'Remaining', 'Variation'],
        datasets: [{
            label: 'Budget (€)',
            data: [
                dataProject.overallProjectAdvancement.budget.realConsumption,
                dataProject.overallProjectAdvancement.budget.remaining,
                dataProject.overallProjectAdvancement.budget.variation
            ],
            backgroundColor: [
                '#28a745', // Consumed - Green
                '#ffc107', // Remaining - Amber
                '#dc3545'  // Variation - Red
            ]
        }]
    };

    const budgetOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        if (context.label === 'Consumed') {
                            return `${label}: €${value} (${(value / dataProject.overallProjectAdvancement.budget.newTotal * 100).toFixed(1)}%)`;
                        } else if (context.label === 'Remaining') {
                            return `${label}: €${value} (${(value / dataProject.overallProjectAdvancement.budget.newTotal * 100).toFixed(1)}%)`;
                        } else if (context.label === 'Variation') {
                            return `${label} Variation: €${value}`;
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '€' + value;
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutBounce'
        }
    };

    createChart('budgetVariationChart', 'bar', budgetData, budgetOptions);

    // Update Budget Percentage Labels
    const budgetConsumed = dataProject.overallProjectAdvancement.budget.realConsumption;
    const budgetRemaining = dataProject.overallProjectAdvancement.budget.remaining;
    const budgetTotal = dataProject.overallProjectAdvancement.budget.newTotal;

    document.getElementById('budgetConsumedLabel').textContent = `${((budgetConsumed / budgetTotal) * 100).toFixed(0)}% Consumed`;
    document.getElementById('budgetRemainingLabel').textContent = `${((budgetRemaining / budgetTotal) * 100).toFixed(0)}% Remaining`;

    // Man-Days Variation Chart
    const manDaysData = {
        labels: ['Consumed', 'Remaining', 'Variation'],
        datasets: [{
            label: 'Man-Days',
            data: [
                dataProject.overallProjectAdvancement.manDays.realConsumption,
                dataProject.overallProjectAdvancement.manDays.remaining,
                dataProject.overallProjectAdvancement.manDays.variation
            ],
            backgroundColor: [
                '#28a745', // Consumed - Green
                '#ffc107', // Remaining - Amber
                '#dc3545'  // Variation - Red
            ]
        }]
    };

    const manDaysOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        if (context.label === 'Consumed') {
                            return `${label}: ${value} (${((value / dataProject.overallProjectAdvancement.manDays.newTotal) * 100).toFixed(1)}%)`;
                        } else if (context.label === 'Remaining') {
                            return `${label}: ${value} (${((value / dataProject.overallProjectAdvancement.manDays.newTotal) * 100).toFixed(1)}%)`;
                        } else if (context.label === 'Variation') {
                            return `${label} Variation: ${value}`;
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 50
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutBounce'
        }
    };

    createChart('manDaysVariationChart', 'bar', manDaysData, manDaysOptions);

    // Update Man-Days Percentage Labels
    const manDaysConsumed = dataProject.overallProjectAdvancement.manDays.realConsumption;
    const manDaysRemaining = dataProject.overallProjectAdvancement.manDays.remaining;
    const manDaysTotal = dataProject.overallProjectAdvancement.manDays.newTotal;

    document.getElementById('manDaysConsumedLabel').textContent = `${((manDaysConsumed / manDaysTotal) * 100).toFixed(0)}% Consumed`;
    document.getElementById('manDaysRemainingLabel').textContent = `${((manDaysRemaining / manDaysTotal) * 100).toFixed(0)}% Remaining`;

    // ROI Comparison Chart
    const roiData = {
        labels: ['Initial ROI', 'Real ROI'],
        datasets: [{
            label: 'ROI (%)',
            data: [dataProject.roi.initial, dataProject.roi.real],
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: function(context) {
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                return value < 80 ? '#dc3545' : '#28a745'; // Red for ROI < 80%, Green otherwise
            },
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: function(context) {
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                return value < 80 ? '#dc3545' : '#28a745';
            }
        }]
    };

    const roiOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        return `${label}: ${value}%`;
                    }
                }
            },
            annotation: {
                annotations: {
                    criticalROI: {
                        type: 'line',
                        yMin: 80,
                        yMax: 80,
                        borderColor: '#dc3545',
                        borderWidth: 2,
                        label: {
                            enabled: true,
                            content: 'Critical ROI Drop',
                            position: 'end',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            font: {
                                weight: 'bold' // Correction ici
                            },
                            padding: 6
                        }
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutBounce'
        }
    };

    createChart('roiComparisonChart', 'line', roiData, roiOptions);
}

/**
 * Initialize the Task Progress Bars (Back Office & Front Office).
 */
function initTaskProgress() {
    const container = document.getElementById('taskProgressContainer');
    if (!container) {
        console.warn("Task Progress Container not found.");
        return;
    }

    const allLots = [
        ...dataProject.backOffice.lots,
        {
            name: 'Front Office',
            progress: dataProject.frontOffice.progress,
            manDays: dataProject.frontOffice.manDays
        }
    ];

    allLots.forEach(lot => {
        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-bar-container');

        const title = document.createElement('span');
        title.classList.add('progress-title');
        title.textContent = `${lot.name} Completion`;

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');

        const progress = document.createElement('div');
        // Define class based on state
        if (lot.progress === 100) {
            progress.classList.add('progress', 'task-complete');
        } else if (lot.progress > 0 && lot.progress < 100) {
            progress.classList.add('progress', 'task-in-progress');
        } else {
            progress.classList.add('progress', 'task-delayed');
        }
        progress.style.setProperty('--progress-width', `${lot.progress}%`);
        progress.style.width = `${lot.progress}%`;
        progress.textContent = `${lot.progress}%`;
        progress.setAttribute('data-progress', lot.progress); // Pour l'affichage via CSS

        // Add tooltip via title attribute
        progress.title = `Man-Days Consumed: ${lot.manDays.realConsumption}, Remaining: ${lot.manDays.remaining}`;

        progressBar.appendChild(progress);
        progressContainer.appendChild(title);
        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);
    });
}

/**
 * Initialize the ROI Charts in Scenarios.
 */
function initScenarios() {
    dataProject.scenarios.forEach(scenario => {
        const roiCanvas = document.getElementById(`${scenario.id}ROI`);
        if (roiCanvas) { // Check if the canvas exists
            const roiCtx = roiCanvas.getContext('2d');
            new Chart(roiCtx, {
                type: 'line', // Using a line chart
                data: {
                    labels: scenario.roiData.labels, // Fictitious dates
                    datasets: [{
                        label: 'ROI (%)',
                        data: scenario.roiData.values, // Fictitious ROI values
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        fill: false,
                        tension: 0.1,
                        pointBackgroundColor: function(context) {
                            const index = context.dataIndex;
                            const value = context.dataset.data[index];
                            return value < 80 ? '#dc3545' : '#28a745'; // Red for ROI < 80%, Green otherwise
                        },
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: function(context) {
                            const index = context.dataIndex;
                            const value = context.dataset.data[index];
                            return value < 80 ? '#dc3545' : '#28a745';
                        }
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y || 0;
                                    return `${label}: ${value}%`;
                                }
                            }
                        },
                        annotation: {
                            annotations: {
                                criticalROI: {
                                    type: 'line',
                                    yMin: 80,
                                    yMax: 80,
                                    borderColor: '#dc3545',
                                    borderWidth: 2,
                                    label: {
                                        enabled: true,
                                        content: 'Critical ROI Drop',
                                        position: 'end',
                                        backgroundColor: '#dc3545',
                                        color: '#fff',
                                        font: {
                                            weight: 'bold' // Correction ici
                                        },
                                        padding: 6
                                    }
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutBounce'
                    }
                }
            });
        } else {
            console.warn(`Canvas avec l'ID '${scenario.id}ROI' non trouvé.`);
            // Optionnel : Afficher un message explicatif si le graphique est intentionnellement absent
            const scenarioPanel = document.getElementById(scenario.id);
            if (scenarioPanel) {
                const message = document.createElement('p');
                message.textContent = "ROI non applicable pour ce scénario.";
                scenarioPanel.appendChild(message);
            }
        }
    });
}

/**
 * Initialize the Tab Functionality.
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Hide all panels
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');
            // Show corresponding panel
            const targetPanel = document.getElementById(target);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}
