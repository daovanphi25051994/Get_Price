const { tokenBotDiscord, URL_binance, symbols } = require('./config.json');

const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { format } = require('date-fns');
function getDateTime() {
    const date = new Date();
    return  format(date, 'yyyy-MM-dd HH:mm:ss');
}
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

async function getPrices(symbols) {
    try {
        // Tạo một mảng chứa các cặp tỷ giá đã được mã hóa
        const requests = symbols.map(symbol => {
            return axios.get(`${URL_binance}?symbol=${symbol}`);
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

// Khi bot sẵn sàng
client.once('ready', () => {
    console.log(`Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);
    const getPrice = async () => {
        try {
            getPrices(symbols).then(prices => {
                const channel = client.channels.cache.get('1291974686799826960'); // Thay thế với ID của kênh Discord
                if (channel) {
                    let message = 'Dữ liệu được cập nhật lúc: ' + getDateTime() + '\n';
                    prices.forEach(item =>{
                        message += '-📈' + item.symbol + ': $' + item.price + '\n';
                    })
                    message += '\n';
                    channel.send(message);
                    console.log(message);
                }
            });
        } catch (error) {
            console.error(getDateTime() + 'Lỗi khi kiểm tra trạng thái hàng:', error);
        }
    };
    // Lấy giá mới mỗi 10 giây
    setInterval(getPrice, 10000);
});


// Log in to Discord with your client's token
client.login(tokenBotDiscord);









