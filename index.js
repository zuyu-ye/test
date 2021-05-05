import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const response = await axios.get('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=17')
      const data = response.data.filter(data => {
        return data.title === event.message.text
      })

      let reply = ''
      for (const d of data.showInfo) {
        reply += `location:${d.location} \nlocationName:${d.locationName} \ntime:${d.time} \n \n`
      }
      event.reply(reply)
    } catch (error) {
      event.reply('查詢失敗，重新輸入關鍵字')
    }
  }
})
