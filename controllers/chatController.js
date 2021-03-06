const db = require('../models');
const User = db.User;
const ChatMessage = db.ChatMessage;
const privatemassage = db.privatemassage

const chatController = {
  getChatRoomChats: async (req, res) => {
    const today = new Date().getTime();

    const history = await ChatMessage.findAll({
      order: [['time', 'ASC']],
      include: [User]
    });
    // history.map((h) => {
    //   console.log('getTime=====', h.time.getTime());
    // });
    const msg = await history.map((m) => {
      const timeDiff = today - m.time.getTime();
      const timeDiffDays = timeDiff / (1000 * 3600 * 24);
      console.log(timeDiffDays);
      if (timeDiffDays > 3) {
        m.destroy();
      }
      return {
        UserId: m.dataValues.UserId,
        avatar: m.User.dataValues.avatar,
        message: m.dataValues.message,
        time: m.dataValues.time
      };
    });

    res.render('chatroom', { msg: await msg });
  },

  getOneChatPage: async (req, res) => {
    const id = req.user.id;
    let myMassage = await privatemassage.findAll({
      raw: true,nest: true,
      where: { RecipientId:id },
      order: [['time', 'DESC']],
      include: [        
        User,
      ],
    })
   
  let massages = myMassage
    massages = massages.map((m) => ({
      ...m,
      senderUserAvatar:m.User.avatar,
      senderUserName:m.User.name,
      senderUserAccount:m.User.account,
      sendTime:m.time,
      sendMassage:m.massage,
   }))
    
    console.log(massages)
    res.render('oneChatroom',{historyMassages:massages})
  },
};


module.exports = chatController;
