const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sensorData, updateSensorData } = require('./data/sensorData');
const { saveSensorData, getSensorData, getLatestSensorData } = require('./data/db');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    const page = 1;
    const pageSize = 10;
    const { sensorDataList, totalPages } = await getSensorData(page, pageSize);
    res.render('index', { sensorData, sensorDataList, page, totalPages });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('sensorData', sensorData);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('changePage', async (data) => {
        const page = parseInt(data.page) || 1;
        const pageSize = 10;
        const { sensorDataList, totalPages } = await getSensorData(page, pageSize);
        socket.emit('updateDatabase', { sensorDataList, totalPages, page });
    });

    socket.on('requestSensorData', async () => {
        const page = 1;
        const pageSize = 10;
        const { sensorDataList, totalPages } = await getSensorData(page, pageSize);
        io.emit('updateDatabase', { sensorDataList, totalPages, page });
    });

    socket.on('requestChartData', async () => {
        const chartData = await getLatestSensorData(15);
        socket.emit('updateChart', chartData.reverse());
    });
});

app.post('/api/sensor', async (req, res) => {
    updateSensorData(req.body);
    io.emit('sensorData', sensorData);
    console.log(sensorData)

    await saveSensorData(req.body);

    const chartData = await getLatestSensorData(29);
    io.emit('updateChart', chartData.reverse());

    res.status(200).send('Data received successfully');
});

http.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});