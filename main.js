require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const path = require('path')
const { read, write } = require('./utils/FS')
const { TOKEN } = process.env
const axios = require('axios')
const fs = require('fs')

const bot = new TelegramBot(TOKEN, {
    polling: true
})

const mainKeyboard = JSON.stringify({
    keyboard: [
        [{text: 'About me 👨‍💻'}, { text: 'Repositories 📁'}],
        [{ text: 'My skills 📊'}, {text: 'Support 📞'}]
    ],
    resize_keyboard: true
})


let step = false

bot.on('message', msg => {
    
    const message = msg.text
    const chatId = msg.chat.id
    const userId = msg.from.id
    const name = msg.chat.first_name
    const username = msg.chat.username
    
    
    const users = read('users')
    const admins = users.filter(el => el.role == 'admin')

    const foundUser = users.find(el => el.id == chatId)

    if (!foundUser) {
        
        // bot.sendMessage(el.id, `Yangi foydalanuvchi qo'shildi\n\nName: ${name}\nUsername: `)
        bot.getUserProfilePhotos(userId, 0, 1).then(data => {
            bot.sendPhoto(502480594, data.photos[0][0].file_id, {
                caption: `Yangi foydalanuvchi qo'shildi\n\nName: ${name}\nUsername: @${username} `
            })
        })
        .then(payload => {
            users.push({id: chatId, role: 'user'})
            write('users', users)
            return
        })
    
    }

    if (message == '/start') {

        // bot.sendMessage(chatId, `Assalomu aleykum ${name}\n\n Sog'indiqning portfolio botiga xush kelibsiz`, {
        //     reply_markup: mainKeyboard
        // }) // oddiy salomlashish

        // bot.getUserProfilePhotos(userId, 0, 1).then(data => {
        //     bot.sendPhoto(chatId, data.photos[0][0].file_id, {
        //         caption: `Assalomu aleykum ${name}\n\n Sog'indiqning portfolio botiga xush kelibsiz`,
        //         reply_markup: mainKeyboard
        //     });
        // }); // oz rasmini o'ziga jonatib salomlashish

        bot.sendPhoto(chatId, path.join(__dirname, 'assets', 'image', 'hi.jpg'),{
            caption: `Assalomu aleykum ${name}\n\n Sog'indiqning portfolio botiga xush kelibsiz`,
            reply_markup: mainKeyboard
        }) // static rasmni jonatib salomlashish

    }

    if (message == 'About me 👨‍💻') {
        bot.sendMessage(chatId, `*Assalommu aleykum.* \nMening ismim _Sog'indiq_. \n\nMen 2002-yil Toshkent viloyati \nBekobod tumanida tug'ilganman. \n\nHozirda yoshim 20 da. \nHozirda Najot Talim o'quv markazida Full stack web dasturlash kursida o'qivomman`, {
            parse_mode: 'Markdown'
        })
    }

    if (message == 'Repositories 📁') {
        axios.get('https://api.github.com/users/Sagindiq/repos')
            .then(res => {
                if (res.data.length) {
                    res.data.map((el, i) => {
                        const name = el.name
                        const fullName = el.full_name
                        const visibility = el.private
                        const isPublic = visibility == false ? 'public' : 'private'
                        const htmlUrl = el.html_url
                        const apiUrl = el.url
                        const description = el.description
                        const createdAt = el.created_at
                        const createdT = new Date(createdAt)
                        const updatedT = new Date(el.updated_at)
                        const timeGenerator = time => `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}/${time.getHours()}:${time.getMinutes()}`
                        const createdTime = timeGenerator(createdT)
                        const updatedTime = timeGenerator(updatedT)
                        const language = el.language
                        const size = el.size

                        bot.sendMessage(chatId, 
                            `Repository name: *${name}* \nFull name: *${fullName}* \nVisibility: *${isPublic}* \nVisit repo: ${htmlUrl} \n\nDescription: *${description}* \nCreated date: *${createdTime}* \nUpdated data: *${updatedTime}* \nLanguage: *${language}*\nSize: ${size}`,
                            {
                                parse_mode: 'Markdown',
                                reply_markup: {
                                    inline_keyboard: [
                                        [ {text: 'Visit Repository', url: htmlUrl}]
                                    ]
                                }
                            }
                        )
                    })
                }
            }
        )
    }

    if (message == 'My skills 📊') {
        bot.sendMessage(chatId,`Men biladigan texnologiyalar \n\nFront end:\nHTML = 90%\nCSS = 85%\nSCSS = 82% \nBOOTSTRAP = 75% \nJAVASCRIPT = 55% \nREACT JS = 70% \n\nBack End \nNode js = 65% \nExpress Js = 60%`)
    }

    if (message == 'Support 📞') {
        bot.sendMessage(chatId, 'Xabaringizni yozing men adminga jo`natib qo`yaman', {
            parse_mode: 'Markdown'
        }).then(payload => {
            step = true
        })
    }

    if (step == true) {
        admins.map(el => {
            bot.forwardMessage(el.id, chatId, msg.message_id)
        })

        bot.sendMessage(chatId, 'yuborildi')
        step = false
    }

    bot.forwardMessage(msg.reply_to_message.forward_from.id,  chatId, msg.message_id)
})