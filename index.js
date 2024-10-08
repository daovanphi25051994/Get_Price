// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');
const { token } = require('./config.json');
const FormData = require('form-data');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


// Đường dẫn của trang web Apple Nhật Bản (thay đổi URL và endpoint nếu cần)
const APPLE_STORE_URL = 'https://secure8.store.apple.com/jp/shop/checkout?_s=Fulfillment-init';

// Khi bot sẵn sàng
client.once('ready', () => {
    console.log(`Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);

    // Hàm kiểm tra xem iPhone 16 có còn hàng không
    const checkStock = async () => {
        try {
            // // Gửi yêu cầu GET tới trang web của Apple
            const response = await axios.get(APPLE_STORE_URL, {
                headers: {
                     'cookie': 'as_dc=ucp5; as_ltn_jp=AAQEAMIOoC-qnJyg-2K5Vwnw4Nr0RHV1Wc-tu-RPq_aestwbzPd6qxJ3-vVO54NxLUv4KChSdCXelF_vcxS21VmlelLMs9sCoGQ; as_pcts=xqejFlWwwbvLU-Qi5hXnqKYcEy5Z3oM-N4iUeY6PLaQ_wZUpCzq0xIz29MH::e5d1wO-fpN4AVBigZJTsiJnYxhcDHgmGn-PbwzvEHDGIa_FcXCWADmZ+TxapLvKIQhu+QwUvyUXJLQHCygnELhQCLXveJxvee:Wo_gzkQkw-5uuu+KbHseR-UZGZ; dssf=1; dssid2=c978c446-7ace-4c7a-b0b8-bf2e101b0ced',
                }
            })
            .then(response => {
                const $ = cheerio.load(response.data);
                // Lấy nội dung của thẻ body
                const bodyContent = $('body').html();
                console.log(bodyContent);
                if(response.status == 200) {
                    if (response.data.includes('お近くでは在庫がありません。別の検索条件で試してみてください。')) { // Cụm từ này có thể thay đổi theo ngôn ngữ trang web và tình trạng sản phẩm
                        console.log('iPhone 16 hiện không có sẵn.');
                    } else {
                        console.log('iPhone 16 có sẵn!');
                        const channel = client.channels.cache.get('1291974686799826960'); // Thay thế với ID của kênh Discord
                        if (channel) {
                            channel.send('🎉 iPhone 16 đã có hàng! Mua ngay tại: ' + APPLE_STORE_URL);
                        }
                    }
                } else {
                    console.log('Lỗi: ' + response.status);
                    console.log('Cokkie: ' + response.config.headers.cookie);
                }
    
            })
            .catch(error => {
                console.error('Lỗi khi gửi request:', error);
            });
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái hàng:', error);
        }
    };

    // Kiểm tra trạng thái hàng mỗi 6 giây
    setInterval(checkStock, 10000);
});



// Log in to Discord with your client's token
client.login(token);











