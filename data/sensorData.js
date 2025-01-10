const sensorData = {
    lastUpdateTime: new Date().toISOString(),
    smoke_value: 0,
    fire_value: 0,
    pump_state: false,
    buzzer_state: false,
};

function updateSensorData(newData) {
    const now = new Date();
    const formattedDate = now.toLocaleString('vi-VN', { hour12: false }).replace(',', '');
    sensorData.lastUpdateTime = formattedDate;
    sensorData.smoke_value = newData.smoke_value !== undefined ? newData.smoke_value : sensorData.smoke_value;
    sensorData.fire_value = newData.fire_value ?? sensorData.fire_value;
    sensorData.pump_state = newData.pump_state !== undefined ? newData.pump_state : sensorData.pump_state;
    sensorData.buzzer_state = newData.buzzer_state !== undefined ? newData.buzzer_state : sensorData.buzzer_state;
}

module.exports = {
    sensorData,
    updateSensorData,
};