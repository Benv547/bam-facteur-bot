module.exports = {
    createChart: async function (labels, datasets) {
        const QuickChart = require('quickchart-js');

        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'line',
                data: {labels: labels, datasets: datasets},
                options: {
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    zeroLineColor: '#7289da',
                                    color: "#7289da"
                                },
                                ticks: {
                                    fontColor: "#7289da",
                                },
                            }
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    zeroLineColor: '#7289da',
                                    color: "#7289da"
                                },
                                ticks: {
                                    fontColor: "#7289da",
                                },
                            }
                        ]
                    },
                    legend: {
                        labels: {
                            fontColor: "#7289da"
                        }
                    }
                }
            })
            .setWidth(800)
            .setHeight(400)
            .setBackgroundColor('transparent');

        // Print the chart URL
        return chart.getUrl();
    },
    setupDataSetFromSQL: function (label, sqlData, newLabel) {
        let data = [];
        for (let i = 0; i < sqlData.length; i++) {
            data.push(sqlData[i][label]);
        }
        dateset = {
            label: newLabel,
            data: data,
        }
        return dateset;
    },
    setupLabelsFromSQL: function (label, sqlData) {
        let labels = [];
        for (let i = 0; i < sqlData.length; i++) {
            labels.push(sqlData[i][label]);
        }
        return labels;
    },
    transformTimestampToDay: function (timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return day + '/' + month + '/' + year;
    },

    createChartForAll: async function (dataBottle, dataMessage, dataUser) {
        let datasets = [];
        const datasetBottle = this.setupDataSetFromSQL('count', dataBottle, 'Bouteilles');
        datasetBottle.borderColor = 'rgb(218,12,193)';
        datasetBottle.fill = false;
        datasets.push(datasetBottle);
        const datasetMessage = this.setupDataSetFromSQL('count', dataMessage, 'Messages');
        datasetMessage.borderColor = 'rgb(132,0,255)';
        datasetMessage.fill = false;
        datasets.push(datasetMessage);
        const datasetUser = this.setupDataSetFromSQL('count', dataUser, 'Utilisateurs');
        datasetUser.borderColor = 'rgb(0,178,255)';
        datasetUser.fill = false;
        datasets.push(datasetUser);
        const labels = this.setupLabelsFromSQL('time', dataBottle);
        return await this.createChart(labels, datasets);
    },
    createChartForSanction: async function (dataBan, dataMute, dataWarn, dataWarnAbus) {
        let datasets = [];
        const datasetBan = this.setupDataSetFromSQL('count', dataBan, 'Bans');
        datasetBan.borderColor = 'rgb(218,12,12)';
        datasetBan.fill = false;
        datasets.push(datasetBan);
        const datasetMute = this.setupDataSetFromSQL('count', dataMute, 'Mutes');
        datasetMute.borderColor = 'rgb(255,128,0)';
        datasetMute.fill = false;
        datasets.push(datasetMute);
        const datasetWarn = this.setupDataSetFromSQL('count', dataWarn, 'Warns');
        datasetWarn.borderColor = 'rgb(255,196,0)';
        datasetWarn.fill = false;
        datasets.push(datasetWarn);
        const datasetWarnAbus = this.setupDataSetFromSQL('count', dataWarnAbus, 'Warns abusifs');
        datasetWarnAbus.borderColor = 'rgb(152,134,66)';
        datasetWarnAbus.fill = false;
        datasets.push(datasetWarnAbus);
        const labels = this.setupLabelsFromSQL('time', dataBan);
        return await this.createChart(labels, datasets);
    },
    createChartForBottle: async function (data) {
        let datasets = [];
        const dataset = this.setupDataSetFromSQL('count', data, 'Bouteilles');
        dataset.borderColor = 'rgb(218,12,193)';
        dataset.backgroundColor = 'rgb(110,7,97)';
        datasets.push(dataset);
        const labels = this.setupLabelsFromSQL('time', data);
        return await this.createChart(labels, datasets);
    },
    createChartForMessage: async function (data) {
        let datasets = [];
        const dataset = this.setupDataSetFromSQL('count', data, 'Messages');
        dataset.borderColor = 'rgb(132,0,255)';
        dataset.backgroundColor = 'rgb(65,0,133)';
        datasets.push(dataset);
        const labels = this.setupLabelsFromSQL('time', data);
        return await this.createChart(labels, datasets);
    },
    createChartForUser: async function (user, vip, boost) {
        let datasets = [];
        const dataset = this.setupDataSetFromSQL('count', user, 'Utilisateurs');
        dataset.borderColor = 'rgb(0,178,255)';
        dataset.fill = false;
        datasets.push(dataset);
        const datasetVip = this.setupDataSetFromSQL('count', vip, 'VIP');
        datasetVip.borderColor = 'rgb(255,255,0)';
        datasetVip.fill = false;
        datasets.push(datasetVip);
        const datasetBoost = this.setupDataSetFromSQL('count', boost, 'Boost');
        datasetBoost.borderColor = 'rgb(244, 127, 255)';
        datasetBoost.fill = false;
        datasets.push(datasetBoost);
        const labels = this.setupLabelsFromSQL('time', user);
        return await this.createChart(labels, datasets);
    }
};