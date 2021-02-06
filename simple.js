$(function () {
    var chart;
    $(document).ready(function () {
        $.get('./test.csv', function (csvString) {
            var rows = Papa.parse(csvString, { header: true }).data;
            var sectors = {
                "Arts and Heritage": [],
                "Community": [],
                "Education": [],
                "Health": [],
                "Others": [],
                "Social and Welfare": [],
                "Sports": [],
            }

            for (const row of rows) {
                (sectors[String(row["Sector"])]).push({
                    name: row["Name"],
                    value: parseFloat(String(row["Expenditure"]).replace(/,/g, '')),
                })
            }
            var sectorsData = [];
            const keys = Object.keys(sectors);
            keys.forEach((key, _) => {
                sectorsData.push({
                    name: key,
                    data: sectors[key],
                });
            });


            chart = new Highcharts.chart('container', {
                chart: {
                    type: 'packedbubble',
                    height: '50%',
                },
                title: {
                    text: 'Visualizing Charity Expenditure In Various Sectors'
                },
                tooltip: {
                    useHTML: true,
                    pointFormat: '<b>{point.name}:</b> ${point.value}'
                },

                plotOptions: {
                    packedbubble: {
                        useSimulation: false,
                        minSize: '30%',
                        maxSize: '100%',
                        zMin: 0,
                        zMax: 300000000,

                        layoutAlgorithm: {
                            gravitationalConstant: 0.2,
                            splitSeries: true,
                            seriesInteraction: false,
                            dragBetweenSeries: false,
                            parentNodeLimit: true,
                        },
                        dataLabels: {
                            enabled: false,
                            format: '{point.name}',
                            filter: {
                                property: 'y',
                                operator: '>',
                                value: 900000000
                            },
                            style: {
                                color: 'black',
                                textOutline: 'none',
                                fontWeight: 'normal',
                            },

                        },
                    }
                },
                series: sectorsData,

            });
        });
    });

});