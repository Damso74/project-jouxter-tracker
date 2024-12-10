// assets/js/data.js

const dataProject = {
    // Back Office Data
    backOffice: {
        lots: [
            {
                name: 'Lot 1',
                progress: 50,
                manDays: {
                    realConsumption: 60,
                    remaining: 60,
                    initialTotal: 100,
                    newTotal: 120,
                    variation: 20 // Converted to number
                }
            },
            {
                name: 'Lot 2',
                progress: 15,
                manDays: {
                    realConsumption: 10,
                    remaining: 55,
                    initialTotal: 50,
                    newTotal: 65,
                    variation: 30 // Converted to number
                }
            }
        ]
    },
    // Front Office Data
    frontOffice: {
        progress: 100,
        manDays: {
            realConsumption: 60,
            remaining: 0,
            initialTotal: 45,
            newTotal: 45,
            variation: 0 // Converted to number
        }
    },
    // Overall Project Advancement
    overallProjectAdvancement: {
        manDays: {
            realConsumption: 130,
            remaining: 115,
            initialTotal: 195,
            newTotal: 245,
            variation: 25.6 // Converted to number
        },
        budget: {
            realConsumption: 54600, // Consumed
            remaining: 48300,       // Remaining
            initialTotal: 81900,    // Initial Total
            newTotal: 102900,       // New Total
            variation: 21000        // Converted to number
        }
    },
    // ROI Data
    roi: {
        initial: 91.84,
        real: 72.69
    },
    // Scenarios Data with Fictitious Monthly ROI Data
    scenarios: [
        {
            id: 'scenario1',
            title: 'Scenario 1 - Project Finish in 36 Weeks',
            roi: 80, // Current ROI value
            ganttImage: 'assets/img/gantt1.png',
            totalAdditionalCost: '21,000.00 €',
            additionalCostForYou: '8,400.00 € (20 Days Due to Scope Changes)',
            roiData: {
                labels: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                values: [70, 72, 75, 78, 80, 82, 85, 87, 90, 92, 95, 98]
            }
        },
        {
            id: 'scenario2',
            title: 'Scenario 2 - Project Finish in 29 Weeks',
            roi: 85, // Current ROI value
            ganttImage: 'assets/img/gantt2.png',
            totalAdditionalCost: '35,700.00 €',
            additionalCostForYou: '23,100.00 € (+1 Developer for 7 Weeks)',
            roiData: {
                labels: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                values: [75, 77, 80, 82, 85, 88, 90, 92, 94, 95, 96, 98]
            }
        },
        {
            id: 'scenario3',
            title: 'Scenario 3 - Project Finish in 26 Weeks',
            roi: 90, // Current ROI value
            ganttImage: 'assets/img/gantt3.png',
            totalAdditionalCost: '42,000.00 €',
            additionalCostForYou: '29,400.00 € (+2 Developers for a Total of 10 Weeks)',
            roiData: {
                labels: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                values: [80, 82, 85, 87, 90, 92, 94, 96, 97, 98, 99, 100]
            }
        }
    ]
};
