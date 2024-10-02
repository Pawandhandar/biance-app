// Import required libraries
// import { WebSocket } from 'ws';
const WebSocket = require('ws');
const Chart = require('chart.js');

// Set up WebSocket connection
const socket = new WebSocket('wss://stream.binance.com:9443/ws');

// Set up chart
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'candlestick',
    data: {
        datasets: [{
            label: 'Candlestick Chart',
            data: []
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

// Set up coin toggle
const coinToggle = document.getElementById('coin-toggle');
const intervalToggle = document.getElementById('interval-toggle');
const chartTypeToggle = document.getElementById('chart-type-toggle');

// Set up local storage
const localStorage = window.localStorage;

// Function to handle WebSocket data
function handleData(data) {
    const symbol = coinToggle.value;
    const interval = intervalToggle.value;
    const chartData = JSON.parse(data);

    // Check if chart data is for the current symbol and interval
    if (chartData.stream === `${symbol}@kline_${interval}`) {
        // Update chart data
        chart.data.datasets[0].data.push({
            x: chartData.data.k.t,
            o: chartData.data.k.o,
            h: chartData.data.k.h,
            l: chartData.data.k.l,
            c: chartData.data.k.c
        });

        // Update chart
        chart.update();

        // Store chart data in local storage
        const storedData = localStorage.getItem(`${symbol}_${interval}`);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            parsedData.push(chartData.data.k);
            localStorage.setItem(`${symbol}_${interval}`, JSON.stringify(parsedData));
        } else {
            localStorage.setItem(`${symbol}_${interval}`, JSON.stringify([chartData.data.k]));
        }
    }
}

// Function to handle coin toggle change
function handleCoinToggleChange() {
    const symbol = coinToggle.value;
    const interval = intervalToggle.value;

    // Get stored chart data from local storage
    const storedData = localStorage.getItem(`${symbol}_${interval}`);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        chart.data.datasets[0].data = parsedData.map((data) => ({
            x: data.t,
            o: data.o,
            h: data.h,
            l: data.l,
            c: data.c
        }));
        chart.update();
    }

    // Subscribe to new symbol
    socket.send(`{"method":"SUBSCRIBE","params":["${symbol}@kline_${interval}"],"id":1}`);
}

// Function to handle interval toggle change
function handleIntervalToggleChange() {
    const symbol = coinToggle.value
}