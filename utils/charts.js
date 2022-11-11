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
    setupDataSetFromSQL: function (label, sqlData, newLabel, labels) {
        let data = [];
        for (let y = 0; y < labels.length; y++) {
            const found = sqlData.find(element => element['time'] === labels[y]);
            if (found) {
                data.push(found[label]);
            } else {
                data.push(0);
            }
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
        const labels = this.setupLabelsFromSQL('time', dataBottle);
        const datasetBottle = this.setupDataSetFromSQL('count', dataBottle, 'Bouteilles', labels);
        datasetBottle.borderColor = 'rgb(218,12,193)';
        datasetBottle.fill = false;
        datasets.push(datasetBottle);
        const datasetMessage = this.setupDataSetFromSQL('count', dataMessage, 'Messages', labels);
        datasetMessage.borderColor = 'rgb(132,0,255)';
        datasetMessage.fill = false;
        datasets.push(datasetMessage);
        const datasetUser = this.setupDataSetFromSQL('count', dataUser, 'Utilisateurs', labels);
        datasetUser.borderColor = 'rgb(0,178,255)';
        datasetUser.fill = false;
        datasets.push(datasetUser);
        return await this.createChart(labels, datasets);
    },
    createChartForSanction: async function (dataBan, dataMute, dataWarn, dataWarnAbus) {
        let datasets = [];
        const labels = this.setupLabelsFromSQL('time', dataBan);
        const datasetBan = this.setupDataSetFromSQL('count', dataBan, 'Bans', labels);
        datasetBan.borderColor = 'rgb(218,12,12)';
        datasetBan.fill = false;
        datasets.push(datasetBan);
        const datasetMute = this.setupDataSetFromSQL('count', dataMute, 'Mutes', labels);
        datasetMute.borderColor = 'rgb(255,128,0)';
        datasetMute.fill = false;
        datasets.push(datasetMute);
        const datasetWarn = this.setupDataSetFromSQL('count', dataWarn, 'Warns', labels);
        datasetWarn.borderColor = 'rgb(255,196,0)';
        datasetWarn.fill = false;
        datasets.push(datasetWarn);
        const datasetWarnAbus = this.setupDataSetFromSQL('count', dataWarnAbus, 'Warns abusifs', labels);
        datasetWarnAbus.borderColor = 'rgb(152,134,66)';
        datasetWarnAbus.fill = false;
        datasets.push(datasetWarnAbus);
        return await this.createChart(labels, datasets);
    },
    createChartForBottle: async function (data, archived, terminated) {
        let datasets = [];
        const labels = this.setupLabelsFromSQL('time', data);
        const dataset = this.setupDataSetFromSQL('count', data, 'Bouteilles', labels);
        dataset.borderColor = 'rgb(218,12,193)';
        dataset.backgroundColor = 'rgba(110,7,97, .25)';
        datasets.push(dataset);
        const datasetArchived = this.setupDataSetFromSQL('count', archived, 'Archivées', labels);
        datasetArchived.borderColor = 'rgb(215,66,84)';
        datasetArchived.backgroundColor = 'rgba(215,66,84, .25)';
        datasets.push(datasetArchived);
        const datasetTerminated = this.setupDataSetFromSQL('count', terminated, 'Terminées', labels);
        datasetTerminated.borderColor = 'rgb(155,27,27)';
        datasetTerminated.backgroundColor = 'rgba(155,27,27, .25)';
        datasets.push(datasetTerminated);
        return await this.createChart(labels, datasets);
    },
    createChartForMessage: async function (data) {
        let datasets = [];
        const labels = this.setupLabelsFromSQL('time', data);
        const dataset = this.setupDataSetFromSQL('count', data, 'Messages', labels);
        dataset.borderColor = 'rgb(132,0,255)';
        dataset.backgroundColor = 'rgb(65,0,133)';
        datasets.push(dataset);
        return await this.createChart(labels, datasets);
    },
    createChartForUser: async function (user, vip, boost) {
        let datasets = [];
        const labels = this.setupLabelsFromSQL('time', user);
        const dataset = this.setupDataSetFromSQL('count', user, 'Utilisateurs', labels);
        dataset.borderColor = 'rgb(0,178,255)';
        dataset.fill = false;
        datasets.push(dataset);
        const datasetVip = this.setupDataSetFromSQL('count', vip, 'VIP', labels);
        datasetVip.borderColor = 'rgb(255,255,0)';
        datasetVip.fill = false;
        datasets.push(datasetVip);
        const datasetBoost = this.setupDataSetFromSQL('count', boost, 'Boost', labels);
        datasetBoost.borderColor = 'rgb(244, 127, 255)';
        datasetBoost.fill = false;
        datasets.push(datasetBoost);
        return await this.createChart(labels, datasets);
    }
};