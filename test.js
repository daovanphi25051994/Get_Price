const axios = require('axios');

async function getPrices(symbols) {
    try {
        // Tạo một mảng chứa các cặp tỷ giá đã được mã hóa
        const requests = symbols.map(symbol => {
            return axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        });

        // Gửi tất cả các request đồng thời
        const responses = await Promise.all(requests);

        // Trích xuất giá từ các phản hồi
        const prices = responses.map(response => ({
            symbol: response.data.symbol,
            price: parseFloat(response.data.price) // Chuyển đổi giá thành số
        }));

        return prices;

    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

// Ví dụ sử dụng
const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
getPrices(symbols).then(prices => {
    console.log(prices);
});