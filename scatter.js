$(function () {
    var chart;
    var searchHistory = [];
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
                    sector: row["Name"],
                    y: parseFloat(String(row["Expenditure"]).replace(/,/g, '')),
                    z: 5,
                    name: row["Sector"],
                })
            }
            var sectorsData = [];
            const keys = Object.keys(sectors);
            keys.forEach((key, index) => {
                sectorsData.push({
                    name: key,
                    data: sectors[key],
                });
            });

            chart = new Highcharts.chart('container', {

                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
                    zoomType: 'xy',
                    events: {
                        load: function () {
                            var chart = this,
                                series = chart.series,
                                points = chart.series[1].points,
                                searchInput = document.getElementById('input');
                            button = document.getElementById('submit');
                            function changeMatches() {
                                var i = j = 0, len = points.length;
                                let re = new RegExp(searchInput.value, 'i');
                                searchHistory.push(re);
                                while (j < series.length) {
                                    len = series[j].points.length;
                                    i = 0;
                                    while (i < len) {
                                        // points[i].update({
                                        //     color: null
                                        // })
                                        if (series[j].points[i] === undefined) {
                                            i++;
                                            console.log(i)
                                            continue;
                                        }
                                        console.log(series[j].points[i].sector);
                                        console.log(re.test(series[j].points[i].sector));
                                        if (re.test(series[j].points[i].sector))
                                        // if (series[j].points[i].sector.includes(searchInput.value)) 
                                        {
                                            series[j].points[i].update({
                                                color: 'red'
                                            })
                                            chart.tooltip.refresh(series[j].points[i])
                                            // break;
                                        }
                                        i++
                                    }
                                    console.log(j)
                                    j++;

                                }

                                // points.forEach(function (point) {
                                //     point.update({
                                //         color: null
                                //     })
                                //     if (point.sector.includes(searchInput.value)) {
                                //         point.update({
                                //             color: 'red'
                                //         })
                                //         chart.tooltip.refresh(point)
                                //     }
                                // })
                            }
                            function clearSearch() {
                                var i = j = k = 0, len;
                                console.log(searchHistory)
                                while (k < searchHistory.length) {
                                    j = 0;
                                    while (j < series.length) {
                                        len = series[j].points.length;
                                        i = 0;
                                        while (i < len) {
                                            console.log(i, j, k)
                                            if (searchHistory[k].test(series[j].points[i].sector)) {
                                                series[j].points[i].update({
                                                    color: null
                                                })
                                                chart.tooltip.refresh(series[j].points[i])
                                            }
                                            i++
                                        }
                                        j++;
                                    }
                                    k++;
                                }

                            }
                            button.addEventListener('click', changeMatches);
                            clearButton = document.getElementById('clear');
                            clearButton.addEventListener('click', clearSearch);
                            // searchInput.addEventListener('keyup', changeMatches);

                        }
                    }

                },

                legend: {
                    enabled: false
                },
                title: {
                    text: 'Total expenditure across sectors'
                },

                subtitle: {
                    text: 'By: Soristic'
                },

                accessibility: {
                    point: {
                        valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.'
                    }
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    layout: 'vertical',
                    x: 0,
                    y: 100
                },
                xAxis: {
                    type: 'category',
                    gridLineWidth: 1,
                    crosshair: {
                        enabled: true
                    },
                    title: {
                        text: 'Sectors'
                    },
                    labels: {
                        format: '{value}'
                    },
                    // plotLines: [{
                    //     color: 'black',
                    //     dashStyle: 'dot',
                    //     width: 2,
                    //     value: 65,
                    //     label: {
                    //         rotation: 0,
                    //         y: 15,
                    //         style: {
                    //             fontStyle: 'italic'
                    //         },
                    //         text: 'Safe fat intake 65g/day'
                    //     },
                    // }],
                    accessibility: {
                        rangeDescription: 'Range: 60 to 100 grams.'
                    }
                },

                yAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    min: 10000,

                    title: {
                        text: 'Total Expenditure'
                    },
                    labels: {
                        formatter: function (amount, decimalCount = 0, decimal = ".", thousands = ",") {
                            try {
                                decimalCount = Math.abs(decimalCount);
                                decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

                                const negativeSign = this.value < 0 ? "-" : "";

                                let i = parseInt(this.value = Math.abs(Number(this.value) || 0).toFixed(decimalCount)).toString();
                                let j = (i.length > 3) ? i.length % 3 : 0;
                                return "$" + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(this.value - i).toFixed(decimalCount).slice(2) : "");
                            } catch (e) {
                                console.log(e)
                            }
                        },
                        // format: '${value}'
                    },
                    // maxPadding: 0.2,
                    // plotLines: [{
                    //     color: 'black',
                    //     dashStyle: 'dot',
                    //     width: 2,
                    //     value: 50,
                    //     label: {
                    //         align: 'right',
                    //         style: {
                    //             fontStyle: 'italic'
                    //         },
                    //         text: 'Safe sugar intake 50g/day',

                    //     },
                    // }],
                    accessibility: {
                        rangeDescription: 'Range: 0 to 160 grams.'
                    }
                },

                tooltip: {
                    useHTML: true,
                    headerFormat: '<table>',
                    pointFormat: '<tr><th colspan="2"><small>{point.sector}</small></th></tr>' +
                        '<tr><th>$</th><td>{point.y}</td></tr>',
                    footerFormat: '</table>',
                    followPointer: true,
                    outside: true,
                    split: true,

                },

                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: false,
                            format: '{point.sector}'

                        },
                        allowPointSelect: true,
                        jitter: {
                            x: 0.3,
                            y: 0
                        },
                        maxSize: 30,
                    }
                },

                series: sectorsData,
                // [{
                //     data: [
                //         { y: 95, name: 'BE', country: 'Belgium' },
                //         { y: 195, name: 'BE', country: 'Belgium' },
                //         { y: 102.9, name: 'DE', country: 'Germany' },
                //         { y: 91.5, name: 'FI', country: 'Finland' },
                //         { y: 102.5, name: 'NL', country: 'Netherlands' },
                //         { y: 86.1, name: 'SE', country: 'Sweden' },

                //     ]
                // }]

            });
        });
        let btn = document.getElementById("btn")

        btn.addEventListener('click', function () {
            Highcharts.FullScreen = function (container) {
                this.init(container.parentNode); // main div of the chart
            };

            Highcharts.FullScreen.prototype = {
                init: function (container) {
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.mozRequestFullScreen) {
                        container.mozRequestFullScreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        container.msRequestFullscreen();
                    }
                }
            };
            chart.fullscreen = new Highcharts.FullScreen(chart.container);
        })

    }


    );

});